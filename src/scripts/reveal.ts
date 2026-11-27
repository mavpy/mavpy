// Cards marked data-ri slide up as they enter the view, staggered by their index among the
// data-ri siblings (the design's .ri). CSS lives in global.css.
const cards = [...document.querySelectorAll<HTMLElement>('[data-ri]')];
if (cards.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('ri-in');
        io.unobserve(e.target);
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -18% 0px' },
  );
  for (const el of cards) {
    const sibs = [...el.parentElement!.children].filter((c) => c.hasAttribute('data-ri'));
    el.style.setProperty('--ri', String(sibs.indexOf(el)));
    el.classList.add('ri');
    io.observe(el);
  }
}
