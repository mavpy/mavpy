import { getRelativeLocaleUrl } from 'astro:i18n';
import { en } from './en';
import { uk } from './uk';

/** Ukrainian typesetting, as the design's build.py `ua_typo` does for the whole UA page: one-letter
 *  words stick to the next word, a dash to the word before it, numbers to their unit and thousands
 *  groups to each other (no-break spaces). Applied to text only, never inside a tag. */
export function uaTypo(text: string) {
  return text.replace(/(^|>)([^<]+)/g, (_, gt: string, x: string) =>
    gt +
    x
      .replace(/(?<![\p{L}\p{N}_’'-])([ВУЗІЙАОвузійао])\s+/gu, '$1\u00a0')
      .replace(/\s+—/g, '\u00a0—')
      .replace(/(\d)\s+(?=[а-яіїєґА-ЯІЇЄҐ₴$%×])/g, '$1\u00a0')
      .replace(/(\d)\s(?=\d{3}\b)/g, '$1\u00a0'),
  );
}

const deep = <T>(v: T, f: (s: string) => string): T =>
  (typeof v === 'string'
    ? f(v)
    : Array.isArray(v)
      ? v.map((x) => deep(x, f))
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x, f)]))
        : v) as T;

const dicts = { uk: deep(uk, uaTypo), en };
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
