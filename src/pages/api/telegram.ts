// Telegram bot webhook. The visitor opens t.me/<bot>?start=<leadId> from the success card or the
// auto-reply; Telegram posts the "/start <leadId>" message here. We save their chat id on the lead,
// confirm in the lead's language and run a short pre-call questionnaire.
// Stateless: the current question lives in the lead's Airtable "Step" field; every message or
// button tap looks the lead up by chat id. The reply goes back in the response body (Telegram runs
// it as an API call); extra calls (edit the answered question, the studio summary) use the token.
// Register once per deploy URL with setWebhook (see .env.example; needs callback_query).
import type { APIRoute } from 'astro';
import { TELEGRAM_WEBHOOK_SECRET } from 'astro:env/server';
import {
  esc,
  findChatLead,
  isLeadId,
  telegram,
  toStudio,
  updateLead,
} from '../../lib/leads';
import { t, type Lang } from '../../i18n/utils';

export const prerender = false;

type Chat = { id: number; type: string };
type Update = {
  message?: {
    text?: string;
    chat: Chat;
    from?: { language_code?: string };
  };
  callback_query?: {
    id: string;
    data?: string;
    from?: { language_code?: string };
    message?: { message_id: number; text?: string; chat: Chat };
  };
};

// Question order and the Airtable column each answer goes to.
const fields = {
  slot: 'CallSlot',
  business: 'Business',
  site: 'CurrentSite',
  budget: 'Budget',
  timing: 'Timing',
} as const;
type Step = keyof typeof fields;
const steps = Object.keys(fields) as Step[];
const isStep = (s?: string): s is Step => !!s && s in fields;

const ok = () => new Response(null, { status: 200 });
const reply = (body: object) =>
  Response.json({ link_preview_options: { is_disabled: true }, ...body });
const langOf = (locale?: string, fallback?: string): Lang =>
  locale === 'uk' || locale === 'en' ? locale : fallback === 'uk' ? 'uk' : 'en';

/** A question with one button per option, plus "Other" and "Skip". */
function ask(lang: Lang, step: Step, chatId: number, prefix = '') {
  const bot = t(lang).contact.bot;
  const q = bot.questions[step];
  // Every button is coloured (Bot API 9.4): blue "primary" moves forward (answers, Other, Start over),
  // red "danger" declines (Skip, Keep my answers).
  // Older Telegram apps ignore `style` and show the plain button.
  const buttons: { text: string; callback_data: string; style?: string }[] =
    q.options.map((text, i) => ({
      text,
      callback_data: `a:${step}:${i}`,
      style: 'primary',
    }));
  if (q.other)
    buttons.push({
      text: bot.other,
      callback_data: `a:${step}:other`,
      style: 'primary',
    });
  buttons.push({
    text: bot.skip,
    callback_data: `a:${step}:skip`,
    style: 'danger',
  });
  return {
    method: 'sendMessage',
    chat_id: chatId,
    text: prefix + q.text,
    reply_markup: { inline_keyboard: buttons.map((b) => [b]) },
  };
}

/**
 * (Re)starts the questionnaire at the first question. Earlier answers stay: a skip leaves the
 * field untouched (undefined is dropped from the PATCH), so a redo only overwrites what's re-answered.
 */
async function begin(leadId: string, lang: Lang, chatId: number, prefix = '') {
  await updateLead(leadId, { Step: steps[0] });
  return ask(
    lang,
    steps[0],
    chatId,
    `${prefix}${t(lang).contact.bot.intro}\n\n`,
  );
}

/** Saves the answer (undefined = skipped), moves Step on, returns the next message. */
async function answer(
  leadId: string,
  lang: Lang,
  step: Step,
  value: string | undefined,
  chatId: number,
) {
  const next = steps[steps.indexOf(step) + 1] as Step | undefined;
  const lead = await updateLead(leadId, {
    [fields[step]]: value,
    Step: next ?? 'done',
  });
  if (next) return ask(lang, next, chatId);
  // ponytail: summary only when finished; an abandoned questionnaire stays in Airtable unannounced.
  const line = (label: string, v?: string) => `${label}: ${esc(v || '—')}`;
  await toStudio(
    [
      `<b>Questionnaire${lead.Redone ? ' (updated)' : ''}</b>: ${esc(lead.Name ?? '')} ${esc(lead.Phone ?? '')}`,
      line('Call', lead.CallSlot),
      line('Business', lead.Business),
      line('Site', lead.CurrentSite),
      line('Budget', lead.Budget),
      line('Timing', lead.Timing),
    ].join('\n'),
  ).catch((err) => console.error('telegram: summary failed:', err));
  // Thanks + everything they entered, with Start over right here in case something's off.
  // Airtable holds the English button label; show it in their language (typed text as is).
  const bot = t(lang).contact.bot;
  const shown = (s: Step) => {
    const v = lead[fields[s]];
    const i = t('en').contact.bot.questions[s].options.indexOf(v ?? '');
    return i >= 0 ? bot.questions[s].options[i] : v || '—';
  };
  const list = steps.map((s) => `${bot.questions[s].label}: ${shown(s)}`);
  return {
    method: 'sendMessage',
    chat_id: chatId,
    text: [bot.done, '', bot.answers, ...list].join('\n'),
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: t(lang).contact.bot.restart,
            callback_data: 'restart',
            style: 'primary',
          },
        ],
      ],
    },
  };
}

