// Phone field: country dial codes and the one function that turns the form's two inputs
// (country + national number) into an E.164 number. Shared by the form script and the server.
// Country names come from Intl.DisplayNames and flags from the ISO code, so only codes live here.
// NANP countries (US, CA, Caribbean) are all +1: their area code is part of the national number.
// Russia and Belarus are left out on purpose.
// prettier-ignore
export const dialCodes = {
  UA: '380', AF: '93', AL: '355', DZ: '213', AD: '376', AO: '244', AG: '1', AR: '54', AM: '374',
  AU: '61', AT: '43', AZ: '994', BS: '1', BH: '973', BD: '880', BB: '1', BE: '32', BZ: '501',
  BJ: '229', BT: '975', BO: '591', BA: '387', BW: '267', BR: '55', BN: '673', BG: '359', BF: '226',
  BI: '257', KH: '855', CM: '237', CA: '1', CV: '238', CF: '236', TD: '235', CL: '56', CN: '86',
  CO: '57', KM: '269', CG: '242', CD: '243', CR: '506', CI: '225', HR: '385', CU: '53', CY: '357',
  CZ: '420', DK: '45', DJ: '253', DM: '1', DO: '1', EC: '593', EG: '20', SV: '503', GQ: '240',
  ER: '291', EE: '372', SZ: '268', ET: '251', FJ: '679', FI: '358', FR: '33', GA: '241', GM: '220',
  GE: '995', DE: '49', GH: '233', GR: '30', GD: '1', GT: '502', GN: '224', GW: '245', GY: '592',
  HT: '509', HN: '504', HK: '852', HU: '36', IS: '354', IN: '91', ID: '62', IR: '98', IQ: '964',
  IE: '353', IL: '972', IT: '39', JM: '1', JP: '81', JO: '962', KZ: '7', KE: '254', KI: '686',
  XK: '383', KW: '965', KG: '996', LA: '856', LV: '371', LB: '961', LS: '266', LR: '231', LY: '218',
  LI: '423', LT: '370', LU: '352', MO: '853', MG: '261', MW: '265', MY: '60', MV: '960', ML: '223',
  MT: '356', MH: '692', MR: '222', MU: '230', MX: '52', FM: '691', MD: '373', MC: '377', MN: '976',
  ME: '382', MA: '212', MZ: '258', MM: '95', NA: '264', NR: '674', NP: '977', NL: '31', NZ: '64',
  NI: '505', NE: '227', NG: '234', MK: '389', NO: '47', OM: '968', PK: '92', PW: '680', PS: '970',
  PA: '507', PG: '675', PY: '595', PE: '51', PH: '63', PL: '48', PT: '351', PR: '1', QA: '974',
  RO: '40', RW: '250', KN: '1', LC: '1', VC: '1', WS: '685', SM: '378', ST: '239', SA: '966',
  SN: '221', RS: '381', SC: '248', SL: '232', SG: '65', SK: '421', SI: '386', SB: '677', SO: '252',
  ZA: '27', KR: '82', SS: '211', ES: '34', LK: '94', SD: '249', SR: '597', SE: '46', CH: '41',
  SY: '963', TW: '886', TJ: '992', TZ: '255', TH: '66', TL: '670', TG: '228', TO: '676', TT: '1',
  TN: '216', TR: '90', TM: '993', TV: '688', UG: '256', AE: '971', GB: '44', US: '1', UY: '598',
  UZ: '998', VU: '678', VA: '39', VE: '58', VN: '84', YE: '967', ZM: '260', ZW: '263',
} as const;
export type Country = keyof typeof dialCodes;
export const countries = Object.keys(dialCodes) as [Country, ...Country[]];

/** 🇺🇦 from "UA" (regional indicator letters; Windows shows them as plain "UA"). */
export const flag = (c: string) =>
  String.fromCodePoint(...[...c].map((ch) => 0x1f1a5 + ch.charCodeAt(0)));

// Italy, San Marino and the Vatican keep the leading 0 in international format.
const keepsZero = new Set<string>(['IT', 'SM', 'VA']);

/**
 * "+380671234567", or null if it can't be a real number. A national number typed with its
 * trunk 0 ("067…") drops it; one typed in full ("+44 20…") ignores the selected country.
 */
export function toE164(country: string, input: string): string | null {
  if (!/^\+?[\d\s().-]+$/.test(input.trim())) return null;
  let digits = input.replace(/\D/g, '');
  if (!input.trim().startsWith('+')) {
    const code = dialCodes[country as Country];
    if (!code) return null;
    if (!keepsZero.has(country)) digits = digits.replace(/^0/, '');
    digits = code + digits;
  }
  // E.164: at most 15 digits; under 8 is never a full number with its country code.
  return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
}
