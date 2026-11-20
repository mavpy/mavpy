import type { Dict } from '../i18n/en';

// Contact form goal options: the pricing card titles plus "Other". The ids are what the form sends.
export const goalIds = ['attract', 'launch', 'revamp', 'other'] as const;
export type Goal = (typeof goalIds)[number];

export const goalLabel = (d: Dict, goal: Goal) =>
  goal === 'other'
    ? d.contact.other
    : d.pricing.items[goalIds.indexOf(goal)].title;