export const POST: APIRoute = async ({ request, site, url }) => {
  // Fail closed: no secret configured = nobody gets in.
  if (
    !TELEGRAM_WEBHOOK_SECRET ||
    request.headers.get('x-telegram-bot-api-secret-token') !==
      TELEGRAM_WEBHOOK_SECRET
  )
    return new Response(null, { status: 401 });

  const update = (await request.json()) as Update;
  // Always 200 from here on, or Telegram keeps retrying the update.
  try {
    if (update.callback_query) return await onButton(update.callback_query);
    const { message } = update;
    // Private chats only; the bot also sits in the studio group.
    if (!message?.text || message.chat.type !== 'private') return ok();
    const chatId = message.chat.id;
    const userLang = message.from?.language_code;

    const start = message.text.match(/^\/start(?:\s+(\S+))?/);
    if (start) {
      const payload = start[1];
      // The site link carries the lead id (save the chat id; the returned record says how far
      // the questionnaire got). A typed /start has none: find the chat's lead instead.
      const lead =
        payload && isLeadId(payload)
          ? await updateLead(payload, { TelegramChatId: String(chatId) })
              .then((fields) => ({ id: payload, fields }))
              .catch((err) => console.error('telegram: link failed:', err))
          : await findChatLead(chatId);
      if (!lead) return hello(chatId, langOf(undefined, userLang));
      const { Name, Locale, Step } = lead.fields;
      const lang = langOf(Locale, userLang);
      const bot = t(lang).contact.bot;
      // Finished: say so, and offer to answer again (misclicked, changed their mind) or keep them.
      if (Step === 'done')
        return reply({
          method: 'sendMessage',
          chat_id: chatId,
          text: bot.already.replace('{name}', Name ?? ''),
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: bot.restart,
                  callback_data: 'restart',
                  style: 'primary',
                },
              ],
              [{ text: bot.keep, callback_data: 'keep', style: 'danger' }],
            ],
          },
        });
      const confirmed = bot.confirmed.replace('{name}', Name ?? '');
      // Half done: carry on from the current question, with a way to start over.
      if (isStep(Step)) {
        const q = ask(lang, Step, chatId, `${confirmed}\n\n`);
        q.reply_markup.inline_keyboard.push([
          { text: bot.restart, callback_data: 'restart', style: 'primary' },
        ]);
        return reply(q);
      }
      return reply(await begin(lead.id, lang, chatId, `${confirmed}\n\n`));
    }

    // Free text answers the current question (a link, an "Other" value...).
    const lead = await findChatLead(chatId);
    const step = lead?.fields.Step;
    if (!lead || !isStep(step))
      return hello(chatId, langOf(undefined, userLang));
    const lang = langOf(lead.fields.Locale, userLang);
    return reply(
      await answer(lead.id, lang, step, message.text.slice(0, 500), chatId),
    );
  } catch (err) {
    console.error('telegram: update failed:', err);
    return ok();
  }

  function hello(chatId: number, lang: Lang) {
    const home = new URL(lang === 'en' ? '/' : `/${lang}/`, site ?? url).href;
    return reply({
      method: 'sendMessage',
      chat_id: chatId,
      text: t(lang).contact.bot.hello.replace('{site}', home),
    });
  }
};

async function onButton(cb: NonNullable<Update['callback_query']>) {
  // Stops the button's loading spinner; done whatever happens next.
  const done = () =>
    telegram('answerCallbackQuery', { callback_query_id: cb.id }).catch((err) =>
      console.error('telegram: answerCallbackQuery failed:', err),
    );
  const msg = cb.message;
  if (!msg || msg.chat.type !== 'private') return done().then(ok);

  if (cb.data === 'keep') {
    const lead = await findChatLead(msg.chat.id);
    const lang = langOf(lead?.fields.Locale, cb.from?.language_code);
    await Promise.all([
      done(),
      telegram('editMessageReplyMarkup', {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
      }).catch((err) => console.error('telegram: edit failed:', err)),
    ]);
    return reply({
      method: 'sendMessage',
      chat_id: msg.chat.id,
      text: t(lang).contact.bot.kept,
    });
  }

  if (cb.data === 'restart') {
    const lead = await findChatLead(msg.chat.id);
    if (!lead) return done().then(ok);
    const lang = langOf(lead.fields.Locale, cb.from?.language_code);
    // Drop the button so it can't be tapped twice.
    await Promise.all([
      done(),
      telegram('editMessageReplyMarkup', {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
      }).catch((err) => console.error('telegram: edit failed:', err)),
    ]);
    // Marks the redo so the next summary says "updated". Separate and non-fatal: without the
    // Airtable "Redone" column (single line text) the restart still works, just unlabelled.
    const [, next] = await Promise.all([
      updateLead(lead.id, { Redone: 'yes' }).catch((err) =>
        console.error('telegram: Redone failed:', err),
      ),
      begin(lead.id, lang, msg.chat.id),
    ]);
    return reply(next);
  }

  const [, step, choice] = cb.data?.split(':') ?? [];
  if (!isStep(step)) return done().then(ok);

  const lead = await findChatLead(msg.chat.id);
  // A tap on an old question (already answered) is ignored.
  if (!lead || lead.fields.Step !== step) return done().then(ok);
  const lang = langOf(lead.fields.Locale, cb.from?.language_code);
  const bot = t(lang).contact.bot;

  if (choice === 'other') {
    await done();
    return reply({
      method: 'sendMessage',
      chat_id: msg.chat.id,
      text: bot.otherPrompt,
    });
  }
  const i = Number(choice);
  const label = bot.questions[step].options[i];
  if (choice !== 'skip' && !label) return done().then(ok);

  // Drop the answered question's buttons (no reply_markup = removed); the answers are listed at the end.
  await Promise.all([
    done(),
    telegram('editMessageReplyMarkup', {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
    }).catch((err) => console.error('telegram: edit failed:', err)),
  ]);
  // Airtable gets the English label, so the studio reads one language.
  const value = label && t('en').contact.bot.questions[step].options[i];
  return reply(await answer(lead.id, lang, step, value, msg.chat.id));
}
