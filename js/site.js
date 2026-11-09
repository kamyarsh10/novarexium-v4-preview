/* Novarexium v4 — shared site behaviour.
   Language (fa/en/es), header, mobile sheet, loader, smooth scroll, reveals,
   counters, contact form (Formspree), clocks, page transitions. */
(() => {
  'use strict';

  const FORM_URL = 'https://formspree.io/f/xyklpkba';
  const WA = '34614066200';
  const LANGS = ['fa', 'en', 'es'];
  const LOCALE = { fa: 'fa-IR', en: 'en-GB', es: 'es-ES' };
  const D = window.NX_TEXT || { fa: {}, en: {}, es: {} };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = mqReduce.matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = !!window.gsap;
  if (!hasGsap) document.documentElement.classList.add('no-gsap');
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const store = {
    get(k, s = localStorage) { try { return s.getItem(k); } catch (e) { return null; } },
    set(k, v, s = localStorage) { try { s.setItem(k, v); } catch (e) {} },
    del(k, s = localStorage) { try { s.removeItem(k); } catch (e) {} }
  };

  /* ---------------- Language ---------------- */
  /* Each language has its own pages (/, /en/, /es/); the page's <html lang> says which one this is */
  let lang = LANGS.includes(document.documentElement.lang) ? document.documentElement.lang : 'fa';
  const t = (k) => (D[lang] && D[lang][k] != null) ? D[lang][k] : (D.en[k] != null ? D.en[k] : k);
  const fmt = (n, opts) => new Intl.NumberFormat(LOCALE[lang], opts).format(n);
  const hooks = [];

  function apply() {
    const h = document.documentElement;
    h.lang = lang; h.dir = lang === 'fa' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (v !== el.dataset.i18n) el.textContent = v; });
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $$('[data-wa]').forEach(a => { a.href = `https://wa.me/${WA}?text=${encodeURIComponent(t('wa_msg'))}`; });
    const tk = document.body.dataset.title; if (tk) document.title = t(tk);
    const mk = document.body.dataset.meta || 'meta_desc';
    const md = $('meta[name="description"]'); if (md && D[lang][mk]) md.content = t(mk);
    /* Ordinal numbers (01 to 04, step numbers): Persian digits in Farsi */
    $$('.ltr, .card-n').forEach(el => {
      if (el.dataset.n == null) { if (!/^\d{1,3}$/.test(el.textContent.trim())) return; el.dataset.n = el.textContent.trim(); }
      const fa = lang === 'fa';
      el.textContent = fa ? el.dataset.n.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]) : el.dataset.n;
      el.classList.toggle('is-fa-n', fa);
    });
    hooks.forEach(fn => fn(lang));
  }
  /* Language links go to the same page in the other language; remember the choice for the next visit */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.langs a'); if (a) store.set('nx-lang', a.dataset.lang);
  }, true);

  /* ---------------- Header + sheet ---------------- */
  function header() {
    const hdr = $('#hdr'); if (!hdr) return;
    let lastY = scrollY;
    const plain = 'plain' in document.body.dataset; /* legal pages: no photo under the header */
    const onScroll = () => {
      const y = scrollY;
      hdr.classList.toggle('is-solid', plain || y > 24);
      const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
      if (goingDown && y > innerHeight * .7) hdr.classList.add('is-hidden');
      else if (goingUp || y < innerHeight * .3) hdr.classList.remove('is-hidden');
      lastY = y;
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    const page = document.body.dataset.page;
    $$('.nav a').forEach(a => a.classList.toggle('is-on', a.dataset.k === page));

    const sheet = $('#sheet'), btn = $('#menuBtn'), x = $('#sheetX');
    if (!sheet || !btn) return;
    const open = (on) => {
      sheet.classList.toggle('is-open', on);
      btn.setAttribute('aria-expanded', String(on));
      document.body.classList.toggle('is-locked', on);
      if (lenis) on ? lenis.stop() : lenis.start();
      if (on) setTimeout(() => x && x.focus(), 300); else btn.focus({ preventScroll: true });
    };
    btn.addEventListener('click', () => open(true));
    x && x.addEventListener('click', () => open(false));
    sheet.addEventListener('click', (e) => { if (e.target.closest('a')) open(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet.classList.contains('is-open')) open(false); });
  }

  /* ---------------- Smooth scroll ---------------- */
  let lenis = null;
  function smooth() {
    if (window.Lenis && !reduce && fine) {
      lenis = new Lenis({ duration: 1.15, easing: (x) => 1 - Math.pow(1 - x, 4), smoothWheel: true });
      if (hasGsap && window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    }
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const id = a.getAttribute('href').slice(1); const el = id && document.getElementById(id);
      if (!el || id === 'main') return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: id === 'contact' ? -40 : 0, duration: 1.6 });
      else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- Word split (keeps Persian letters joined) ---------------- */
  function split(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w-mask"><span>${w.replace(/</g, '&lt;')}</span></span>`).join(' ');
    return $$('.w-mask > span', el);
  }

  /* ---------------- Reveals + counters ---------------- */
  function reveals() {
    const items = $$('[data-r]');
    const splits = $$('[data-split]');
    if (!hasGsap || !window.ScrollTrigger || reduce) {
      items.forEach(el => el.removeAttribute('data-r'));
      counters(true);
      return;
    }
    ScrollTrigger.batch(items, {
      start: 'top 88%', once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .09,
        onComplete: () => els.forEach(el => { el.removeAttribute('data-r'); gsap.set(el, { clearProps: 'opacity,transform' }); }) })
    });
    const runSplit = (el, animate) => {
      const ws = split(el);
      if (!animate) return;
      gsap.fromTo(ws, { yPercent: 115 }, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: .05 });
    };
    splits.forEach(el => {
      el.dataset.done = '';
      ScrollTrigger.create({ trigger: el, start: 'top 86%', once: true, onEnter: () => { el.dataset.done = '1'; runSplit(el, true); } });
    });
    hooks.push(() => splits.forEach(el => { if (el.dataset.done) split(el); }));

    const arch = $('.arch img');
    if (arch) gsap.fromTo(arch, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.arch', start: 'top bottom', end: 'bottom top', scrub: true } });
    counters(false);
  }

  function counters(instant) {
    const els = $$('[data-count]');
    const paint = (el, v) => {
      const suf = el.dataset.suffix === '%' && lang === 'fa' ? '٪' : el.dataset.suffix;
      el.textContent = fmt(Math.round(v)) + suf;
      el.dataset.v = v;
    };
    els.forEach(el => paint(el, instant ? +el.dataset.count : 0));
    hooks.push(() => els.forEach(el => paint(el, +el.dataset.v || 0)));
    if (instant) return;
    els.forEach(el => {
      const o = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => gsap.to(o, { v: +el.dataset.count, duration: 2.2, ease: 'expo.out', onUpdate: () => paint(el, o.v) })
      });
    });
  }

  /* ---------------- Contact form ---------------- */
  function form() {
    const f = $('#form'); if (!f) return;
    const wrap = $('#formWrap'), msg = $('#formMsg'), btn = $('button[type="submit"]', f);
    const err = (input, k) => {
      const field = input.closest('.field');
      field.classList.toggle('is-bad', !!k);
      $('.field-err', field).textContent = k ? t(k) : '';
    };
    const check = () => {
      let ok = true;
      const name = f.Name, phone = f.Phone, email = f.Email;
      if (!name.value.trim()) { err(name, 'f_req'); ok = false; } else err(name);
      const digits = phone.value.replace(/\D/g, '');
      if (!digits) { err(phone, 'f_req'); ok = false; }
      else if (digits.length < 8) { err(phone, 'f_bad_phone'); ok = false; }
      else err(phone);
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { err(email, 'f_req'); ok = false; } else err(email);
      const pv = f.Privacy;
      if (pv) { pv.closest('.consent').classList.toggle('is-bad', !pv.checked); if (!pv.checked) ok = false; }
      return ok;
    };
    f.addEventListener('input', (e) => { if (e.target.closest('.is-bad')) { check(); msg.textContent = ''; } });
    f.addEventListener('submit', async (e) => {
      e.preventDefault(); msg.textContent = '';
      if (!check()) {
        const bad = $('.is-bad input, .is-bad textarea', f); bad && bad.focus();
        if (f.Privacy && !f.Privacy.checked && !$('.field.is-bad', f)) msg.textContent = t('f_consent_req');
        return;
      }
      btn.disabled = true; const keep = btn.innerHTML; btn.textContent = t('sending');
      try {
        const fd = new FormData(f);
        fd.set('Language', lang); fd.set('Page', location.pathname);
        const res = await fetch(FORM_URL, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('send');
        wrap.classList.add('is-done');
        if (hasGsap && !reduce) gsap.from('.form-ok > *', { opacity: 0, y: 20, duration: 1, ease: 'expo.out', stagger: .08 });
      } catch (x) { msg.textContent = t('err_send'); }
      finally { btn.disabled = false; btn.innerHTML = keep; }
    });
  }

  /* ---------------- Clocks ---------------- */
  function clocks() {
    const m = $('#clkM'), tt = $('#clkT'); const yr = $('#yr');
    if (yr) yr.textContent = new Date().getFullYear();
    if (!m || !tt) return;
    const tick = () => {
      const d = new Date();
      const f = (tz) => new Intl.DateTimeFormat(LOCALE[lang], { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
      m.textContent = f('Europe/Madrid'); tt.textContent = f('Asia/Tehran');
    };
    tick(); setInterval(tick, 15000); hooks.push(tick);
  }

  /* ---------------- Page transitions ---------------- */
  let pt = null;
  function pages() {
    const root = document.documentElement;
    pt = $('.pt');
    if (!pt) {
      pt = document.createElement('div');
      pt.className = 'pt'; pt.setAttribute('aria-hidden', 'true'); pt.innerHTML = '<i></i><span class="pt-mark"><svg viewBox="10 8 180 152"><use href="#nx"/></svg><b>NOVAREXIUM</b></span>';
      document.body.appendChild(pt);
    }
    const line = pt.querySelector('i');
    const came = store.get('nx-pt', sessionStorage) === '1';
    store.del('nx-pt', sessionStorage);
    if (came && hasGsap && !reduce) {
      const mk = pt.querySelector('.pt-mark');
      gsap.set(pt, { clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(line, { scaleX: 1 }); gsap.set(mk, { opacity: 1 });
      gsap.timeline({ delay: .1, onComplete: () => root.removeAttribute('data-came') })
        .to(mk, { opacity: 0, y: -10, duration: .45, ease: 'power2.in' })
        .to(line, { scaleX: 0, transformOrigin: '100% 50%', duration: .5, ease: 'expo.in' }, '<.05')
        .to(pt, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=.15')
        .set([line, mk], { clearProps: 'all' });
    } else root.removeAttribute('data-came');
    addEventListener('pageshow', (e) => { if (e.persisted) gsap && gsap.set(pt, { clipPath: 'inset(100% 0% 0% 0%)' }); });
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      if (url.pathname === location.pathname) return;
      e.preventDefault();
      leave(url.href);
    });
  }
  function leave(href, { fast = false } = {}) {
    store.set('nx-pt', '1', sessionStorage);
    if (!hasGsap || reduce) { location.href = href; return; }
    const line = pt.querySelector('i'), mk = pt.querySelector('.pt-mark');
    gsap.timeline({ onComplete: () => { location.href = href; } })
      .fromTo(pt, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: fast ? .55 : .8, ease: 'expo.inOut' })
      .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'expo.inOut' }, '<.2')
      .fromTo(mk, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .5, ease: 'expo.out' }, '-=.3')
      .to({}, { duration: .15 });
  }

  /* ---------------- Loader (first visit of the session) ---------------- */
  function loader() {
    const el = $('#loader');
    const seen = store.get('nx-intro', sessionStorage) === '1';
    const cameFromPage = document.documentElement.dataset.came === '1';
    if (!el) return Promise.resolve({ first: false });
    if (seen || reduce || !hasGsap || cameFromPage) { el.hidden = true; return Promise.resolve({ first: false }); }
    store.set('nx-intro', '1', sessionStorage);
    document.body.classList.add('is-locked');

    const paths = $$('.loader-mark path', el);
    paths.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    const imgs = $$('.st-media img[data-def]');
    const ready = Promise.race([
      Promise.all([document.fonts ? document.fonts.ready : 0, ...imgs.map(i => i.decode ? i.decode().catch(() => {}) : 0)]),
      new Promise(r => setTimeout(r, 2600))
    ]);
    return new Promise(resolve => {
      const tl = gsap.timeline();
      tl.to(paths, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: .12 })
        .to(paths, { fillOpacity: 1, strokeOpacity: 0, duration: .5, ease: 'power2.out' }, '-=.35')
        .fromTo('.loader-word', { opacity: 0, letterSpacing: '.9em' }, { opacity: 1, letterSpacing: '.5em', duration: .9, ease: 'expo.out' }, '-=.55')
        .to('.loader-bar i', { scaleX: .7, duration: 1.1, ease: 'power2.out' }, 0);
      Promise.all([ready, new Promise(r => tl.eventCallback('onComplete', r))]).then(() => {
        gsap.timeline({ onComplete: () => { el.hidden = true; } })
          .to('.loader-bar i', { scaleX: 1, duration: .3, ease: 'power2.out' })
          .to('.loader-in', { opacity: 0, y: -14, duration: .5, ease: 'power2.in' }, '+=.05')
          .add(() => { document.body.classList.remove('is-locked'); resolve({ first: true }); }, '-=.1')
          .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '<');
      });
    });
  }

  /* ---------------- Footer wordmark: always fits its row ---------------- */
  function wordmark() {
    const w = $('.ftr-word'); if (!w) return;
    const fit = () => {
      const ps = getComputedStyle(w.parentElement);
      const box = w.parentElement.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight); if (box <= 0) return;
      w.style.fontSize = '100px'; w.style.width = 'max-content'; w.style.maxWidth = 'none';
      const need = w.getBoundingClientRect().width || 1;
      w.style.width = ''; w.style.maxWidth = '';
      w.style.fontSize = Math.min(220, Math.floor(100 * box * .99 / need)) + 'px';
    };
    fit();
    if (document.fonts) document.fonts.ready.then(fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(w.parentElement); else addEventListener('resize', fit);
  }

  /* ---------------- Floating WhatsApp (all pages) ---------------- */
  function waFloat() {
    const a = document.createElement('a');
    a.className = 'wa-float'; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('data-wa', '');
    a.setAttribute('data-i18n-aria', 'wa_tip');
    a.innerHTML = '<svg class="ic--fill" fill="currentColor" aria-hidden="true"><use href="#i-wa"/></svg><span class="wa-tip" data-i18n="wa_tip"></span>';
    a.href = `https://wa.me/${WA}?text=${encodeURIComponent(t('wa_msg'))}`;
    a.setAttribute('aria-label', t('wa_tip')); a.lastChild.textContent = t('wa_tip');
    document.body.appendChild(a);
    // Step aside where WhatsApp is already on screen (contact section, footer).
    const spots = [$('#contact .channels'), $('.ftr')].filter(Boolean);
    if (spots.length && 'IntersectionObserver' in window) {
      const seen = new Set();
      const io = new IntersectionObserver((es) => {
        es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target));
        a.classList.toggle('is-hidden', seen.size > 0);
      }, { threshold: .1 });
      spots.forEach(s => io.observe(s));
    }
  }

  /* ---------------- Boot ---------------- */
  apply();
  header();
  smooth();
  pages();
  waFloat();
  wordmark();
  reveals();
  form();
  clocks();
  const intro = loader();

  window.NX = {
    t, fmt, $, $$, split, leave, reduce, fine, intro,
    onLang: (fn) => hooks.push(fn),
    get lang() { return lang; },
    root: document.documentElement.dataset.root || '',
    get lenis() { return lenis; }
  };
})();
