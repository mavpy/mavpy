import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { goalIds, goalLabel } from '../data/goals';
import { en } from '../i18n/en';
import { t } from '../i18n/utils';
import { renderAutoReply } from '../lib/autoreply-email';
import { sendAutoReply, sendLead } from '../lib/leads';

// Faster than this from page load to submit is a bot.
const MIN_FILL_MS = 3000;

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().trim().min(2).max(100),
      email: z.email().max(254),
      goal: z.enum(goalIds),
      locale: z.enum(['en', 'uk']),
      // Honeypot: hidden from people, bots fill it.
      website: z.string().optional(),
      elapsed: z.coerce.number(),
    }),
    handler: async (input, ctx) => {
      // Bots get a fake success so they don't retry or learn what tripped them.
      if (input.website || input.elapsed < MIN_FILL_MS) return { ok: true };
      const ok = await sendLead({
        name: input.name,
        email: input.email,
        goal: goalLabel(en, input.goal), // English label, so the record reads the same for every locale
        locale: input.locale,
        page: ctx.request.headers.get('referer') ?? undefined,
      });
      if (!ok)
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Lead delivery failed',
        });

      // Auto-reply in the visitor's language. Best effort: the lead is already delivered.
      try {
        const goal = goalLabel(t(input.locale), input.goal);
        await sendAutoReply(
          input.email,
          renderAutoReply(
            input.locale,
            input.name,
            goal,
            ctx.site?.href ?? ctx.url.origin,
          ),
        );
      } catch (err) {
        console.error('lead: autoreply failed:', err);
      }
      return { ok: true };
    },
  }),
};
