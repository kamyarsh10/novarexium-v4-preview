/* Novarexium v4: service pages. Steppers, sliders, price bars and the one tool per page
   (home brief, income needed, study budget, Beckham tax). Figures from novarexium v3/FACTS-USED.md. */
(() => {
  'use strict';
  const NX = window.NX; if (!NX) return;
  const { t, $, $$ } = NX;
  const WA = '34614066200';
  const L = () => NX.lang;
  const num = (n) => NX.fmt(Math.round(n), { useGrouping: 'always' });
  const eur = (n) => L() === 'fa' ? `${num(n)} یورو` : L() === 'es' ? `${num(n)} €` : `€${num(n)}`;
  const span = (a, b, plus) => {
    const p = plus ? '+' : '';
    return L() === 'fa' ? `${num(a)} تا ${plus ? 'بیش از ' : ''}${num(b)} یورو` : L() === 'es' ? `${num(a)} – ${num(b)}${p} €` : `€${num(a)} – €${num(b)}${p}`;
  };
  const sub = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pick = (root, name) => { const i = $(`input[name="${name}"]:checked`, root); return i ? i.value : ''; };
  const rows = (dl, list) => { dl.innerHTML = list.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join(''); };
  const sep = () => (L() === 'fa' ? '، ' : ', ');
  const go = (el) => {
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - 20;
    if (NX.lenis) NX.lenis.scrollTo(y, { duration: 1.4 });
    else scrollTo({ top: y, behavior: NX.reduce ? 'auto' : 'smooth' });
  };
  const renders = [];

  /* Steppers: [-] value [+] */
  $$('.stepper').forEach((s) => {
    const o = $('output', s), [less, more] = $$('button', s);
    const lo = +s.dataset.min, hi = +s.dataset.max;
    const paint = () => { const v = +s.dataset.v; o.textContent = num(v); less.disabled = v <= lo; more.disabled = v >= hi; };
    s.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-d]'); if (!b) return;
      s.dataset.v = Math.min(hi, Math.max(lo, +s.dataset.v + +b.dataset.d));
      paint(); s.dispatchEvent(new Event('change', { bubbles: true }));
    });
    paint(); renders.push(paint);
  });

  /* Slider fill */
  const fill = (r) => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min)) * 100 + '%');

  /* Price / salary bars */
  const bars = $$('.tier[data-lo]');
  const paintBars = () => bars.forEach((el) => {
    const lo = +el.dataset.lo, hi = +el.dataset.hi, mx = +el.dataset.max;
    $('b', el).textContent = span(lo, hi, el.hasAttribute('data-plus')) + t(el.dataset.unit);
    const bar = $('.bar i', el);
    bar.style.setProperty('--a', (lo / mx) * 100 + '%');
    bar.style.setProperty('--w', ((hi - lo) / mx) * 100 + '%');
  });
  if (bars.length) {
    paintBars(); renders.push(paintBars);
    if (window.gsap && window.ScrollTrigger && !NX.reduce) {
      bars.forEach((el) => gsap.fromTo($('.bar i', el), { scaleX: 0 }, {
        scaleX: 1, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }));
    }
  }

  /* ---------- Homes: request brief ---------- */
  function brief(p) {
    const r = $('#qBudget', p), out = $('#qBudgetOut', p), dl = $('#qRows', p), fact = $('#qFact', p), wa = $('#qWa', p);
    const R = { rent: { min: 800, max: 8000, step: 100, v: 2000 }, buy: { min: 150000, max: 3000000, step: 10000, v: 600000 } };
    let deal = pick(p, 'deal');
    const set = (d) => { const c = R[d]; r.min = c.min; r.max = c.max; r.step = c.step; r.value = c.v; };
    let lines = [];
    const render = () => {
      const d = pick(p, 'deal');
      if (d !== deal) { R[deal].v = +r.value; set(d); deal = d; }
      const b = +r.value; fill(r);
      const budget = eur(b) + (d === 'rent' ? t('per_mo') : '');
      out.textContent = budget;
      const areas = $$('input[name="area"]:checked', p).map((i) => t(i.value));
      lines = [
        [t('q_deal'), t(d === 'rent' ? 'q_rent' : 'q_buy')],
        [t('q_area'), areas.length ? areas.join(sep()) : t('q_any')],
        [t('q_beds'), t(pick(p, 'beds'))],
        [t('q_budget'), budget],
        [t('q_when'), t(pick(p, 'when'))]
      ];
      rows(dl, lines);
      fact.textContent = d === 'rent' ? sub(t('q_x_rent'), { d: eur(b) }) : sub(t('q_x_buy'), { t: eur(b * 0.08) });
      wa.href = `https://wa.me/${WA}?text=${encodeURIComponent(t('q_wa_intro') + '\n' + lines.map(([a, v]) => `${a}: ${v}`).join('\n'))}`;
    };
    p.addEventListener('change', render);
    r.addEventListener('input', render);
    $('#qForm', p).addEventListener('click', () => {
      const msg = $('#fMsg'); if (!msg) return;
      msg.value = lines.map(([a, v]) => `${a}: ${v}`).join('\n');
      const topic = $('input[name="Topic"][value="Homes"]'); if (topic) topic.checked = true;
      go($('#contact'));
      setTimeout(() => msg.focus({ preventScroll: true }), 900);
    });
    render(); renders.push(render);
  }

  /* ---------- Move: income needed ---------- */
  function income(p) {
    const DN = { main: [2442, 2849], first: [916, 1068], extra: [305, 356] };
    const fam = $('#iFam', p), kids = $('#iKids', p), kidsCtl = $('#iKidsCtl', p);
    const render = () => {
      const route = pick(p, 'route');
      const st = route === 'st';
      fam.disabled = st; kidsCtl.classList.toggle('is-off', st);
      $$('button', kids).forEach((b) => { if (st) b.disabled = true; });
      if (!st) { const v = +kids.dataset.v; $$('button', kids)[0].disabled = v <= 0; $$('button', kids)[1].disabled = v >= +kids.dataset.max; }
      const n = st ? 0 : (pick(p, 'partner') === 'yes' ? 1 : 0) + +kids.dataset.v;
      let lo, hi, list = [], noteK;
      if (route === 'dn') {
        lo = DN.main[0] + (n ? DN.first[0] : 0) + Math.max(0, n - 1) * DN.extra[0];
        hi = DN.main[1] + (n ? DN.first[1] : 0) + Math.max(0, n - 1) * DN.extra[1];
        list.push([t('c_main'), span(DN.main[0], DN.main[1])]);
        if (n) list.push([t('c_first'), '+ ' + span(DN.first[0], DN.first[1])]);
        if (n > 1) list.push([`${t('c_extra')} × ${num(n - 1)}`, '+ ' + span(DN.extra[0] * (n - 1), DN.extra[1] * (n - 1))]);
        noteK = 'c_dn_note';
      } else if (route === 'nl') {
        lo = hi = 2400 + 600 * n;
        list.push([t('c_main'), eur(2400)]);
        if (n) list.push([`${t('c_fam')} × ${num(n)}`, '+ ' + eur(600 * n)]);
        noteK = 'c_nl_note';
      } else {
        lo = hi = 600;
        list.push([t('c_main'), eur(600)]);
        noteK = 'c_st_note';
      }
      $('#iNum', p).textContent = lo === hi ? eur(lo) : span(lo, hi);
      $('#iYear', p).textContent = (lo === hi ? eur(lo * 12) : span(lo * 12, hi * 12)) + t('per_yr');
      rows($('#iRows', p), list);
      $('#iNote', p).textContent = t(noteK);
    };
    p.addEventListener('change', render);
    render(); renders.push(render);
  }

  /* ---------- Study: yearly budget ---------- */
  function costs(p) {
    const TUI = { pub: [700, 3500], pri: [7000, 18000], med: [20000, 28000] };
    const LIV = { big: 1500, mid: 1000 };
    const render = () => {
      const tu = TUI[pick(p, 'prog')], liv = LIV[pick(p, 'city')], yrs = +$('#cYears', p).dataset.v;
      const lo = tu[0] + liv * 12, hi = tu[1] + liv * 12;
      $('#cNum', p).textContent = span(lo, hi);
      rows($('#cRows', p), [
        [t('u_c_tuition'), span(tu[0], tu[1]) + t('per_yr')],
        [t('u_c_living'), eur(liv) + t('per_mo')],
        [yrs === 1 ? t('u_c_one') : sub(t('u_c_all'), { n: num(yrs) }), span(lo * yrs, hi * yrs)]
      ]);
    };
    p.addEventListener('change', render);
    render(); renders.push(render);
  }

  /* ---------- Business: Beckham regime ---------- */
  function tax(p) {
    const r = $('#tInc', p);
    const render = () => {
      const v = +r.value, tx = v * 0.24; fill(r);
      $('#tIncOut', p).textContent = eur(v);
      $('#tNum', p).textContent = eur(tx);
      rows($('#tRows', p), [[t('b_t_keep'), eur(v - tx)], [t('b_t_six'), eur(tx * 6)]]);
    };
    r.addEventListener('input', render);
    render(); renders.push(render);
  }

  /* ---------- Homes: listings (sale + rent) and detail dialog ---------- */
  function listings(sec) {
    const H = (window.NX_HOMES || []).filter((h) => h && h.id);
    const grid = $('#lGrid', sec), empty = $('#lEmpty', sec), count = $('#lCount', sec), note = $('#lNote', sec);
    const sArea = $('#lArea', sec), sBeds = $('#lBeds', sec), sSort = $('#lSort', sec), segs = $$('[data-deal]', sec);
    const dlg = $('#homeDlg');
    const ITP = { Madrid: 6, Marbella: 7, Malaga: 7, Valencia: 10, Barcelona: 10 };
    const RANK = { available: 0, reserved: 1, rented: 2, sold: 2 };
    let deal = 'sale', cur = null, ph = 0;
    const tr = (o) => (o && (o[L()] || o.en)) || '';
    const place = (s) => { const k = 'pl_' + String(s).replace(/\s+/g, '_').replace('á', 'a'); const v = t(k); return v === k ? s : v; };
    const src = (n, w) => `${NX.root || ""}img/homes/${encodeURIComponent(n)}-${w}.webp`;
    const srcset = (n) => `${src(n, 800)} 800w, ${src(n, 1600)} 1600w`;
    const price = (h) => !h.price ? esc(t('l_price_req')) : (h.priceFrom ? `<small>${esc(t('l_from'))}</small>` : h.priceAbout ? `<small>${esc(t('l_about'))}</small>` : '') + eur(h.price) + (h.deal === 'rent' ? `<small>${esc(t('per_mo'))}</small>` : '');
    const bedsTxt = (h) => h.bedsTo ? `${num(h.beds)}–${num(h.bedsTo)}` : num(h.beds);
    const pv = (h) => h.price || Infinity;
    const loc = (h) => [h.area, h.city].filter(Boolean).map(place).join(sep());
    const ic = (n) => `<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
    const off = (h) => h.status && h.status !== 'available';

    const opts = (sel, list, keep) => {
      const v = keep ? sel.value : '';
      sel.innerHTML = list.map(([val, txt]) => `<option value="${esc(val)}">${esc(txt)}</option>`).join('');
      if (list.some(([val]) => val === v)) sel.value = v;
    };
    const fillSelects = (keep) => {
      const cities = [...new Set(H.filter((h) => h.deal === deal).map((h) => h.city))].sort();
      opts(sArea, [['', t('l_all_areas')], ...cities.map((c) => [c, place(c)])], keep);
      opts(sBeds, [['0', t('l_beds_any')], ...[1, 2, 3, 4].map((n) => [String(n), sub(t('l_beds_n'), { n: num(n) })])], keep);
      opts(sSort, [['new', t('l_sort_new')], ['lo', t('l_sort_lo')], ['hi', t('l_sort_hi')]], keep);
    };

    const card = (h) => {
      const c = (h.photos || [])[0];
      return `<article class="home-card${off(h) ? ' is-off' : ''}">
        <div class="home-ph">${c ? `<img src="${src(c, 800)}" srcset="${srcset(c)}" sizes="(max-width: 820px) 100vw, 33vw" alt="" loading="lazy" decoding="async">` : ''}
          ${h.sample ? `<span class="home-badge">${esc(t('st_sample'))}</span>` : ''}${off(h) ? `<span class="home-badge home-badge--st">${esc(t('st_' + h.status))}</span>` : ''}
          <p class="home-price">${price(h)}</p></div>
        <div class="home-body"><h3>${esc(tr(h.title))}</h3>
          <p class="home-loc">${ic('pin')}<span>${esc(loc(h))}</span></p>
          <p class="home-specs"><span>${ic('bed')}${bedsTxt(h)} ${esc(t('l_beds'))}</span>${h.baths ? `<span>${ic('bath')}${num(h.baths)} ${esc(t('l_baths'))}</span>` : ''}${h.size ? `<span>${ic('size')}<span class="ltr">${num(h.size)}</span> ${esc(t('l_m2'))}</span>` : ''}<span class="home-ref ltr">${esc(h.id)}</span></p></div>
        <a class="home-link" href="#home=${encodeURIComponent(h.id)}" data-home="${esc(h.id)}"><span class="vh">${esc(t('l_view'))}: ${esc(tr(h.title))}</span></a>
      </article>`;
    };

    const render = (keep = true) => {
      segs.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.deal === deal)));
      fillSelects(keep);
      const area = sArea.value, beds = +sBeds.value, sort = sSort.value;
      const list = H.filter((h) => h.deal === deal && (!area || h.city === area) && (h.bedsTo || h.beds) >= beds).sort((a, b) =>
        (RANK[a.status] || 0) - (RANK[b.status] || 0) ||
        (sort === 'lo' ? pv(a) - pv(b) : sort === 'hi' ? (b.price || 0) - (a.price || 0) : String(b.added).localeCompare(String(a.added))));
      grid.innerHTML = list.map(card).join('');
      empty.hidden = list.length > 0;
      count.textContent = list.length === 1 ? t('l_count1') : sub(t('l_count'), { n: num(list.length) });
      note.hidden = !H.some((h) => h.sample);
      if (window.gsap && !NX.reduce) gsap.fromTo($$('.home-card', grid), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'expo.out', clearProps: 'opacity,transform' });
    };
    const setDeal = (d) => { if (d !== deal) { deal = d; render(false); } };
    segs.forEach((b) => b.addEventListener('click', () => setDeal(b.dataset.deal)));
    [sArea, sBeds, sSort].forEach((s) => s.addEventListener('change', () => render()));

    /* Detail dialog */
    const showPh = (i) => {
      const P = cur.photos || [];
      ph = (i + P.length) % P.length;
      const img = $('#hdImg');
      img.src = src(P[ph], 1600); img.srcset = srcset(P[ph]); img.sizes = '(max-width: 820px) 100vw, 60vw';
      img.alt = tr(cur.title);
      $('#hdCnt').textContent = `${ph + 1} / ${P.length}`;
      $$('#hdThumbs button').forEach((b, k) => b.setAttribute('aria-current', String(k === ph)));
    };
    const fillDlg = () => {
      const h = cur, P = h.photos || [];
      $('#hdDeal').textContent = t(h.deal === 'rent' ? 'l_forrent' : 'l_forsale') + ' · ' + h.id;
      $('#hdT').textContent = tr(h.title);
      $('#hdLoc').innerHTML = ic('pin') + `<span>${esc(loc(h))}</span>`;
      $('#hdPrice').innerHTML = price(h);
      const bd = $('#hdBadge'); bd.hidden = !(h.sample || off(h));
      bd.textContent = off(h) ? t('st_' + h.status) : t('st_sample');
      bd.classList.toggle('home-badge--st', off(h));
      $('#hdSpecs').innerHTML = [[t('l_bed_full'), bedsTxt(h)], h.baths && [t('l_bath_full'), num(h.baths)], h.size && [t('l_size'), `${num(h.size)} ${t('l_m2')}`], [t('l_type'), t('l_type_' + (h.type || 'apartment'))]].filter(Boolean)
        .map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('');
      $('#hdText').textContent = tr(h.text);
      const F = (h.features || []).map((f) => t('hf_' + f)).filter((s) => !/^hf_/.test(s));
      $('.hd-feat').hidden = !F.length;
      $('#hdFeat').innerHTML = F.map((f) => `<li>${esc(f)}</li>`).join('');
      $('#hdCostT').hidden = $('#hdCost').hidden = !h.price;
      if (!h.price) { /* price on request: no cost table */ } else if (h.deal === 'rent') {
        $('#hdCostT').textContent = t('l_costs_rent');
        rows($('#hdCost'), [[t('l_dep'), eur(h.price)], [t('l_agency'), t('l_zero')]]);
      } else {
        const r = ITP[String(h.city).replace('á', 'a')];
        const list = r ? [[sub(t('l_itp'), { r: L() === 'fa' ? `${num(r)}٪` : `${r}%` }), eur(h.price * r / 100)]] : [[t('l_itp_reg'), '']];
        list.push([t('l_fees'), eur(h.price * 0.02)]);
        list.push([t('l_total'), eur(h.price * (1 + (r || 0) / 100 + 0.02))]);
        $('#hdCostT').textContent = t('l_costs_sale');
        rows($('#hdCost'), list);
      }
      $('#hdWa').href = `https://wa.me/${WA}?text=${encodeURIComponent(sub(t('l_wa'), { id: h.id, t: tr(h.title) }))}`;
      $('#hdThumbs').innerHTML = P.length > 1 ? P.map((n, k) => `<button type="button" aria-label="${k + 1} / ${P.length}"><img src="${src(n, 800)}" alt="" loading="lazy"></button>`).join('') : '';
      $('#hdPrev').hidden = $('#hdNext').hidden = P.length < 2;
      showPh(ph);
    };
    const open = (id, push = true) => {
      const h = H.find((x) => x.id === id); if (!h || !dlg) return;
      cur = h; ph = 0; fillDlg();
      if (!dlg.open) { dlg.showModal(); document.body.classList.add('hd-open'); if (NX.lenis) NX.lenis.stop(); }
      $('.hd-info', dlg).scrollTop = 0; $('.hd-in', dlg).scrollTop = 0;
      if (push) history.replaceState(null, '', '#home=' + encodeURIComponent(id));
    };
    const close = () => { if (dlg && dlg.open) dlg.close(); };
    if (dlg) {
      dlg.addEventListener('close', () => {
        document.body.classList.remove('hd-open'); if (NX.lenis) NX.lenis.start();
        if (/^#home=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
        cur = null;
      });
      dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
      $('#hdX').addEventListener('click', close);
      $('#hdPrev').addEventListener('click', () => showPh(ph - 1));
      $('#hdNext').addEventListener('click', () => showPh(ph + 1));
      $('#hdThumbs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) showPh($$('#hdThumbs button').indexOf(b)); });
      dlg.addEventListener('keydown', (e) => {
        if (!cur || (cur.photos || []).length < 2) return;
        const rtl = document.dir === 'rtl';
        if (e.key === 'ArrowRight') showPh(ph + (rtl ? -1 : 1));
        if (e.key === 'ArrowLeft') showPh(ph + (rtl ? 1 : -1));
      });
      $('#hdVisit').addEventListener('click', () => {
        const msg = $('#fMsg'), h = cur; close(); if (!msg || !h) return;
        msg.value = sub(t('l_visit_msg'), { id: h.id, t: tr(h.title) });
        const topic = $('input[name="Topic"][value="Homes"]'); if (topic) topic.checked = true;
        setTimeout(() => { go($('#contact')); setTimeout(() => msg.focus({ preventScroll: true }), 900); }, 60);
      });
    }
    grid.addEventListener('click', (e) => {
      const a = e.target.closest('[data-home]'); if (!a) return;
      e.preventDefault(); open(a.dataset.home);
    });

    /* #rent / #buy from the hero or the main page, #home=NX-... deep link */
    const fromHash = (h, smooth) => {
      if (h === '#rent' || h === '#buy') { setDeal(h === '#rent' ? 'rent' : 'sale'); setTimeout(() => go(sec), smooth ? 0 : 500); return true; }
      const m = /^#home=(.+)$/.exec(h);
      if (m) { const x = H.find((y) => y.id === decodeURIComponent(m[1])); if (x) { setDeal(x.deal); open(x.id, false); } return true; }
      return false;
    };
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href="#rent"], a[href="#buy"]'); if (!a) return;
      e.preventDefault(); fromHash(a.getAttribute('href'), true);
    });
    addEventListener('hashchange', () => { if (!(cur && /^#home=/.test(location.hash))) fromHash(location.hash, true); });
    render(false);
    if (location.hash) {
      const h0 = location.hash;
      if (/^#(rent|buy)$/.test(h0)) history.replaceState(null, '', location.pathname + location.search);
      fromHash(h0, false);
    }
    renders.push(() => { render(); if (cur) fillDlg(); });
  }
  const lst = $('#listings'); if (lst) listings(lst);

  /* Move: "work it out" buttons on each route preselect that route in the calculator */
  $$('[data-route]').forEach((b) => b.addEventListener('click', () => {
    const r = $(`#income input[name="route"][value="${b.dataset.route}"]`);
    if (r && !r.checked) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
  }));

  /* Move: approval letters viewer */
  const apDlg = $('#apDlg');
  if (apDlg) {
    const figs = $$('.ap-fig', apDlg), dots = $$('#apDots i', apDlg);
    let at = 0;
    const show = (n) => {
      at = (n + figs.length) % figs.length;
      figs.forEach((f, i) => f.classList.toggle('is-on', i === at));
      dots.forEach((d, i) => d.classList.toggle('is-on', i === at));
    };
    $('#apRow').addEventListener('click', (e) => { const c = e.target.closest('.ap-card'); if (!c) return; show(+c.dataset.i); apDlg.showModal(); document.body.classList.add('hd-open'); if (NX.lenis) NX.lenis.stop(); });
    apDlg.addEventListener('close', () => { document.body.classList.remove('hd-open'); if (NX.lenis) NX.lenis.start(); });
    $('#apX').addEventListener('click', () => apDlg.close());
    $('#apPrev').addEventListener('click', () => show(at - 1));
    $('#apNext').addEventListener('click', () => show(at + 1));
    apDlg.addEventListener('click', (e) => { if (e.target === apDlg) apDlg.close(); });
    apDlg.addEventListener('keydown', (e) => {
      const rtl = document.dir === 'rtl';
      if (e.key === 'ArrowRight') show(at + (rtl ? -1 : 1));
      if (e.key === 'ArrowLeft') show(at + (rtl ? 1 : -1));
    });
    let x0 = null;
    apDlg.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    apDlg.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 48) show(at + ((dx < 0) === (document.dir !== 'rtl') ? 1 : -1));
    }, { passive: true });
  }

  /* Flight line: the plane crosses the dashed line as the steps scroll by */
  if (window.gsap && window.ScrollTrigger && !NX.reduce) {
    $$('.flight').forEach((f) => {
      const p = $('.flight-plane', f);
      const dist = () => (f.clientWidth - p.getBoundingClientRect().width) * (document.dir === 'rtl' ? -1 : 1);
      gsap.fromTo(p, { x: 0 }, { x: dist, ease: 'none', scrollTrigger: { trigger: f, start: 'top 95%', end: 'top 35%', scrub: 0.6, invalidateOnRefresh: true } });
    });
  }

  const tools = { brief, income, costs, tax };
  $$('[data-tool]').forEach((p) => { const fn = tools[p.dataset.tool]; if (fn) fn(p); });
  NX.onLang(() => renders.forEach((fn) => fn()));
})();
