import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { countries, toE164 } from '../data/phone';
import { renderAutoReply } from '../lib/autoreply-email';
import { sendAutoReply, sendLead, telegramLink } from '../lib/leads';

// Faster than this from page load to submit is a bot.
const MIN_FILL_MS = 3000;

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z
      .object({
        name: z.string().trim().min(2).max(100),
        country: z.enum(countries),
        phone: z.string().max(30),
        email: z.email().max(254),
        locale: z.enum(['en', 'uk']),
        // Honeypot: hidden from people, bots fill it.
        website: z.string().optional(),
        elapsed: z.coerce.number(),
      })
      // The same check the form runs; the handler then sends the normalised number.
      .refine((v) => toE164(v.country, v.phone), { path: ['phone'] }),
    handler: async (input, ctx) => {
      // Bots get a fake success so they don't retry or learn what tripped them.
      if (input.website || input.elapsed < MIN_FILL_MS) return { ok: true };
      const { ok, leadId } = await sendLead({
        name: input.name,
        phone: toE164(input.country, input.phone)!,
        email: input.email,
        locale: input.locale,
        page: ctx.request.headers.get('referer') ?? undefined,
      });
      if (!ok)
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Lead delivery failed',
        });

      // "Open in Telegram" (bot confirmation), shown on the success card and in the auto-reply.
      const telegram = telegramLink(leadId);

      // Auto-reply in the visitor's language. Best effort: the lead is already delivered.
      try {
        await sendAutoReply(
          input.email,
          renderAutoReply(
            input.locale,
            input.name,
            ctx.site?.href ?? ctx.url.origin,
            telegram,
          ),
        );
      } catch (err) {
        console.error('lead: autoreply failed:', err);
      }
      return { ok: true, telegram };
    },
  }),
};
