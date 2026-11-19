import type { Dict } from './en';

// review: Serhii (whole file is a draft translation until he approves it).
export const uk: Dict = {
  meta: {
    title: 'MAVPY: сайти, що приводять клієнтів, для бізнесу, який росте',
    description:
      'Дизайн-студія, якою керує засновник. Сайти, що перетворюють відвідувачів на клієнтів: чіткий обсяг, ціна наперед і робота під ключ.',
  },
  a11y: {
    skipToContent: 'Перейти до змісту',
  },
  nav: {
    label: 'Головне',
    home: 'MAVPY, на головну',
    howWeWork: 'Як ми працюємо',
    cases: 'Кейси',
    pricing: 'Ціни',
    contact: 'Контакти',
    menuOpen: 'Відкрити меню',
    menuClose: 'Закрити меню',
  },
  langSwitch: { short: 'EN', label: 'English' },
  footer: {
    navLabel: 'Нижня навігація',
    slogan: 'Менше шуму. Більше результатів.',
    email: 'EMAIL:',
    phone: 'ТЕЛЕФОН:',
    instagram: 'INST:',
    years: '2022-2026,',
    studio: 'ДИЗАЙН-СТУДІЯ MAVPY',
  },
  hero: {
    h1: {
      before: '',
      em: 'Сайти',
      after: ', що приводять клієнтів, для бізнесу, який росте',
    },
    more: 'Більше',
    clients: 'клієнтів',
    statement: ['Не просто', 'новий', 'сайт'],
    note: ['Чіткий обсяг, ціна наперед,', 'робота під ключ.'],
    cta: 'Дізнатися вартість',
    clientsEm: 3.5, // measured for «клієнтів»
  },
  trust: {
    label: 'Чому MAVPY',
    items: [
      '30+ проєктів',
      'Фіксована ціна без сюрпризів',
      'Напряму із засновником',
      'Відповідь протягом 24 год',
    ],
  },
};
