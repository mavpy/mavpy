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
export type Testimonial = {
  quote: string[];
  name: string;
  company: string;
  project: string;
  avatar: 'natalia' | 'bram' | 'ivan' | 'placeholder';
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
  testimonials: {
    label: 'clients',
    title: "What it's like to work with us",
    sub: 'Real people, real projects — read them for one thing: was it calm, was it worth it.',
    listLabel: 'Client testimonials',
    prev: 'Previous testimonial',
    next: 'Next testimonial',
    // Figma's 4 (Webflow has 6; open question). `quote` is split where the desktop frame breaks
    // lines; mobile runs it together. TODO(copy): Serhii to confirm the set and the project lines.
    items: [
      {
        quote: [
          "“Booking used to eat half my administrator's day.",
          'Now it runs on its own and patients just show up.',
          'Serhii handled everything — I barely had to step in.”',
        ],
        name: 'Natalia M.',
        company: 'SRT Massage clinic',
        project: 'about full redesign site',
        avatar: 'natalia',
      },
      {
        quote: [
          '“Serhii is strong in communication, super fast in delivering the scope, overdelivers and is a real professional.',
          'Gladly recommend.”',
        ],
        name: 'Bram V.',
        company: 'Space’M Online',
        project: 'about design and develop',
        avatar: 'bram',
      },
      {
        quote: [
          '“We had visitors but almost no enquiries.',
          "Serhii didn't just redesign — he asked why people were leaving first.",
          "That's the difference.",
          'The form finally started filling.”',
        ],
        name: 'Ivan V.',
        company: 'Doctor LOR',
        project: 'about full design and develop',
        avatar: 'ivan',
      },
      {
        quote: [
          '“What I remember most is how calm it was. Clear steps, honest timeline, no surprise costs at the end. Exactly what was quoted. Rare.”',
        ],
        name: 'Dmytro V.',
        company: 'FitK online store',
        project: 'about design and develop',
        avatar: 'placeholder',
      },
    ] as Testimonial[],
  },
  about: {
    label: 'about',
    // \n: the line break both frames use.
    title: 'A craft studio,\nnot a conveyor belt',
    sub: 'Founded 2022. The founder leads every project personally, start to launch.',
    // The card title: line 1, then line 2 with its first part medium-weight on desktop (as in Figma).
    hi: "Hi, I'm Serhii,",
    role: { em: 'founder of MAVPY', after: ' design agency.' },
    // One string per paragraph; \n is a forced line break.
    paragraphs: [
      "Three years in, 30+ projects across Ukraine and worldwide.\nI don't want a studio that churns out websites.",
      'We build one solution for one goal at a time — no wasted steps, no extra people.',
      'When you work with us, you work with me. Nothing gets lost in a hand-off. Your result is the point — not the website.',
    ],
    photoAlt: 'Serhii, founder of MAVPY',
  },
  pricing: {
    label: 'pricing',
    title: 'Pick your goal, see the price',
    sub: 'No form, no call to see a number. Find your goal, see where it starts.',
    youGet: 'You get:',
    from: 'from',
    cta: 'Get my estimate',
    // Figma prices (Webflow differs: open question). Card 3 uses the desktop title; mobile
    // Figma says "Refresh an outdated site". TODO(copy): Serhii to confirm.
    items: [
      {
        title: 'Attract new clients',
        youGet:
          'a site that turns strangers into enquiries — and ads that keep them coming.',
        bullets: [
          'online positioning',
          'site design & build',
          'ad setup & automation',
        ],
        price: '$500',
      },
      {
        title: 'Launch a new service',
        youGet:
          'one page that makes the new offer impossible to misunderstand.',
        bullets: [
          'landing page for the offer',
          'copy & visuals',
          'launch ad setup',
        ],
        price: '$700',
      },
      {
        title: 'Revamp your website',
        youGet: "a site you're proud to send — fast, modern, findable.",
        bullets: [
          'redesign & modern build',
          'move to an easy platform',
          'basic SEO',
        ],
        price: '$800',
      },
    ],
  },
  contact: {
    title: "Tell us your goal, we'll price it",
    // TODO(copy): "from $500" follows the Figma prices (Webflow starts at $1000).
    sub: "You've seen the ballpark — from $500. Exact figure on a short call. No sales marathon. We reply within 24 hours.",
    name: 'Your Name',
    email: 'Your E-mail',
    goal: 'Your goal',
    // Goal options are the pricing card titles plus this one.
    other: 'Other',
    cta: 'Get my estimate',
    errors: {
      required: 'Please fill this in',
      email: 'Enter a valid e-mail',
      short: 'Too short',
    },
    success: "Thanks! We'll reply within 24 hours.",
    // The studio e-mail is appended, so people can still reach us.
    error: "Couldn't send. Please e-mail us:",
  },
};

export type Dict = typeof en;
