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
  findActiveLead,
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
  // Answers in solid blue ("primary", Bot API 9.4); Other and Skip keep the default look.
  // Older Telegram apps ignore `style` and show the plain button.
  const buttons: { text: string; callback_data: string; style?: string }[] =
    q.options.map((text, i) => ({
      text,
      callback_data: `a:${step}:${i}`,
      style: 'primary',
    }));
  if (q.other)
    buttons.push({ text: bot.other, callback_data: `a:${step}:other` });
  buttons.push({ text: bot.skip, callback_data: `a:${step}:skip` });
  return {
    method: 'sendMessage',
    chat_id: chatId,
    text: prefix + q.text,
    reply_markup: { inline_keyboard: buttons.map((b) => [b]) },
  };
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
      `<b>Questionnaire</b>: ${esc(lead.Name ?? '')} ${esc(lead.Phone ?? '')}`,
      line('Call', lead.CallSlot),
      line('Business', lead.Business),
      line('Site', lead.CurrentSite),
      line('Budget', lead.Budget),
      line('Timing', lead.Timing),
    ].join('\n'),
  ).catch((err) => console.error('telegram: summary failed:', err));
  return {
    method: 'sendMessage',
    chat_id: chatId,
    text: t(lang).contact.bot.done,
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
      if (payload && isLeadId(payload)) {
        // (Re)starts the questionnaire from the first question.
        const lead = await updateLead(payload, {
          TelegramChatId: String(chatId),
          Step: steps[0],
        }).catch((err) => console.error('telegram: link failed:', err));
        if (lead) {
          const lang = langOf(lead.Locale, userLang);
          const bot = t(lang).contact.bot;
          const confirmed = bot.confirmed.replace('{name}', lead.Name ?? '');
          return reply(
            ask(lang, steps[0], chatId, `${confirmed}\n\n${bot.intro}\n\n`),
          );
        }
      }
      return hello(chatId, langOf(undefined, userLang));
    }

    // Free text answers the current question (a link, an "Other" value...).
    const lead = await findActiveLead(chatId);
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
  const [, step, choice] = cb.data?.split(':') ?? [];
  const msg = cb.message;
  if (!msg || msg.chat.type !== 'private' || !isStep(step))
    return done().then(ok);

  const lead = await findActiveLead(msg.chat.id);
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

  // Show the choice under the question and drop its buttons (no reply_markup = removed).
  await Promise.all([
    done(),
    telegram('editMessageText', {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      text: `${msg.text ?? ''}\n\n→ ${label ?? bot.skip}`,
    }).catch((err) => console.error('telegram: edit failed:', err)),
  ]);
  // Airtable gets the English label, so the studio reads one language.
  const value = label && t('en').contact.bot.questions[step].options[i];
  return reply(await answer(lead.id, lang, step, value, msg.chat.id));
}
