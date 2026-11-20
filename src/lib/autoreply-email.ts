// The visitor's auto-reply e-mail: subject, HTML and plain text, in their language.
// E-mail HTML is its own world: tables for layout, inline styles, web-safe fonts (Gmail loads no
// web fonts), PNG not SVG, absolute image URLs. Colours are the site tokens from global.css.
import { site } from '../data/site';
import { t, type Lang } from '../i18n/utils';

const c = {
  paper: '#f2f2f2',
  white: '#ffffff',
  black: '#000000',
  grey: '#606060',
  orange: '#ffab01',
  cream: '#fff6e9',
  night: '#313131',
};
const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/** Escapes text for HTML; every dynamic value goes through it. */
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function renderAutoReply(
  lang: Lang,
  name: string,
  goal: string,
  siteUrl: string,
) {
  const r = t(lang).contact.autoReply;
  const title = r.title.replace('{name}', name);
  const home = new URL(lang === 'en' ? '/' : `/${lang}/`, siteUrl).href;
  const logo = new URL('/email/logo.png', siteUrl).href;
  const p = (text: string, color = c.black) =>
    `<p style="margin:0 0 16px;font:16px/1.5 ${font};color:${color}">${esc(text)}</p>`;

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(r.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${c.paper}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(r.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.paper}">
<tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
    <tr><td style="padding:0 0 24px">
      <a href="${home}"><img src="${logo}" width="157" height="42" alt="MAVPY design agency" style="display:block;border:0"></a>
    </td></tr>
    <tr><td style="background:${c.white};border-left:5px solid ${c.orange};border-radius:12px;padding:40px 32px 32px">
      <h1 style="margin:0 0 20px;font:800 30px/1.15 ${font};color:${c.black}">${esc(title)}</h1>
      ${p(r.intro)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px">
        <tr><td style="background:${c.cream};border-radius:8px;padding:16px 20px">
          <p style="margin:0 0 4px;font:13px/1.3 ${font};color:${c.grey};text-transform:uppercase;letter-spacing:0.06em">${esc(r.goal)}</p>
          <p style="margin:0;font:bold 18px/1.3 ${font};color:${c.black}">${esc(goal)}</p>
        </td></tr>
      </table>
      ${p(r.next)}
      ${p(r.details, c.grey)}
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 28px">
        <tr><td style="background:${c.orange};border-radius:8px">
          <a href="${home}#cases" style="display:inline-block;padding:14px 28px;font:500 17px/1 ${font};color:${c.black};text-decoration:none">${esc(r.cta)}</a>
        </td></tr>
      </table>
      <p style="margin:0;font:bold 16px/1.5 ${font};color:${c.black}">${esc(r.signoff)}</p>
    </td></tr>
    <tr><td style="padding:24px 8px 0;font:13px/1.7 ${font};color:${c.grey}" align="center">
      <a href="mailto:${site.email}" style="color:${c.grey}">${site.email}</a>
      &nbsp;·&nbsp; <a href="${site.phone.href}" style="color:${c.grey};text-decoration:none">${site.phone.display}</a>
      &nbsp;·&nbsp; <a href="${site.instagram.href}" style="color:${c.grey}">${site.instagram.handle}</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    title,
    r.intro,
    `${r.goal}: ${goal}`,
    r.next,
    r.details,
    `${r.cta}: ${home}#cases`,
    r.signoff,
    `${site.email} · ${site.phone.display} · ${site.instagram.handle}`,
  ].join('\n\n');

  return { subject: r.subject, html, text };
}
