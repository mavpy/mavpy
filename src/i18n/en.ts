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
    howWeWork: 'How we work',
    cases: 'Cases',
    pricing: 'Pricing',
    contact: 'Contact',
  },
  langSwitch: {
    label: 'Language',
    // Shown on the link that switches to the *other* language.
    en: 'EN',
    uk: 'UA',
  },
  hero: {
    // Figma sets "websites" in bold, so the line is split around it.
    h1: {
      before: 'Conversion-focused ',
      em: 'websites',
      after: ' for growing businesses',
    },
  },
};

export type Dict = typeof en;
