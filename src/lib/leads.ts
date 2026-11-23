// Lead delivery: Airtable (the record) and Telegram (the ping), sent in parallel.
// To add a channel (email, CRM), add one more function to `channels`.
import {
  AIRTABLE_BASE_ID,
  AIRTABLE_TABLE,
  AIRTABLE_TOKEN,
  MAIL_FROM,
  RESEND_API_KEY,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_BOT_USERNAME,
  TELEGRAM_CHAT_ID,
} from 'astro:env/server';
import { site } from '../data/site';

export type Lead = {
  name: string;
  /** E.164, e.g. +380671234567. */
  phone: string;
  email: string;
  locale: string;
  page?: string;
};

const channels = { airtable: toAirtable, telegram: toTelegram };

/**
 * ok: at least one channel got the lead; failures are logged, not thrown.
 * leadId: the Airtable record id (when Airtable worked), used as the bot's /start payload.
 */
export async function sendLead(
  lead: Lead,
): Promise<{ ok: boolean; leadId?: string }> {
  const names = Object.keys(channels) as (keyof typeof channels)[];
  const results = await Promise.allSettled(names.map((n) => channels[n](lead)));
  results.forEach((r, i) => {
    if (r.status === 'rejected')
      console.error(`lead: ${names[i]} failed:`, r.reason);
  });
  const airtable = results[names.indexOf('airtable')];
  return {
    ok: results.some((r) => r.status === 'fulfilled'),
    leadId:
      airtable.status === 'fulfilled' ? (airtable.value as string) : undefined,
  };
}

/** "Open in Telegram" deep link for a lead; undefined if the bot or the lead id is missing. */
export const telegramLink = (leadId?: string) =>
  TELEGRAM_BOT_USERNAME && leadId
    ? `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${leadId}`
    : undefined;

/** Airtable record ids look like rec + 14 letters/digits; anything else isn't a lead id. */
export const isLeadId = (s: string) => /^rec[A-Za-z0-9]{14}$/.test(s);

const airtableUrl = () =>
  `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;

/** Creates the lead record and returns its id. */
async function toAirtable(lead: Lead): Promise<string> {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) throw new Error('not configured');
  const record = await send(
    airtableUrl(),
    { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    {
      // typecast lets Airtable create a missing select option instead of rejecting the record.
      typecast: true,
      fields: {
        Name: lead.name,
        Phone: lead.phone,
        Email: lead.email,
        Locale: lead.locale,
        Page: lead.page,
        Status: 'New',
      },
    },
  );
  return record.id;
}

/** Updates a lead's fields and returns all its fields (the PATCH response carries the record). */
export async function updateLead(
  leadId: string,
  fields: Record<string, string | undefined>,
) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) throw new Error('not configured');
  const record = await send(
    `${airtableUrl()}/${leadId}`,
    { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    { typecast: true, fields },
    'PATCH',
  );
  return record.fields as Record<string, string | undefined>;
}

/**
 * The lead whose bot questionnaire is in progress in this chat (Step set and not "done").
 * Needs data.records:read on the token.
 */
export async function findActiveLead(chatId: number) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) throw new Error('not configured');
  const formula = `AND({TelegramChatId}='${chatId}', {Step}!='', {Step}!='done')`;
  const res = await fetch(
    `${airtableUrl()}?filterByFormula=${encodeURIComponent(formula)}&sort%5B0%5D%5Bfield%5D=Created`,
    {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const { records } = (await res.json()) as {
    records: { id: string; fields: Record<string, string | undefined> }[];
  };
  // Two unfinished questionnaires in one chat (two requests): the newest one.
  return records.at(-1);
}

/** Calls a Telegram Bot API method with the bot token. */
export async function telegram(method: string, body: unknown) {
  if (!TELEGRAM_BOT_TOKEN) throw new Error('not configured');
  return send(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`,
    {},
    body,
  );
}

async function toTelegram(lead: Lead) {
  if (!TELEGRAM_CHAT_ID) throw new Error('not configured');
  const lines = [
    `<b>New lead</b> (${lead.locale.toUpperCase()})`,
    `Name: ${esc(lead.name)}`,
    `Phone: ${esc(lead.phone)}`,
    `Email: ${esc(lead.email)}`,
  ];
  if (lead.page) lines.push(`Page: ${esc(lead.page)}`);
  await toStudio(lines.join('\n'));
}

/** HTML message to the studio group. */
export async function toStudio(html: string) {
  if (!TELEGRAM_CHAT_ID) throw new Error('not configured');
  await telegram('sendMessage', {
    chat_id: TELEGRAM_CHAT_ID,
    text: html,
    parse_mode: 'HTML',
    link_preview_options: { is_disabled: true },
  });
}

/**
 * Auto-reply to the person who submitted the form (Resend). Not a delivery channel: it's
 * separate from sendLead so a failure here never fails a lead. Skipped when no key is set.
 * Replies go to the studio inbox. Content comes from autoreply-email.ts.
 */
export async function sendAutoReply(
  to: string,
  mail: { subject: string; html: string; text: string },
) {
  if (!RESEND_API_KEY) return;
  await send(
    'https://api.resend.com/emails',
    { Authorization: `Bearer ${RESEND_API_KEY}` },
    {
      // Resend's shared test sender until our domain is verified (it only delivers to the account owner).
      from: MAIL_FROM || 'MAVPY <onboarding@resend.dev>',
      to,
      reply_to: site.email,
      ...mail,
    },
  );
}

async function send(
  url: string,
  headers: Record<string, string>,
  body: unknown,
  method = 'POST',
) {
  const res = await fetch(url, {
    method,
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  // The response body carries the API's reason (bad token, unknown field...); the URL isn't logged.
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

/** Telegram's HTML mode only needs these three escaped. */
export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
