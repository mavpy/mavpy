// Telegram bot webhook. The visitor opens t.me/<bot>?start=<leadId> from the success card or the
// auto-reply; Telegram posts the "/start <leadId>" message here. We save their chat id on the lead
// (so the bot can message them later) and confirm in the lead's language.
// The reply goes back in the response body (Telegram runs it as a sendMessage call), so no token
// is needed here. Register once per deploy URL with setWebhook (see .env.example).
import type { APIRoute } from 'astro';
import { TELEGRAM_WEBHOOK_SECRET } from 'astro:env/server';
import { isLeadId, linkTelegram } from '../../lib/leads';
import { t, type Lang } from '../../i18n/utils';

export const prerender = false;

type Update = {
  message?: {
    text?: string;
    chat: { id: number; type: string };
    from?: { language_code?: string };
  };
};

export const POST: APIRoute = async ({ request, site, url }) => {
  // Fail closed: no secret configured = nobody gets in.
  if (
    !TELEGRAM_WEBHOOK_SECRET ||
    request.headers.get('x-telegram-bot-api-secret-token') !==
      TELEGRAM_WEBHOOK_SECRET
  )
    return new Response(null, { status: 401 });

  const { message } = (await request.json()) as Update;
  // Only /start in a private chat; the bot also sits in the studio group, ignore that.
  const start = message?.text?.match(/^\/start(?:\s+(\S+))?/);
  if (!message || !start || message.chat.type !== 'private')
    return new Response(null, { status: 200 });
  const payload = start[1];

  let lang: Lang = message.from?.language_code === 'uk' ? 'uk' : 'en';
  let text: string;
  try {
    if (!payload || !isLeadId(payload)) throw new Error('no lead id');
    const lead = await linkTelegram(payload, message.chat.id);
    if (lead.Locale === 'uk' || lead.Locale === 'en') lang = lead.Locale;
    text = t(lang).contact.bot.confirmed.replace('{name}', lead.Name ?? '');
  } catch (err) {
    // Unknown or missing lead: a friendly pointer to the form. Always 200, or Telegram retries.
    if (payload) console.error('telegram: link failed:', err);
    const home = new URL(lang === 'en' ? '/' : `/${lang}/`, site ?? url).href;
    text = t(lang).contact.bot.hello.replace('{site}', home);
  }

  return Response.json({
    method: 'sendMessage',
    chat_id: message.chat.id,
    text,
    link_preview_options: { is_disabled: true },
  });
};
