// All English copy. Source: Figma (wins on copy, decided 2026-11-19). Sections add keys as they are built in M4.
type Facts = {
  goal: string;
  start: string;
  did: string;
  time: string;
  result: string;
};
export type CaseItem = {
  title: string;
  type: string;
  url: string;
  facts: Facts;
};
// TODO(copy): placeholder until Serhii sends the real facts for a case.
export const tbd = (lang: 'en' | 'uk' = 'en'): Facts => {
  const v = lang === 'uk' ? 'уточнюється' : 'to be confirmed';
  return { goal: v, start: v, did: v, time: v, result: v };
};

export const en = {
  meta: {
    title: 'MAVPY: conversion-focused websites for growing businesses',
    description:
      'A founder-led design studio. Websites that turn visitors into clients: scoped, priced upfront and delivered end-to-end.',
  },
  a11y: {
    skipToContent: 'Skip to content',
  },
  nav: {
    label: 'Main',
    home: 'MAVPY, home',
    howWeWork: 'How we work',
    cases: 'Cases',
    pricing: 'Pricing',
    contact: 'Contact',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
  },
  // The link that switches to the other language; its label is written in that language.
  langSwitch: { short: 'UA', label: 'Українською' },
  footer: {
    navLabel: 'Footer',
    slogan: 'Less noise. More results.',
    email: 'EMAIL:',
    phone: 'PHONE:',
    instagram: 'INST:',
    years: '2022-2026,',
    studio: 'MAVPY DESIGN STUDIO',
  },
  hero: {
    // Figma sets "websites" in bold, so the line is split around it.
    h1: {
      before: 'Conversion-focused ',
      em: 'websites',
      after: ' for growing businesses',
    },
    more: 'More',
    clients: 'clients',
    // Desktop breaks after every line; mobile only before the last one.
    statement: ['Not just', 'a new', 'website'],
    note: ['Scoped, priced upfront,', 'delivered end-to-end.'],
    cta: 'Get an estimate',
    // ink width of `clients` in ems (Helvetica Neue Thin, +4%): sizes the word to the column.
    clientsEm: 2.8,
  },
  trust: {
    label: 'Why MAVPY',
    items: [
      '30+ projects',
      'Fixed price, no surprises',
      'Founder-led, direct',
      'Reply within 24h',
    ],
  },
  pain: {
    label: 'situation',
    title: 'Which of these sounds like you right now?',
    sub: "Find yours below — that's what we'll build around.",
    // Each title is [before, after] a line break that only shows on desktop (as in Figma).
    cards: [
      {
        title: ['Your site', 'costs deals'],
        text: 'Visitors make up their minds in seconds, long before they ever read your pitch.',
      },
      {
        title: ["Referrals aren't", 'enough'],
        text: "Luck isn't a strategy. You need a steady, predictable stream of qualified leads.",
      },
      {
        // Figma copy; Webflow has "Admins drown in calls" (question for Serhii).
        title: ['High traffic,', 'no enquiries'],
        text: 'People visit, but the site fails to convert them into real business enquiries.',
      },
    ] as { title: [string, string]; text: string }[],
  },
  process: {
    label: 'process',
    title: 'How we do it',
    intro: 'One clear path. The right people for your goal — no more, no less.',
    // Titles are [before, after] a desktop-only line break, as in pain.cards.
    steps: [
      {
        title: ['Full cycle,', 'done for you'],
        text: 'From zero to a steady flow of clients — nothing lost in hand‑offs.',
      },
      {
        title: ['Minimal load', 'on your side'],
        text: 'We agree the decisions that matter, handle everything else, and leave you free to run your business.',
      },
      {
        title: ['Result in 2–3', 'months'],
        text: 'We set the timeline before we start, tie it to your scope, and hold to it.',
      },
    ] as { title: [string, string]; text: string }[],
  },
  cases: {
    label: 'cases',
    title: 'Real projects, real results',
    sub: 'Same structure every card — so you can compare goals, not marketing.',
    link: 'View live site',
    // Appended to the link for screen readers: "View live site: Medical clinic (opens in a new tab)".
    newTab: 'opens in a new tab',
    facts: {
      goal: 'Goal:',
      start: 'Starting point:',
      did: 'What we did:',
      time: 'Timeframe:',
      result: 'Result:',
    },
    // Only the clinic has real facts and a URL. TODO(copy): facts and URLs for cases 2–5 from Serhii.
    items: [
      {
        title: 'Medical clinic',
        type: 'from scratch',
        url: 'https://www.drlor-kh.com/',
        facts: {
          goal: 'steady patient flow, booking that runs itself',
          start:
            'early-2000s site, patients only by word of mouth, every appointment booked by phone',
          did: 'research · UX analysis · redesign & build · booking + reminder automation',
          time: '~1.5 months',
          result:
            'booking runs on its own, reminders go out automatically, a real stream of enquiries where there used to be only word of mouth',
        },
      },
      { title: 'Massage studio', type: 'redesign', url: '', facts: tbd() },
      { title: 'English school', type: 'from scratch', url: '', facts: tbd() },
      { title: 'Crypto company', type: 'from scratch', url: '', facts: tbd() },
      {
        title: 'B2B Solar company',
        type: 'concept project',
        url: '',
        facts: tbd(),
      },
    ] as CaseItem[],
  },
};

export type Dict = typeof en;
