import type { Dict } from '../i18n/en';

// Contact form goal options. The ids are what the form sends; labels live in contact.goals.
export const goalIds = ['attract', 'launch', 'revamp', 'other'] as const;
export type Goal = (typeof goalIds)[number];

export const goalLabel = (d: Dict, goal: Goal) => d.contact.goals[goal];
