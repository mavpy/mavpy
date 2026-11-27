// All English copy. This file is the source of truth (synced from Webflow once, 2026-11-20); changes now come from Serhii via Figma.
// Years since the studio started, counted at build time (pages are prerendered).
const thisYear = new Date().getFullYear();
export const studioYears = thisYear - 2021;
export const yearRange = `2021-${thisYear},`;
const yearsEn: Record<number, string> = {
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
};

export type Testimonial = {
  quote: string[];
  name: string;
  company: string;
  project: string;
  avatar: 'natalia' | 'bram' | 'ivan' | 'placeholder'; // placeholder = initials circle, TODO(photo)
};

export const en = {
  meta: {
    title: 'MAVPY: conversion-focused websites for growing businesses',
    description:
      'A design and development studio. Websites that turn visitors into clients: designed and built in-house, priced upfront.',
    ogImageAlt:
      'MAVPY: the pixel monkey logo on orange, design and development',
  },
  notFound: {
    title: 'Page not found',
    text: 'This page doesn’t exist or has moved.',
    cta: 'Back to the home page',
  },
  a11y: {
    skipToContent: 'Skip to content',
  },
  // Cookie banner; only shown when GA is configured (PUBLIC_GA_ID).
  consent: {
    label: 'Cookie consent',
    text: 'We use cookies for anonymous analytics (Google Analytics) to improve the site.',
    accept: 'Accept',
    decline: 'Decline',
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
    cta: 'Get my estimate',
    // Name of the UA / EN link group (the links themselves: langNames in utils.ts).
    langGroup: 'Language',
  },
  footer: {
    navLabel: 'Footer',
    slogan: 'Less noise. More results.',
    email: 'EMAIL:',
    phone: 'PHONE:',
    instagram: 'INST:',
    years: yearRange,
    studio: 'MAVPY DESIGN & DEVELOPMENT STUDIO',
  },
  hero: {
    // The design sets the end of the line in bold, so it's split around it.
    h1: { before: 'Websites built around ', em: 'business results', after: '' },
    more: 'MORE',
    clients: 'clients',
    // Desktop breaks after every line; below 1200px only before the last one.
    statement: ['Not just', 'a new', 'website'],
    note: ['Scoped, priced upfront,', 'delivered end-to-end.'],
    cta: 'Get my estimate',
  },
  trust: {
    label: 'Why clients work with us',
    items: [
      '30+ projects since 2022',
      'Fixed price, no surprises',
      'Founder-led, direct',
      'Reply within 24h',
      'Pay in 3 parts',
      'Booking, CRM and bot wired in',
      'You own the site and the code',
    ],
  },
  featured: {
    label: 'A case from our work',
    title: 'Doctor LOR',
    sub: 'ENT clinic in Kharkiv: from phone-only booking to a site that books itself',
    text: 'Before: patients could only book by phone, on a site from the early 2000s. Now booking runs itself and reminders go out on their own.',
    stats: [
      { value: '271', label: 'organic clicks in 2 months' },
      { value: '#1–2', label: 'in Google by clinic name and area' },
      { value: '$0', label: 'spent on ads' },
    ],
    cta: 'Read the case ↓',
    live: 'Open live site',
    shotAlt: 'Doctor LOR website',
    url: 'https://www.drlor-kh.com/',
    host: 'drlor-kh.com',
  },
  pain: {
    label: 'Sound familiar?',
    title: 'Which of these sounds like you?',
    sub: 'Find yours — that’s where we start.',
    cards: [
      {
        title: 'Your site costs you deals',
        text: 'Visitors make up their minds in seconds, long before they ever read your pitch.',
      },
      {
        title: 'Referrals aren’t enough',
        text: 'Luck isn’t a plan. You need a steady, predictable stream of qualified leads.',
      },
      {
        title: 'Traffic, but no enquiries',
        text: 'People visit, but the site fails to turn them into real business enquiries.',
      },
    ],
  },
  process: {
    label: 'Process',
    title: 'How we do it',
    intro: 'One clear path. The right people for your goal, no more, no less.',
    // fig: the big number and its word.
    steps: [
      {
        fig: ['1', 'team'],
        title: 'Full cycle, done for you',
        text: 'From zero to a steady flow of clients. Nothing gets lost in hand-offs.',
        more: 'Strategy, copy, design, build, booking and ads. One team and one contract, so nothing gets lost between contractors.',
      },
      {
        fig: ['2', 'weeks'],
        title: 'Live in as little as 2 weeks',
        text: 'We set the timeline before we start, tie it to your scope, and hold to it.',
        more: 'Week 1: plan and design. Week 2: build, integrations and launch. The timeline is fixed in the contract.',
      },
      {
        fig: ['3', 'approvals'],
        title: 'Minimal load on your side',
        text: 'We agree on the decisions that matter, handle the rest, and leave you free to run your business.',
        more: 'You approve three things: the plan, the design and the launch. We do the rest and show you the result.',
      },
    ],
  },
  cases: {
    label: 'Cases',
    title: 'How our clients’\nbusiness changed',
    sub: 'Where each client started, what we did and what changed.',
    facts: ['Before', 'What we did', 'After'],
    live: 'Open live site',
    // facts: before, what we did, after. HTML: <b> marks the key figures.
    items: [
      {
        name: 'Doctor LOR',
        kind: 'ENT clinic · Kharkiv',
        shot: 'case-doctor-lor',
        url: 'https://www.drlor-kh.com/',
        host: 'drlor-kh.com',
        facts: [
          'Patients take months to choose a surgeon and fear the operation. Booking was by phone only, on a site from the early 2000s.',
          'A first screen about the outcome: breathe freely, look natural. Price and sedation shown up front. Booking in <b>one click</b>.',
          '<b>271</b> organic clicks and <b>#1–2</b> in Google within <b>2 months</b>, with <b>$0</b> on ads. Calls come in from search.',
        ],
      },
      {
        name: 'Aurelia Dental',
        kind: 'Premium dentistry · Antalya',
        shot: 'case-aurelia-dental',
        url: 'https://aurelia-dental.webflow.io/',
        host: 'aurelia-dental.webflow.io',
        facts: [
          'Patients from abroad choose a clinic remotely and fear pain and hidden costs.',
          'A calm, photo-led design and a fear-free promise. A <b>free online consultation</b> before the flight. Only <b>two actions</b>: book or consult.',
          'Patients book the consultation <b>before they travel</b>. The site answers the questions the team used to repeat on every call.',
        ],
      },
      {
        name: 'SRT',
        kind: 'Chronic pain therapy',
        shot: 'case-srt-therapy',
        url: 'https://srt-bf60b5.webflow.io/',
        host: 'srt-bf60b5.webflow.io',
        facts: [
          'Clients come after years of pain and failed treatments. Booking took <b>half the administrator’s day</b>.',
          'The method explained step by step, <b>10+ years</b> of practice on the first screen. Online booking synced with the calendar.',
          'Booking runs on its own. The administrator got <b>half a day back</b>.',
        ],
      },
      {
        name: 'The Nook',
        kind: '12-room hotel by the sea',
        shot: 'case-the-nook',
        url: 'https://the-nook----premium-coastal-coliving-we.webflow.io/',
        host: 'the-nook.webflow.io',
        facts: [
          'Guests saw just another beach hotel, and rooms stood empty <b>off-season</b>.',
          'New positioning for remote workers: “Work by the sea. Rest with purpose.” Quiet workspace, open <b>all year</b>, long-stay packages.',
          'The off-season has its own guests: remote workers who stay for <b>weeks, not days</b>.',
        ],
      },
      {
        name: 'Unit Surface',
        kind: 'B2B rooftop solar',
        shot: 'case-unit-surface',
        url: 'https://unit-surface-c8e2de.webflow.io/',
        host: 'unit-surface.webflow.io',
        facts: [
          'Owners of industrial roofs don’t see solar as income, and B2B decisions take <b>months</b>.',
          'Headline: “Your roof is an untapped financial asset”. An ROI calculator on the first screen: payback in <b>5–7 years</b>.',
          'Visitors see <b>their own payback</b> before the first call, so sales talks start further along.',
        ],
      },
    ],
  },
  testimonials: {
    label: 'clients',
    title: "What it's like to work with us",
    sub: 'Real people, real projects — read them for one thing: was it calm, was it worth it.',
    listLabel: 'Client testimonials',
    prev: 'Previous testimonial',
    next: 'Next testimonial',
    // Webflow's 6. `quote` is split where the desktop frame breaks lines; mobile runs it together.
    items: [
      {
        quote: [
          "“Booking used to eat half my administrator's day.",
          'Now it runs on its own and patients just show up.',
          'Serhii handled everything — I barely had to step in.”',
        ],
        name: 'Natalia M.',
        company: 'SRT Massage clinic',
        project: 'Design and development',
        avatar: 'natalia',
      },
      {
        quote: [
          '“Serhii is strong in communication, super fast in delivering the scope, overdelivers and is a real professional.',
          'Gladly recommend.”',
        ],
        name: 'Bram V.',
        company: 'Space’M Online',
        project: 'Design and development',
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
        project: 'Design and development',
        avatar: 'ivan',
      },
      {
        quote: [
          '“Our team wasted hours confirming appointments manually every single week. Serhii set up a self-serve system that patients love. Best operational upgrade we’ve made.”',
        ],
        name: 'Dmytro V.',
        company: 'Dental clinic',
        project: 'Full redesign',
        avatar: 'placeholder',
      },
      {
        quote: [
          '“I was afraid setting up online scheduling would be a headache, but Serhii built everything smoothly. It saved us a full-time hire and works like clockwork 24/7.”',
        ],
        name: 'Julia G.',
        company: 'Online store',
        project: 'Full redesign',
        avatar: 'placeholder',
      },
      {
        quote: [
          '“We used to lose so many bookings in mess generated by manual messaging. Serhii automated the entire flow in a few days. Now calendar fills itself up without a single glitch.”',
        ],
        name: 'Daria L.',
        company: 'Design studio',
        project: 'Full redesign',
        avatar: 'placeholder',
      },
    ] as Testimonial[],
  },
  about: {
    label: 'about',
    // \n: the line break both frames use.
    title: 'A craft studio,\nnot a conveyor belt',
    sub: 'Building since 2021. A founder leads every project personally, start to launch.',
    // The card title: line 1, then line 2 with its first part medium-weight on desktop (as in Figma).
    hi: 'Serhii —',
    role: { em: 'Co-founder,', after: ' strategy & design' },
    // One string per paragraph; \n is a forced line break.
    paragraphs: [
      'I’m the one you talk to, from the first brief to launch.',
      'Before any design, I write the plan: the problem, the audience, the offer — and the number we’re trying to move.',
      'I work out who your clients are and what makes them book — then design the site around it.\nI write the copy too, so every word on the page has a job.',
      `${yearsEn[studioYears] ?? studioYears} years, 30+ projects across Ukraine and worldwide.`,
    ],
    photoAlt: 'Serhii, co-founder of MAVPY',
  },
  pricing: {
    label: 'pricing',
    title: 'Pick your goal, see the price',
    sub: 'No form, no call to see a number. Find your goal, see where it starts.',
    youGet: 'You get:',
    from: 'from',
    cta: 'Get an estimate',
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
        price: '$1000',
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
        title: 'Care plan',
        youGet: 'we keep it fast, safe and up to date after launch.',
        bullets: [
          'first 2 weeks free',
          'fixes within 2–4 hours',
          'small edits monthly',
        ],
        price: '$40/m',
      },
    ],
  },
  contact: {
    title: "Tell us your goal, we'll price it",
    sub: "You've seen the ballpark — from $700. Exact figure on a short call. No sales marathon. We reply within 24 hours.",
    name: 'Your name',
    phone: 'Phone',
    // Country-code picker (screen-reader name) and the number hint for the default +380.
    country: 'Country code',
    phoneHint: '67 123 45 67',
    email: 'Email address',
    cta: 'Get an estimate',
    errors: {
      required: 'Please fill this in',
      email: 'Enter a valid e-mail',
      phone: 'Enter a valid phone number',
      short: 'Too short',
    },
    // Replaces the form after a successful submit.
    successTitle: 'Thank you!',
    success: "We've got your request and will reply within 24 hours.",
    // Success-card button to the studio bot (shown when the lead got an id). TODO(copy)
    telegram: 'Confirm in Telegram',
    // The studio e-mail is appended, so people can still reach us.
    error: "Couldn't send. Please e-mail us:",
    // Auto-reply e-mail to the person who submitted the form. {name} is replaced.
    // TODO(copy): draft, check with Serhii.
    autoReply: {
      subject: 'Thanks for reaching out to MAVPY',
      // Inbox preview line (hidden in the e-mail body).
      preheader: "We've got your request and will reply within 24 hours.",
      title: 'Thank you, {name}!',
      intro:
        "Thanks for your interest in working with us. We've got your request.",
      next: "We'll get back to you within 24 hours with next steps and a short call to agree on the exact price.",
      details:
        'Want to add details, like a link to your current site, deadlines or examples you like? Just reply to this e-mail.',
      cta: 'See our recent work',
      signoff: 'MAVPY design studio',
      // Line with the bot link, only when the lead has one.
      telegram: 'Prefer Telegram? Confirm your request with our bot:',
      telegramLink: 'Open in Telegram',
    },
    // Telegram bot replies. {name} is replaced. TODO(copy)
    bot: {
      confirmed:
        "🎉 Thanks, {name}!\n\nYour request is confirmed. We'll get back to you within 24 hours.",
      // /start without a valid lead (opened the bot directly, or an old link).
      hello:
        "👋 Hi! This is the MAVPY studio bot.\n\nLeave a request on our site and we'll get in touch: {site}",
      // Pre-call questionnaire, sent after `confirmed` (the first question in the same message).
      // Button labels are saved to Airtable in English. TODO(copy): agree with Serhii.
      intro:
        '🐒 A few quick questions help us prepare for the call (each can be skipped).\nTapped the wrong answer? Send /start to begin again.',
      // Button: answer the questionnaire again (repeat /start).
      restart: '🔄 Start over',
      // /start again after the questionnaire is finished, before the answer list. {name} is replaced.
      already: '🙌 Thanks, {name}!\n\n📋 We already have your answers:',
      // Button under the answer list: the answers are right. `kept` is the reply.
      allGood: '👍 All good',
      kept: "🎉 Great, thank you!\n\nThat helps us prepare. We'll contact you soon.",
      skip: '⏭ Skip',
      // Under a question on a redo: the saved answer (Skip keeps it). {answer} is replaced.
      current: '📌 Current answer: {answer}',
      // Button on a redo, every question but the last: end now, later questions stay as they are.
      finish: '🏁 Finish now',
      other: '✏️ Other',
      otherPrompt: '✏️ Type your answer:',
      // Finished: `done`, the answer list (`label: answer` lines), then `check` with All good / Start over.
      done: '✅ Done, thank you!\n\n📋 Here are your answers:',
      check:
        '🤔 Is everything correct?\nIf not, tap Start over: a question you skip keeps your earlier answer.',
      questions: {
        slot: {
          label: '🕐 Call time',
          text: '🕐 What time suits you best for the call? (Kyiv time)',
          options: ['11:00–13:00', '15:00–16:00', '18:00–19:00'],
          other: true,
        },
        business: {
          label: '💼 Business',
          text: "💼 What's your business area?",
          options: [
            'Healthcare',
            'Beauty & wellness',
            'E-commerce',
            'Education',
            'Services',
          ],
          other: true,
        },
        site: {
          label: '🌐 Website',
          text: '🌐 Do you have a website now?',
          options: ['No website'],
          // The "Other" button here, and what it asks for.
          other: true,
          otherText: '🔗 I have a website',
          otherPrompt: '🔗 Send the link to your site:',
        },
        budget: {
          label: '💰 Budget',
          text: "💰 What's your budget?",
          options: [
            'Under 10 000 UAH',
            '10 000–20 000 UAH',
            'More than 20 000 UAH',
            'Not sure yet',
          ],
          other: false,
        },
        timing: {
          label: '🚀 Launch',
          text: '🚀 When do you want to launch?',
          options: ['Urgently', 'In 1–2 months', 'No rush'],
          other: false,
        },
      },
    },
  },
};

export type Dict = typeof en;
