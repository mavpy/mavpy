// Lead delivery: Airtable (the record) and Telegram (the ping), sent in parallel.
// To add a channel (email, CRM), add one more function to `channels`.
import {
  AIRTABLE_BASE_ID,
  AIRTABLE_TABLE,
  AIRTABLE_TOKEN,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
} from 'astro:env/server';

export type Lead = {
  name: string;
  email: string;
  goal: string;
  locale: string;
  page?: string;
};

const channels = { airtable: toAirtable, telegram: toTelegram };

/** True if at least one channel got the lead; failures are logged, not thrown. */
export async function sendLead(lead: Lead): Promise<boolean> {
  const names = Object.keys(channels) as (keyof typeof channels)[];
  const results = await Promise.allSettled(names.map((n) => channels[n](lead)));
  results.forEach((r, i) => {
    if (r.status === 'rejected')
      console.error(`lead: ${names[i]} failed:`, r.reason);
  });
  return results.some((r) => r.status === 'fulfilled');
}

async function toAirtable(lead: Lead) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) throw new Error('not configured');
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;
  await post(
    url,
    { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    {
      // typecast lets Airtable create a missing select option instead of rejecting the record.
      typecast: true,
      fields: {
        Name: lead.name,
        Email: lead.email,
        Goal: lead.goal,
        Locale: lead.locale,
        Page: lead.page,
        Status: 'New',
      },
    },
  );
}

async function toTelegram(lead: Lead) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID)
    throw new Error('not configured');
  const lines = [
    `<b>New lead</b> (${lead.locale.toUpperCase()})`,
    `Name: ${esc(lead.name)}`,
    `Email: ${esc(lead.email)}`,
    `Goal: ${esc(lead.goal)}`,
  ];
  if (lead.page) lines.push(`Page: ${esc(lead.page)}`);
  await post(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {},
    {
      chat_id: TELEGRAM_CHAT_ID,
      text: lines.join('\n'),
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
    },
  );
}

async function post(
  url: string,
  headers: Record<string, string>,
  body: unknown,
) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  // The response body carries the API's reason (bad token, unknown field...); the URL isn't logged.
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
}

/** Telegram's HTML mode only needs these three escaped. */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
