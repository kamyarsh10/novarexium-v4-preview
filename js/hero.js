/* Novarexium v4: main page hero. One Madrid photo (Move to Spain) with the four services beside it.
   Desktop: hovering or focusing a service swaps the photo and shows its short text; leaving brings the
   main photo back. Phones: first tap opens a service, second tap (or Enter) goes to its page. */
(() => {
  'use strict';
  const root = document.getElementById('stage');
  if (!root || !window.NX) return;
  const NX = window.NX, G = window.gsap;
  const rows = [...root.querySelectorAll('.st-row')];
  const panes = [...root.querySelectorAll('.st-pane')];
  const imgs = [...root.querySelectorAll('.st-media img')];
  const DEF = +root.dataset.def || 0;
  const narrow = matchMedia('(max-width: 820px)');
  const touch = () => !NX.fine || narrow.matches;
  let active = null, timer = 0;

  function set(i) {
    if (i === active) return;
    active = i;
    const pic = i < 0 ? DEF : i;
    imgs.forEach((im, k) => im.classList.toggle('is-on', k === pic));
    panes.forEach((p) => {
      const on = +p.dataset.i === i;
      p.classList.toggle('is-on', on);
      p.toggleAttribute('inert', !on);
    });
    rows.forEach((r, k) => { r.classList.toggle('is-on', k === i); r.setAttribute('aria-current', String(k === i)); });
    root.classList.toggle('has-on', i >= 0);
  }
  const later = () => { clearTimeout(timer); timer = setTimeout(() => { timer = 0; set(-1); }, 650); };
  const keep = () => { clearTimeout(timer); timer = 0; };

  /* Hover intent: a row opens only when the pointer rests on it briefly, so crossing the list
     on the way to the open service's links does not switch to another service */
  let intent = 0;
  rows.forEach((r, k) => {
    r.addEventListener('mouseenter', () => { if (!touch()) { keep(); clearTimeout(intent); intent = setTimeout(() => set(k), active >= 0 ? 110 : 0); } });
    r.addEventListener('mouseleave', () => clearTimeout(intent));
    /* Keyboard focus opens a service; a tap's focus does not, so the first tap can open it instead of leaving */
    r.addEventListener('focus', () => { if (r.matches(':focus-visible')) { keep(); set(k); } });
    r.addEventListener('click', (e) => { if (touch() && active !== k) { e.preventDefault(); set(k); } });
  });
  /* Stay open while the pointer is on the services or on the open service's text and links */
  root.addEventListener('pointermove', (e) => {
    if (touch() || e.pointerType === 'touch') return;
    if (e.target.closest('.st-list li, .st-pane.is-on')) keep();
    else if (active >= 0 && !timer) later();
  });
  root.addEventListener('mouseleave', () => { if (!touch()) later(); });
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) later(); });
  /* Phones: tapping the photo (not a link) goes back to the main view */
  root.addEventListener('click', (e) => { if (touch() && active >= 0 && !e.target.closest('a')) set(-1); });
  /* Warm the other photos once the page is idle so the first hover is instant */
  const warm = () => imgs.forEach((im) => { if (im.decode) im.decode().catch(() => {}); });
  if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 3000 }); else setTimeout(warm, 2000);

  set(-1);

  /* ---------- Desktop: slanted doors. The main door is open; hovering a slim door opens it ---------- */
  const drs = [...root.querySelectorAll('.dr')];
  const mainDr = root.querySelector('.dr--main');
  const wrapDr = root.querySelector('.drs');
  let dOpen = mainDr, dTimer = 0, dIntent = 0;
  const open = (d) => { if (d === dOpen) return; dOpen = d; drs.forEach((x) => x.classList.toggle('is-on', x === d)); };
  /* Doors to the left of the one under the pointer never change width, so nothing slides under the mouse */
  drs.forEach((d) => {
    d.addEventListener('mouseenter', () => { clearTimeout(dTimer); clearTimeout(dIntent); dIntent = setTimeout(() => open(d), dOpen === mainDr ? 140 : 220); });
    d.addEventListener('mouseleave', () => clearTimeout(dIntent));
    d.addEventListener('focusin', () => { clearTimeout(dTimer); open(d); });
  });
  if (wrapDr) {
    wrapDr.addEventListener('mouseenter', () => clearTimeout(dTimer));
    wrapDr.addEventListener('mouseleave', () => { clearTimeout(dIntent); dTimer = setTimeout(() => open(mainDr), 450); });
    wrapDr.addEventListener('focusout', (e) => { if (!wrapDr.contains(e.relatedTarget)) open(mainDr); });
  }

  NX.intro.then(({ first }) => {
    const desk = !narrow.matches && wrapDr;
    const h1 = desk ? root.querySelector('.dr-h1') : root.querySelector('#stageH1');
    if (!G || NX.reduce) { root.classList.add('is-in'); return; }
    const words = NX.split(h1);
    root.classList.add('is-in');
    const media = desk ? mainDr.querySelector('.dr-ph') : root.querySelector('.st-media');
    const rest = desk ? mainDr.querySelectorAll('.st-eb, .dr-open p:not(.dr-h1)') : root.querySelectorAll('.st-pane[data-i="-1"] .st-eb, .st-pane[data-i="-1"] p, .st-hint');
    if (desk) G.fromTo(root.querySelectorAll('.dr:not(.dr--main) .dr-spine'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .06, delay: .15, clearProps: 'opacity,transform' });
    G.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo(media, { scale: first ? 1.14 : 1.06 }, { scale: 1, duration: first ? 2.6 : 1.8, clearProps: 'transform' }, 0)
      .fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: .06 }, .15)
      .fromTo(rest, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, stagger: .1, clearProps: 'opacity,transform' }, .45)
      .fromTo(root.querySelectorAll('.st-list li'), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1, stagger: .08, clearProps: 'opacity,transform' }, .55);
  });
})();
