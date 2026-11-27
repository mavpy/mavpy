import { getRelativeLocaleUrl } from 'astro:i18n';
import { en } from './en';
import { uk } from './uk';

const dicts = { uk, en };
export type Lang = keyof typeof dicts;
export const langs = Object.keys(dicts) as Lang[];
export const defaultLang: Lang = 'uk';

/** Language of a URL: '/en/...' is English, everything else Ukrainian (the default). */
export function getLang(url: URL): Lang {
  const first = url.pathname.split('/')[1];
  return langs.includes(first as Lang) ? (first as Lang) : defaultLang;
}

/** The UA / EN switcher: short label and the language's own name (for screen readers). */
export const langNames: Record<Lang, { short: string; name: string }> = {
  uk: { short: 'UA', name: 'Українська' },
  en: { short: 'EN', name: 'English' },
};

/** The copy dictionary for a language. */
export const t = (lang: Lang) => dicts[lang];

/** Path in a given language, e.g. localizePath('en', '#pricing') -> '/en/#pricing'. */
export function localizePath(lang: Lang, hash = '') {
  return getRelativeLocaleUrl(lang, '') + hash;
}

/** Page sections linked from the header and footer, in order: [anchor id, nav copy key]. */
export const navLinks = [
  ['how-we-work', 'howWeWork'],
  ['cases', 'cases'],
  ['pricing', 'pricing'],
  ['contact', 'contact'],
] as const;
