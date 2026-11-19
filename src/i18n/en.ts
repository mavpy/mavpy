// All English copy. Source: Figma (wins on copy, decided 2026-11-19). Sections add keys as they are built in M4.
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
};

export type Dict = typeof en;
