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

type Fields = Record<string, string | undefined>;

/** A saved answer in their language (Airtable holds the English button label; typed text as is). */
function shown(lang: Lang, lead: Fields, step: Step) {
  const v = lead[fields[step]];
  const i = t('en').contact.bot.questions[step].options.indexOf(v ?? '');
  return i >= 0 ? t(lang).contact.bot.questions[step].options[i] : v;
}

/**
 * A question with one button per option, plus "Other", "Skip" and (before the last question)
 * "Finish now" (redo only). On a redo it shows the saved answer, which Skip keeps.
 */
function ask(
  lang: Lang,
  step: Step,
  chatId: number,
  lead: Fields,
  prefix = '',
) {
  const bot = t(lang).contact.bot;
  const q = bot.questions[step];
  const current = shown(lang, lead, step);
  // Every button is coloured (Bot API 9.4): blue "primary" moves forward (answers, Other, Start over),
  // red "danger" declines (Skip), green "success" confirms (Finish now, All good).
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
  // Only on a redo (the first round goes through every question); on the last one Skip finishes.
  if (lead.Redone && step !== steps.at(-1))
    buttons.push({
      text: bot.finish,
      callback_data: `a:${step}:finish`,
      style: 'success',
    });
  return {
    method: 'sendMessage',
    chat_id: chatId,
    text:
      prefix +
      q.text +
      (current ? `\n\n${bot.current.replace('{answer}', current)}` : ''),
    reply_markup: { inline_keyboard: buttons.map((b) => [b]) },
  };
}

/**
 * (Re)starts the questionnaire at the first question. Earlier answers stay: a skip leaves the
 * field untouched (undefined is dropped from the PATCH), so a redo only overwrites what's re-answered.
 */
async function begin(
  leadId: string,
  lang: Lang,
  chatId: number,
  prefix = '',
  extra: Fields = {},
) {
  const lead = await updateLead(leadId, { ...extra, Step: steps[0] });
  return ask(
    lang,
    steps[0],
    chatId,
    lead,
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
  if (!next) return finish(leadId, lang, chatId, { [fields[step]]: value });
  const lead = await updateLead(leadId, { [fields[step]]: value, Step: next });
  return ask(lang, next, chatId, lead);
}

/** Ends the questionnaire (last answer, or "Finish now"): summary to the studio, review to them. */
async function finish(
  leadId: string,
  lang: Lang,
  chatId: number,
  last: Fields = {},
) {
  const lead = await updateLead(leadId, {
    ...last,
    Step: 'done',
    // When they last finished a round (first time or a redo). Airtable "AnswersUpdated":
    // date with time, shown in Kyiv time.
    AnswersUpdated: new Date().toISOString(),
  });
  // ponytail: summary only when finished; an abandoned questionnaire stays in Airtable unannounced.
  // On a redo, lines that differ from the answers saved at "Start over" are bold.
  const prev = lead.Redone ? parsePrevious(lead.PreviousAnswers) : undefined;
  const line = (label: string, col: string) => {
    const text = `${label}: ${esc(lead[col] || '—')}`;
    return prev && (prev[col] ?? '') !== (lead[col] ?? '')
      ? `<b>${text}</b>`
      : text;
  };
  await toStudio(
    [
      lead.Redone
        ? `<b>📋 Questionnaire (updated)</b>${prev ? '\nChanges are in bold.' : ''}`
        : '<b>📋 Questionnaire</b>',
      '',
      `Name: ${esc(lead.Name ?? '')}`,
      `Phone: ${esc(lead.Phone ?? '')}`,
      '',
      line('Call', fields.slot),
      line('Business', fields.business),
      line('Site', fields.site),
      line('Budget', fields.budget),
      line('Timing', fields.timing),
    ].join('\n'),
  ).catch((err) => console.error('telegram: summary failed:', err));
  return review(lang, lead, chatId, t(lang).contact.bot.done);
}

/** The answers saved at "Start over", or undefined (none, or not valid JSON). */
function parsePrevious(json?: string): Fields | undefined {
  try {
    return json ? (JSON.parse(json) as Fields) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * `head`, everything they entered, and "Is everything correct?" with All good / Start over.
 * Sent when they finish and on every /start after that.
 */
function review(lang: Lang, lead: Fields, chatId: number, head: string) {
  const bot = t(lang).contact.bot;
  const list = steps.map(
    (s) => `${bot.questions[s].label}: ${shown(lang, lead, s) || '—'}`,
  );
  return {
    method: 'sendMessage',
    chat_id: chatId,
    text: [head, ...list, '', bot.check].join('\n'),
    reply_markup: {
      inline_keyboard: [
        [{ text: bot.allGood, callback_data: 'keep', style: 'success' }],
        [{ text: bot.restart, callback_data: 'restart', style: 'primary' }],
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
      // Finished: show the answers again to confirm or redo (misclicked, changed their mind).
      if (Step === 'done')
        return reply(
          review(
            lang,
            lead.fields,
            chatId,
            bot.already.replace('{name}', Name ?? ''),
          ),
        );
      const confirmed = bot.confirmed.replace('{name}', Name ?? '');
      // Half done: carry on from the current question, with a way to start over.
      if (isStep(Step)) {
        const q = ask(lang, Step, chatId, lead.fields, `${confirmed}\n\n`);
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
    // Marks the redo (Airtable "Redone"): the summary says "updated" and questions get "Finish now".
    // "PreviousAnswers" (long text, JSON) keeps the answers as they were, so the summary can bold
    // what changed.
    const previous = Object.fromEntries(
      Object.values(fields).map((col) => [col, lead.fields[col] ?? '']),
    );
    return reply(
      await begin(lead.id, lang, msg.chat.id, '', {
        Redone: 'yes',
        PreviousAnswers: JSON.stringify(previous),
      }),
    );
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
  const edit = (choiceText: string) =>
    Promise.all([
      done(),
      telegram('editMessageText', {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        text: `${msg.text ?? ''}\n\n→ ${choiceText}`,
      }).catch((err) => console.error('telegram: edit failed:', err)),
    ]);

  if (choice === 'finish') {
    await edit(bot.finish);
    return reply(await finish(lead.id, lang, msg.chat.id));
  }
  const i = Number(choice);
  const label = bot.questions[step].options[i];
  if (choice !== 'skip' && !label) return done().then(ok);

  // Show the choice under the question and drop its buttons (no reply_markup = removed), so no
  // question looks unanswered; review() lists all the answers again at the end.
  await edit(label ?? bot.skip);
  // Airtable gets the English label, so the studio reads one language.
  const value = label && t('en').contact.bot.questions[step].options[i];
  return reply(await answer(lead.id, lang, step, value, msg.chat.id));
}
