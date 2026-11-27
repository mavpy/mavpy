// All English copy. uk.ts has the same keys (typed as Dict).
// The footer's copyright years; the year is set at build time in astro.config.mjs.
declare const __BUILD_YEAR__: number;
export const copyright = `© 2022–${__BUILD_YEAR__} MAVPY Design & Dev`;

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
    cta: 'Get my estimate',
    // Name of the UA / EN link group (the links themselves: langNames in utils.ts).
    langGroup: 'Language',
  },
  footer: {
    navLabel: 'Footer',
    tagline: ['Less noise.', 'More substance.'],
    navTitle: 'Navigate',
    contactTitle: 'Contact',
    studioTitle: 'Studio',
    studio: ['Design & development', 'Since 2022', 'UA / EN'],
    copyright,
    toTop: 'Back to top ↑',
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
    label: 'Reviews',
    title: 'Client reviews',
    sub: 'Reviews from people we’ve already launched with.',
    listLabel: 'Client reviews',
    // The three real reviews. Display order follows the design (it starts the line at the third).
    items: [
      {
        avatar: 'review-bram-spacem',
        name: 'Bram V.',
        project: 'Space’M Online · web design',
        quote:
          'Serhii is strong in communication, super fast in delivering the scope, overdelivers and is a real professional. Gladly recommend.',
        lang: undefined as 'en' | undefined,
      },
      {
        avatar: 'review-natalia-srt',
        name: 'Natalia M.',
        project: 'SRT · online booking',
        quote:
          'Booking used to eat half my administrator’s day. Now it runs on its own and patients just show up. Serhii handled everything, I barely had to step in.',
      },
      {
        avatar: 'review-ivan',
        name: 'Ivan V.',
        project: 'Doctor LOR · new site and booking',
        quote:
          'We had visitors but almost no enquiries. Serhii didn’t just redesign, he asked why people were leaving first. That’s the difference. The form finally started filling.',
      },
    ],
  },
  team: {
    label: 'Team',
    title: 'The people behind\nyour project',
    what: 'What I do',
    // photo: file name in src/assets/v3/team/. quote: one string per paragraph.
    members: [
      {
        photo: 'team-serhii',
        name: 'Serhii',
        role: 'Designer & product manager',
        quote: [
          'I start with why people leave your site, then design the page that keeps them.',
          'From the first call to launch, you talk to me. I keep the plan, the deadlines and the decisions in one place, so nothing gets lost between people.',
        ],
        tags: [
          'Research & UX',
          'Site structure',
          'Design in Figma',
          'Project lead',
        ],
      },
      {
        photo: 'team-nikita',
        name: 'Nikita',
        role: 'Developer & automation',
        quote: [
          'I build the site and connect it to what you already use: booking, CRM, a Telegram bot.',
          'Every request lands where your team will see it. After launch I stay on the tech side, so updates and fixes don’t stall.',
        ],
        tags: [
          'Webflow & custom code',
          'Booking, CRM, Telegram bots',
          'Integrations',
          'Launch & support',
        ],
      },
      {
        photo: 'team-julia',
        name: 'Julia',
        role: 'Marketing & copywriting',
        quote: [
          'I write in your clients’ words, not ours. Each headline answers one question: why choose you over the business next door.',
          'Before writing, I read your reviews, calls and competitors’ pages to find the phrases your clients actually use.',
        ],
        tags: [
          'Positioning & offer',
          'Website copy',
          'Case studies',
          'Ad content',
        ],
      },
      {
        photo: 'team-marina',
        name: 'Marina',
        role: 'Ads & analytics',
        quote: [
          'I run your ads and set up tracking, so you see which channel brings paying clients and which one only spends the budget.',
          'You get a short report in plain words: what we spent, what came in, and what we change next.',
        ],
        tags: [
          'Google & Meta ads',
          'Analytics & tracking',
          'Cost per enquiry reports',
          'Budget planning',
        ],
      },
    ],
  },
  pricing: {
    label: 'Pricing',
    title: 'Pick your goal, see the price',
    sub: 'Pick a goal and see the price right away. We fix the final price before we start.',
    pay: { once: 'Pay once', parts: 'Pay in 3 parts' },
    from: 'from',
    badge: 'Popular',
    cta: 'Discuss your project',
    note: 'Need a Telegram bot, CRM or another feature? It can be added to any package.',
    // price: [main, line under it ('' for none)], once and in 3 parts. goal: the contact form's preset.
    plans: [
      {
        kind: 'Landing page',
        title: 'A site that brings enquiries',
        text: 'One page that explains your offer and turns visitors into enquiries.',
        points: [
          'One-page site',
          'Copy that sells',
          'Form with instant alerts',
          '1 month of support after launch',
        ],
        once: ['$399', ''],
        parts: ['3 × $133', ''],
        goal: 'clients',
        popular: false,
      },
      {
        kind: 'Landing page + automation',
        title: 'A site that books clients for you',
        text: 'Takes bookings online and sends every lead straight to your team.',
        points: [
          'Everything in Landing page',
          'Online booking & calendar',
          'Leads to Telegram or CRM',
          '1 month of support after launch',
        ],
        once: ['$699', ''],
        parts: ['3 × $233', ''],
        goal: 'service',
        popular: true,
      },
      {
        kind: 'Multi-page website',
        title: 'A site for a growing business',
        text: 'A page for every service, with booking and lead handling built in.',
        points: [
          'Up to 5 pages',
          'Booking & lead handling',
          'Analytics & lead tracking',
          'Priority support for 1 month',
        ],
        once: ['$1,200', ''],
        parts: ['3 × $400', ''],
        goal: 'redesign',
        popular: false,
      },
    ],
  },
  contact: {
    label: 'Contact',
    title: 'Free 15‑minute\nsite review',
    sub: 'We’ll look at your site or idea together and show what will bring more enquiries. Free, no obligation.',
    // The contacts column next to the form.
    side: {
      title: 'Prefer to talk directly?',
      phone: 'Phone',
      email: 'Email',
      instagram: 'Instagram',
    },
    name: 'Name',
    namePlaceholder: 'How should we address you?',
    phone: 'Phone',
    // Country-code picker (screen-reader name) and the number hint for the default +380.
    country: 'Country code',
    phoneHint: '67 123 45 67',
    email: 'Email',
    emailPlaceholder: 'you@company.com',
    cta: 'Book a free review',
    reply: 'We reply within 24 hours · no spam',
    errors: {
      required: 'Please fill this in',
      email: 'Enter a valid e-mail',
      phone: 'Enter a valid phone number',
      short: 'Too short',
    },
    // Replaces the form after a successful submit.
    successTitle: 'Got it, thanks',
    success: 'We’ll get back within 24 hours to set a time for the call.',
    // Success-card button to the studio bot (shown when the lead got an id). TODO(copy)
    telegram: 'Confirm in Telegram',
    // The studio e-mail is appended, so people can still reach us.
    error: 'The request didn’t go through. Try again or write to',
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
