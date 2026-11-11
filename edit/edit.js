/* Novarexium edit mode. Opens when the page address ends in ?edit (loaded by edit/apply.js).
   Click any text to type over it; the toolbar saves, changes photos, manages homes and restores old versions.
   Saves go to edit/api.php (login required). Nothing here runs for normal visitors. */
(function () {
  'use strict';
  if (window.__nxEdit) return; window.__nxEdit = true;

  var root = document.documentElement.getAttribute('data-root') || '';
  var LANG = document.documentElement.lang || 'fa';
  var API = root + 'edit/api.php';
  var E = window.NX_EDITS = window.NX_EDITS || {}; E.images = E.images || {}; E.text = E.text || {};
  var csrf = '', dirty = 0, pending = {}, uiLang = (localStorage.getItem('nx-ui') || 'fa');

  /* ---------- words ---------- */
  var S = {
    fa: { title: 'حالت ویرایش', pw: 'رمز عبور', in: 'ورود', bad: 'رمز اشتباه است', lock: 'تلاش‌های زیاد. چند دقیقه بعد دوباره امتحان کنید.', err: 'خطا. دوباره امتحان کنید.',
      hint: 'روی هر متن کلیک کنید و تایپ کنید. در پایان «ذخیره» را بزنید.', save: 'ذخیره', ch: 'تغییر', photos: 'عکس‌ها', homes: 'ملک‌ها', vers: 'نسخه‌های قبلی',
      page: 'صفحه', lang: 'زبان', exit: 'خروج', saved: 'ذخیره شد', unsaved: 'تغییرات ذخیره نشده از بین می‌رود. ادامه می‌دهید؟', nothing: 'تغییری نیست',
      close: 'بستن', change: 'تغییر عکس', reset: 'برگرداندن به اصلی', changed: 'تغییر کرده', add: 'افزودن ملک', edit: 'ویرایش', del: 'حذف', sure: 'مطمئن هستید؟',
      back: 'برگشت', done: 'تأیید', restore: 'برگرداندن این نسخه', restoreSure: 'سایت به این نسخه برمی‌گردد. ادامه می‌دهید؟', none: 'هنوز نسخه‌ای نیست',
      id: 'شناسه', status: 'وضعیت', deal: 'نوع', price: 'قیمت (یورو)', beds: 'خواب (از)', bedsTo: 'خواب (تا)', baths: 'حمام', size: 'متراژ (m²)', city: 'شهر', type: 'نوع ملک',
      ttl: 'عنوان', txt: 'توضیح', feat: 'امکانات', ph: 'عکس‌ها (اولی روی کارت)', addPh: 'افزودن عکس', cover: 'روی کارت', from: 'قیمت «از»', about: 'قیمت «حدود»',
      sale: 'فروش', rent: 'اجاره', available: 'موجود', reserved: 'رزرو شده', sold: 'فروخته شد', rented: 'اجاره رفت', apartment: 'آپارتمان', house: 'خانه/ویلا',
      onReq: 'قیمت خالی = «قیمت با تماس»', pubHomes: 'ذخیره ملک‌ها', homesSaved: 'ملک‌ها ذخیره شد', uploading: 'در حال آپلود…', tipPhotos: 'عکس‌های این صفحه. روی عکس بزنید تا عوضش کنید.',
      editNote: 'متن‌های ملک‌ها از بخش «ملک‌ها» ویرایش می‌شود.', ui: 'English', gk: 'کلید ویرایش', ghnote: 'ذخیره شد. برای بازدیدکنندگان تا چند دقیقه دیگر دیده می‌شود.' },
    en: { title: 'Edit mode', pw: 'Password', in: 'Sign in', bad: 'Wrong password', lock: 'Too many tries. Wait a few minutes.', err: 'Something went wrong. Try again.',
      hint: 'Click any text and type. Press Save when done.', save: 'Save', ch: 'changes', photos: 'Photos', homes: 'Homes', vers: 'Earlier versions',
      page: 'Page', lang: 'Language', exit: 'Exit', saved: 'Saved', unsaved: 'Unsaved changes will be lost. Continue?', nothing: 'No changes',
      close: 'Close', change: 'Change photo', reset: 'Back to original', changed: 'Changed', add: 'Add home', edit: 'Edit', del: 'Delete', sure: 'Are you sure?',
      back: 'Back', done: 'OK', restore: 'Restore this version', restoreSure: 'The site goes back to this version. Continue?', none: 'No versions yet',
      id: 'ID', status: 'Status', deal: 'Deal', price: 'Price (EUR)', beds: 'Bedrooms (from)', bedsTo: 'Bedrooms (to)', baths: 'Bathrooms', size: 'Size (m²)', city: 'City', type: 'Type',
      ttl: 'Title', txt: 'Description', feat: 'Features', ph: 'Photos (first is the card cover)', addPh: 'Add photo', cover: 'Cover', from: 'Price is "From"', about: 'Price is "About"',
      sale: 'Sale', rent: 'Rent', available: 'Available', reserved: 'Reserved', sold: 'Sold', rented: 'Rented', apartment: 'Apartment', house: 'House / villa',
      onReq: 'Empty price shows "Price on request"', pubHomes: 'Save homes', homesSaved: 'Homes saved', uploading: 'Uploading…', tipPhotos: 'Photos on this page. Click one to replace it.',
      editNote: 'Home texts are edited in the Homes panel.', ui: 'فارسی', gk: 'Edit key', ghnote: 'Saved. Visitors see it in a few minutes.' }
  };
  var tr = function (k) { return (S[uiLang] || S.fa)[k] || k; };
  var FEATS = { lift: ['آسانسور', 'Lift'], heating: ['گرمایش', 'Heating'], ac: ['کولر', 'A/C'], furnished: ['مبله', 'Furnished'], metro: ['مترو', 'Metro'], concierge: ['نگهبان', 'Concierge'],
    terrace: ['تراس', 'Terrace'], storage: ['انباری', 'Storage'], pool: ['استخر', 'Pool'], sea: ['دریا', 'Sea'], parking: ['پارکینگ', 'Parking'], garden: ['باغ', 'Garden'], gym: ['باشگاه', 'Gym'] };
  var PAGES = [['index.html', 'Home / صفحه اصلی'], ['homes.html', 'Homes / ملک'], ['move.html', 'Move / مهاجرت'], ['study.html', 'Study / تحصیل'], ['business.html', 'Business / کسب‌وکار'], ['legal.html', 'Legal'], ['privacy.html', 'Privacy']];

  /* ---------- helpers ---------- */
  function h(tag, p) {
    var e = document.createElement(tag), a = Array.prototype.slice.call(arguments, 2);
    for (var k in (p || {})) {
      if (k === 'class') e.className = p[k]; else if (k === 'text') e.textContent = p[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), p[k]); else if (p[k] === true) e.setAttribute(k, ''); else if (p[k] !== false && p[k] != null) e.setAttribute(k, p[k]);
    }
    a.forEach(function (c) { if (c == null) return; (Array.isArray(c) ? c : [c]).forEach(function (x) { e.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); }); });
    return e;
  }
  /* ---------- GitHub backend: used on the github.io preview, where there is no PHP ----------
     Her changes are committed straight into the repo with a one-time key kept only in this browser. */
  var GH = /\.github\.io$/.test(location.hostname) || /[?&]edit=github/.test(location.search);
  var ghO = location.hostname.split('.')[0], ghR = location.pathname.split('/')[1] || 'repo';
  var ghTok = ''; try { ghTok = localStorage.getItem('nx-gh') || ''; } catch (e) {}
  function ghReq(path, opt) {
    opt = opt || {}; opt.headers = Object.assign({ Authorization: 'Bearer ' + ghTok, Accept: 'application/vnd.github+json' }, opt.headers || {});
    return fetch('https://api.github.com/repos/' + ghO + '/' + ghR + path, opt).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); });
  }
  function b64(bytes) { var s = '', a = new Uint8Array(bytes); for (var i = 0; i < a.length; i += 8192) s += String.fromCharCode.apply(null, a.subarray(i, i + 8192)); return btoa(s); }
  function ghPut(path, bytes, msg) {
    return ghReq('/contents/' + path + '?t=' + Date.now()).then(function (g) {
      var body = { message: msg, content: b64(bytes) }; if (g.s === 200 && g.j.sha) body.sha = g.j.sha;
      return ghReq('/contents/' + path, { method: 'PUT', body: JSON.stringify(body) });
    }).then(function (r) { if (r.s !== 200 && r.s !== 201) throw new Error('gh ' + r.s); return r; });
  }
  function ghEdits(ref) {
    return ghReq('/contents/edit/data/edits.json?t=' + Date.now() + (ref ? '&ref=' + ref : '')).then(function (g) {
      var d = {};
      if (g.s === 200 && g.j.content) { try { d = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(g.j.content.replace(/\s/g, '')), function (c) { return c.charCodeAt(0); }))); } catch (e) { d = {}; } }
      d.text = d.text || {}; d.images = d.images || {}; if (d.homes === undefined) d.homes = null; return d;
    });
  }
  function ghSaveEdits(d, msg) {
    var enc = new TextEncoder(), json = JSON.stringify(d).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    return ghPut('edit/data/edits.json', enc.encode(json), msg).then(function () { return ghPut('edit/data/edits.js', enc.encode('window.NX_EDITS=' + json + ';'), msg); });
  }
  function ghChange(msg, fn) { return ghEdits().then(function (d) { var out = fn(d); return ghSaveEdits(d, msg).then(function () { return out; }); }); }
  function fileBytes(blob) { return blob.arrayBuffer(); }
  function rid(p) { var a = new Uint8Array(4); crypto.getRandomValues(a); return p + new Date().toISOString().slice(2, 10).replace(/-/g, '') + Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function ghApi(action, body, isForm) {
    var fail = function (e) { return { ok: false, error: String(e && e.message || e), status: /gh 40[13]/.test(String(e && e.message)) ? 401 : 500 }; };
    if (action === 'status') {
      if (!ghTok) return Promise.resolve({ ok: true, auth: false });
      return ghReq('').then(function (r) { var ok = r.s === 200 && r.j.permissions && r.j.permissions.push; if (!ok) { try { localStorage.removeItem('nx-gh'); } catch (e) {} ghTok = ''; } return { ok: true, auth: !!ok }; }).catch(function () { return { ok: true, auth: false }; });
    }
    if (action === 'login') {
      ghTok = String((body && body.password) || '').trim();
      return ghReq('').then(function (r) {
        if (r.s === 200 && r.j.permissions && r.j.permissions.push) { try { localStorage.setItem('nx-gh', ghTok); } catch (e) {} return { ok: true, status: 200 }; }
        ghTok = ''; return { ok: false, status: 401 };
      }).catch(function () { ghTok = ''; return { ok: false, status: 500 }; });
    }
    if (action === 'logout') return Promise.resolve({ ok: true });
    var done = function (p) { return p.then(function (x) { return Object.assign({ ok: true }, x || {}); }).catch(fail); };
    if (action === 'save') return done(ghChange('Edit text', function (d) {
      for (var l in body.text) { if (['fa', 'en', 'es'].indexOf(l) < 0) continue; d.text[l] = d.text[l] || {};
        for (var k in body.text[l]) { var v = body.text[l][k]; if (!/^[A-Za-z0-9_]{1,60}$/.test(k) || typeof v !== 'string') continue; v = v.replace(/\s+/g, ' ').trim(); if (!v || v.length > 4000) continue; d.text[l][k] = v; }
        if (!Object.keys(d.text[l]).length) delete d.text[l]; }
    }));
    if (action === 'img') {
      var key = body.get('key'), id = rid('p');
      return done(Promise.all([fileBytes(body.get('f960')), fileBytes(body.get('f1920'))]).then(function (b) {
        return ghPut('img/uploads/' + id + '-960.webp', b[0], 'Photo').then(function () { return ghPut('img/uploads/' + id + '-1920.webp', b[1], 'Photo'); });
      }).then(function () { return ghChange('Change photo', function (d) { d.images[key] = 'img/uploads/' + id; return { base: 'img/uploads/' + id }; }); }));
    }
    if (action === 'imgreset') return done(ghChange('Reset photo', function (d) { delete d.images[body.key]; }));
    if (action === 'homephoto') {
      var nm = rid('h');
      return done(Promise.all([fileBytes(body.get('f800')), fileBytes(body.get('f1600'))]).then(function (b) {
        return ghPut('img/homes/' + nm + '-800.webp', b[0], 'Home photo').then(function () { return ghPut('img/homes/' + nm + '-1600.webp', b[1], 'Home photo'); });
      }).then(function () { return { name: nm }; }));
    }
    if (action === 'homes') return done(ghChange('Edit homes', function (d) { d.homes = body.reset ? null : body.homes; }));
    if (action === 'versions') return done(ghReq('/commits?path=edit/data/edits.json&per_page=30').then(function (r) {
      return { versions: (Array.isArray(r.j) ? r.j : []).slice(1).map(function (c) { return { id: c.sha, label: (c.commit.committer.date || '').replace('T', '  ').slice(0, 17) }; }) }; }));
    if (action === 'restore') return done(ghEdits(body.id).then(function (d) { return ghSaveEdits(d, 'Restore version'); }));
    return Promise.resolve({ ok: false, error: 'unknown' });
  }

  function api(action, body, isForm) {
    if (GH) return ghApi(action, body, isForm);
    var o ={ method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', headers: {} };
    if (body !== undefined) { o.headers['X-CSRF'] = csrf; if (isForm) o.body = body; else { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(body); } }
    return fetch(API + '?a=' + action, o).then(function (r) { return r.json().catch(function () { return { ok: false, error: 'bad' }; }).then(function (j) { j.status = r.status; return j; }); });
  }
  function blobOf(file, w, q) {
    return createImageBitmap(file).then(function (bm) {
      var sc = Math.min(1, w / bm.width), c = document.createElement('canvas');
      c.width = Math.round(bm.width * sc); c.height = Math.round(bm.height * sc);
      c.getContext('2d').drawImage(bm, 0, 0, c.width, c.height);
      return new Promise(function (res) { c.toBlob(res, 'image/webp', q || 0.82); });
    });
  }

  /* ---------- UI shell (shadow DOM keeps the site's CSS out) ---------- */
  var host = h('div', { id: 'nx-edit-ui' });
  host.style.cssText = 'all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none;';
  var sh = host.attachShadow({ mode: 'open' });
  var css = document.createElement('style');
  css.textContent =
    ':host{all:initial}*{box-sizing:border-box;font-family:system-ui,"Segoe UI",Tahoma,sans-serif}' +
    '.bar{position:fixed;bottom:10px;left:0;right:0;margin:0 auto;width:fit-content;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;background:#2A211C;color:#F7F2EB;padding:10px 12px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.35);pointer-events:auto;max-width:calc(100vw - 20px);font-size:14px}' +
    'button,select{font:inherit;border:0;border-radius:10px;padding:9px 14px;cursor:pointer;background:#4a3d35;color:#F7F2EB;min-height:40px}' +
    'button:hover{background:#5c4c42}.pri{background:#B98A5E;color:#1b1511;font-weight:700}.pri:hover{background:#D9B68F}' +
    '@media(max-width:640px){.bar{gap:6px;padding:8px}.bar button,.bar select{padding:7px 9px;min-height:36px;font-size:13px}}' +
    'select{background:#4a3d35;padding:9px 8px}.cnt{opacity:.8;font-size:13px}.hint{opacity:.75;font-size:12px;flex-basis:100%;text-align:center}' +
    '.toast{position:fixed;top:18px;left:50%;transform:translateX(-50%);background:#2A211C;color:#F7F2EB;padding:10px 18px;border-radius:12px;pointer-events:none;box-shadow:0 6px 24px rgba(0,0,0,.3);font-size:14px}' +
    '.ov{position:fixed;inset:0;background:rgba(20,14,10,.55);display:flex;align-items:center;justify-content:center;pointer-events:auto;padding:12px}' +
    '.card{background:#F7F2EB;color:#2A211C;border-radius:18px;max-width:880px;width:100%;max-height:92vh;overflow:auto;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.4)}' +
    '.card h2{margin:0 0 12px;font-size:19px}.card button{background:#e6dccd;color:#2A211C}.card button:hover{background:#dccfba}.card .pri{background:#B98A5E;color:#1b1511}' +
    '.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:8px 0}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}' +
    '.ph{border:1px solid #d8c9b4;border-radius:12px;overflow:hidden;background:#fff}.ph img{display:block;width:100%;height:120px;object-fit:cover}.ph div{padding:8px;font-size:12px;display:flex;flex-direction:column;gap:6px}' +
    '.badge{background:#B98A5E;color:#1b1511;border-radius:6px;padding:2px 6px;font-size:11px;width:max-content}' +
    'label{display:flex;flex-direction:column;gap:4px;font-size:13px;flex:1 1 150px}input[type=text],input[type=number],input[type=password],textarea,select.f{border:1px solid #cdbda4;border-radius:10px;padding:9px;font:inherit;background:#fff;color:#2A211C;min-height:40px;width:100%}' +
    'textarea{min-height:84px}.home{display:flex;gap:10px;align-items:center;border:1px solid #d8c9b4;border-radius:12px;padding:8px;background:#fff;margin:8px 0}.home img{width:84px;height:58px;object-fit:cover;border-radius:8px;background:#ddd}.home b{font-size:14px}.grow{flex:1;min-width:0}' +
    '.chk{flex-direction:row;align-items:center;gap:6px;flex:0 0 auto;background:#fff;border:1px solid #d8c9b4;border-radius:8px;padding:6px 10px}.chk input{margin:0}.err{color:#a02a1a;font-size:13px;min-height:18px}' +
    '.sm{padding:6px 10px;min-height:32px;font-size:12px}fieldset{border:1px solid #d8c9b4;border-radius:12px;margin:10px 0;padding:10px}legend{padding:0 6px;font-size:13px;font-weight:700}';
  sh.appendChild(css);
  document.documentElement.appendChild(host);
  var layer = h('div'); sh.appendChild(layer);
  function dirAttr() { return uiLang === 'fa' ? 'rtl' : 'ltr'; }
  function toast(msg) { var t = h('div', { class: 'toast', text: msg, dir: dirAttr() }); sh.appendChild(t); setTimeout(function () { t.remove(); }, 2200); }
  function overlay(inner) {
    var ov = h('div', { class: 'ov', dir: dirAttr() }, h('div', { class: 'card' }, inner));
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) ov.remove(); });
    sh.appendChild(ov); return ov;
  }

  /* ---------- page styles for edit mode ---------- */
  var pst = document.createElement('style');
  pst.textContent =
    '.nxe-on{outline:1.5px dashed rgba(185,138,94,.85)!important;outline-offset:3px;cursor:text!important}' +
    '.nxe-on:hover{outline:2px solid #B98A5E!important;background:rgba(185,138,94,.14)}' +
    '.nxe-ed{outline:2px solid #B98A5E!important;background:rgba(255,255,255,.18);-webkit-user-select:text;user-select:text}' +
    '.js [data-r]{opacity:1!important;transform:none!important}.w-mask>span{transform:none!important}';
  document.head.appendChild(pst);

  /* ---------- login ---------- */
  function login() {
    var pw = h('input', { type: 'password', autocomplete: 'current-password', placeholder: tr('pw') });
    var er = h('div', { class: 'err' });
    var go = function () {
      er.textContent = '';
      api('login', { password: pw.value }).then(function (j) {
        if (j.ok) { csrf = j.csrf; ov.remove(); start(); syncFresh(); }
        else er.textContent = j.status === 429 ? tr('lock') : j.status === 401 ? tr('bad') : tr('err');
      }).catch(function () { er.textContent = tr('err'); });
    };
    pw.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    var ov = overlay([h('h2', { text: tr('title') }), h('label', {}, GH ? tr('gk') : tr('pw'), pw), er, h('div', { class: 'row' }, h('button', { class: 'pri', text: tr('in'), onclick: go }),
      h('button', { text: tr('ui'), onclick: function () { uiLang = uiLang === 'fa' ? 'en' : 'fa'; localStorage.setItem('nx-ui', uiLang); ov.remove(); login(); } }))]);
    setTimeout(function () { pw.focus(); }, 50);
  }

  /* ---------- text editing ---------- */
  var SKIP = { skip: 1, doc_title: 1, meta_desc: 1 };
  function editable(el) {
    if (!el.dataset || !el.dataset.i18n) return false;
    var k = el.dataset.i18n;
    if (SKIP[k] || /_(doc|meta)$/.test(k)) return false;
    if (/^(OPTION|INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.closest('select')) return false;
    return true;
  }
  function markText() { [].forEach.call(document.querySelectorAll('[data-i18n]'), function (el) { if (editable(el)) el.classList.add('nxe-on'); }); }
  function caretAt(x, y) {
    var r = null;
    if (document.caretRangeFromPoint) r = document.caretRangeFromPoint(x, y);
    else if (document.caretPositionFromPoint) { var p = document.caretPositionFromPoint(x, y); if (p) { r = document.createRange(); r.setStart(p.offsetNode, p.offset); r.collapse(true); } }
    if (r) { var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  }
  var cur = null;
  function stopEdit() { if (cur) { cur.removeAttribute('contenteditable'); cur.classList.remove('nxe-ed'); cur = null; } }
  function note(el) {
    var key = el.dataset.i18n, v = el.textContent.replace(/\s+/g, ' ').trim();
    (pending[LANG] = pending[LANG] || {})[key] = v;
    [].forEach.call(document.querySelectorAll('[data-i18n="' + key + '"]'), function (o) { if (o !== el) o.textContent = v; });
    var n = 0; for (var l in pending) n += Object.keys(pending[l]).length; dirty = n; updateBar();
  }
  document.addEventListener('click', function (e) {
    if (e.composedPath().indexOf(host) >= 0) return;
    var el = e.target.closest && e.target.closest('[data-i18n]');
    if (el && editable(el)) {
      e.preventDefault(); e.stopPropagation();
      if (cur !== el) {
        stopEdit(); cur = el; el.setAttribute('contenteditable', 'true'); el.classList.add('nxe-ed'); el.focus(); caretAt(e.clientX, e.clientY);
      }
      return;
    }
    if (e.target.closest('a,button,form,summary,[role=button]')) { e.preventDefault(); e.stopPropagation(); }
    if (cur && !el) stopEdit();
  }, true);
  document.addEventListener('submit', function (e) { e.preventDefault(); e.stopPropagation(); }, true);
  document.addEventListener('input', function (e) { if (cur && e.target === cur) note(cur); }, true);
  document.addEventListener('keydown', function (e) {
    if (!cur) return;
    e.stopPropagation();
    if (e.key === 'Enter') { e.preventDefault(); stopEdit(); }
    else if (e.key === 'Escape') stopEdit();
  }, true);
  document.addEventListener('keyup', function (e) { if (cur) e.stopPropagation(); }, true);
  document.addEventListener('paste', function (e) {
    if (!cur) return; e.preventDefault();
    var t = (e.clipboardData || window.clipboardData).getData('text').replace(/\s+/g, ' ');
    document.execCommand('insertText', false, t);
  }, true);
  window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------- toolbar ---------- */
  var bar, cnt, saveBtn;
  function updateBar() { if (cnt) cnt.textContent = dirty ? dirty + ' ' + tr('ch') : ''; if (saveBtn) saveBtn.disabled = !dirty; }
  function doSave() {
    stopEdit();
    if (!dirty) return toast(tr('nothing'));
    api('save', { text: pending }).then(function (j) {
      if (!j.ok) return toast(tr('err'));
      for (var l in pending) { E.text[l] = E.text[l] || {}; for (var k in pending[l]) E.text[l][k] = pending[l][k]; }
      pending = {}; dirty = 0; updateBar(); toast(GH ? tr('ghnote') : tr('saved') + ' ✓');
    }).catch(function () { toast(tr('err')); });
  }
  function go(url) { if (dirty && !confirm(tr('unsaved'))) return; dirty = 0; location.href = url; }
  function pageUrl(file, lang) { return new URL(root + (lang === 'fa' ? '' : lang + '/') + file + '?edit', location.href).href; }
  function curFile() { var f = location.pathname.split('/').pop(); return f || 'index.html'; }
  function start() {
    markText();
    if (bar) bar.remove();
    var pg = h('select', { title: tr('page') }); PAGES.forEach(function (p) { pg.appendChild(h('option', { value: p[0], text: p[1], selected: p[0] === curFile() })); });
    pg.addEventListener('change', function () { go(pageUrl(pg.value, LANG)); });
    var lg = h('select', { title: tr('lang') }); [['fa', 'فارسی'], ['en', 'English'], ['es', 'Español']].forEach(function (l) { lg.appendChild(h('option', { value: l[0], text: l[1], selected: l[0] === LANG })); });
    lg.addEventListener('change', function () { go(pageUrl(curFile(), lg.value)); });
    cnt = h('span', { class: 'cnt' });
    saveBtn = h('button', { class: 'pri', text: tr('save'), onclick: doSave });
    bar = h('div', { class: 'bar', dir: dirAttr() }, saveBtn, cnt, pg, lg,
      h('button', { text: tr('photos'), onclick: photosPanel }), h('button', { text: tr('homes'), onclick: homesPanel }), h('button', { text: tr('vers'), onclick: versionsPanel }),
      h('button', { text: tr('ui'), onclick: function () { uiLang = uiLang === 'fa' ? 'en' : 'fa'; localStorage.setItem('nx-ui', uiLang); start(); } }),
      h('button', { text: tr('exit'), onclick: function () { if (dirty && !confirm(tr('unsaved'))) return; dirty = 0; api('logout', {}).then(function () { location.href = location.pathname; }); } }),
      h('div', { class: 'hint', text: tr('hint') }));
    layer.appendChild(bar); updateBar();
  }

  /* ---------- photos ---------- */
  function baseOf(src) {
    if (!src) return null; var s = src.split('?')[0]; if (root && s.indexOf(root) === 0) s = s.slice(root.length);
    var m = s.match(/^(.*?)-(\d+)\.(?:webp|jpe?g|png)$/); return m ? m[1] : null;
  }
  function photosPanel() {
    var seen = {}, items = [];
    [].forEach.call(document.querySelectorAll('img[data-orig],img'), function (im) {
      var b = baseOf(im.getAttribute('data-orig') || im.getAttribute('src'));
      if (!b || seen[b] || /^img\/homes\//.test(b) || /^img\/uploads\//.test(b)) return;
      seen[b] = 1; items.push({ base: b, src: E.images[b] ? root + E.images[b] + '-960.webp' : new URL(im.getAttribute('data-orig') || im.getAttribute('src'), location.href).href });
    });
    var grid = h('div', { class: 'grid' });
    items.forEach(function (it) {
      var thumb = h('img', { src: it.src, alt: '' });
      var file = h('input', { type: 'file', accept: 'image/*', style: 'display:none' });
      var box = h('div', {}, h('span', { dir: 'ltr', text: it.base.replace(/^img\//, '') }), E.images[it.base] ? h('span', { class: 'badge', text: tr('changed') }) : null,
        h('button', { class: 'sm', text: tr('change'), onclick: function () { file.click(); } }),
        E.images[it.base] ? h('button', { class: 'sm', text: tr('reset'), onclick: function () {
          api('imgreset', { key: it.base }).then(function (j) { if (!j.ok) return toast(tr('err')); delete E.images[it.base]; window.NX_APPLY_IMAGES(); toast(tr('saved') + ' ✓'); ov.remove(); photosPanel(); }); } }) : null, file);
      file.addEventListener('change', function () {
        var f = file.files[0]; if (!f) return; toast(tr('uploading'));
        Promise.all([blobOf(f, 960), blobOf(f, 1920)]).then(function (b) {
          var fd = new FormData(); fd.append('key', it.base); fd.append('f960', b[0], 'a.webp'); fd.append('f1920', b[1], 'b.webp');
          return api('img', fd, true);
        }).then(function (j) {
          if (!j.ok) return toast(tr('err')); E.images[it.base] = j.base; window.NX_APPLY_IMAGES(); toast(tr('saved') + ' ✓'); ov.remove(); photosPanel();
        }).catch(function () { toast(tr('err')); });
      });
      grid.appendChild(h('div', { class: 'ph' }, thumb, box));
    });
    var ov = overlay([h('h2', { text: tr('photos') }), h('p', { text: tr('tipPhotos') }), grid, h('div', { class: 'row' }, h('button', { text: tr('close'), onclick: function () { ov.remove(); } }))]);
  }

  /* ---------- versions ---------- */
  function versionsPanel() {
    api('versions', undefined).then(function (j) {
      var list = h('div');
      if (!j.ok || !j.versions || !j.versions.length) list.appendChild(h('p', { text: tr('none') }));
      else j.versions.forEach(function (v0) {
        var v = v0.id || v0, m = String(v).match(/^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})/);
        list.appendChild(h('div', { class: 'row' }, h('span', { class: 'grow', dir: 'ltr', text: v0.label || (m ? m[1] + '-' + m[2] + '-' + m[3] + '  ' + m[4] + ':' + m[5] : v) }),
          h('button', { class: 'sm', text: tr('restore'), onclick: function () {
            if (!confirm(tr('restoreSure'))) return;
            api('restore', { id: v }).then(function (r) { if (r.ok) { dirty = 0; location.reload(); } else toast(tr('err')); }); } })));
      });
      var ov = overlay([h('h2', { text: tr('vers') }), list, h('div', { class: 'row' }, h('button', { text: tr('close'), onclick: function () { ov.remove(); } }))]);
    });
  }

  /* ---------- homes ---------- */
  function homesPanel() {
    if (!window.NX_HOMES) { /* only the Homes page loads the list; fetch it so we never start from an empty one */
      var sc = document.createElement('script'); sc.src = root + 'js/homes-data.js?v=' + Date.now();
      sc.onload = function () { if (window.NX_HOMES) homesPanel(); else toast(tr('err')); }; sc.onerror = function () { toast(tr('err')); };
      document.head.appendChild(sc); return;
    }
    var homes = JSON.parse(JSON.stringify(E.homes || window.NX_HOMES || []));
    var ov;
    var thumbOf = function (hm) { var n = (hm.photos || [])[0]; return n ? root + 'img/homes/' + encodeURIComponent(n) + '-800.webp' : ''; };
    function listView() {
      var box = h('div');
      homes.forEach(function (hm, i) {
        var st = h('select', { class: 'f', style: 'width:auto;min-height:34px' });
        ['available', 'reserved', 'sold', 'rented'].forEach(function (s) { st.appendChild(h('option', { value: s, text: tr(s), selected: hm.status === s })); });
        st.addEventListener('change', function () { hm.status = st.value; });
        box.appendChild(h('div', { class: 'home' }, h('img', { src: thumbOf(hm), alt: '' }),
          h('div', { class: 'grow' }, h('b', { text: hm.id }), h('div', { text: ((hm.title && hm.title[LANG]) || (hm.title && hm.title.en) || '').slice(0, 70) })),
          st, h('button', { class: 'sm', text: tr('edit'), onclick: function () { formView(i); } }),
          h('button', { class: 'sm', text: tr('del'), onclick: function () { if (confirm(tr('sure'))) { homes.splice(i, 1); render(); } } })));
      });
      return box;
    }
    function saveAll() {
      api('homes', { homes: homes }).then(function (j) { if (!j.ok) return toast(tr('err')); E.homes = homes; toast(GH ? tr('ghnote') : tr('homesSaved') + ' ✓'); if (!GH) setTimeout(function () { dirty = 0; location.reload(); }, 700); }).catch(function () { toast(tr('err')); });
    }
    function render() {
      var card = ov.firstChild; card.textContent = '';
      [h('h2', { text: tr('homes') }), h('p', { text: tr('editNote') }), listView(),
        h('div', { class: 'row' }, h('button', { text: '+ ' + tr('add'), onclick: function () {
          var n = 100; homes.forEach(function (x) { var m = /(\d+)$/.exec(x.id); if (m) n = Math.max(n, +m[1]); });
          homes.unshift({ id: 'NX-' + (n + 1), status: 'available', deal: 'sale', type: 'apartment', city: 'Madrid', features: [], title: { fa: '', en: '', es: '' }, text: { fa: '', en: '', es: '' }, photos: [], added: new Date().toISOString().slice(0, 10) });
          formView(0); } }),
          h('button', { class: 'pri', text: tr('pubHomes'), onclick: saveAll }), h('button', { text: tr('close'), onclick: function () { ov.remove(); } }))].forEach(function (x) { card.appendChild(x); });
    }
    function formView(i) {
      var hm = homes[i], card = ov.firstChild; card.textContent = '';
      var num = function (k, label) { var inp = h('input', { type: 'number', min: 0, value: hm[k] != null ? hm[k] : '' }); inp.addEventListener('input', function () { if (inp.value === '') delete hm[k]; else hm[k] = +inp.value; }); return h('label', {}, label, inp); };
      var sel = function (k, label, opts) { var s = h('select', { class: 'f' }); opts.forEach(function (o) { s.appendChild(h('option', { value: o, text: tr(o), selected: hm[k] === o })); }); s.addEventListener('change', function () { hm[k] = s.value; }); return h('label', {}, label, s); };
      var txt = function (k, label) { var inp = h('input', { type: 'text', value: hm[k] || '' }); inp.addEventListener('input', function () { hm[k] = inp.value; }); return h('label', {}, label, inp); };
      var flag = function (k, label) { var c = h('input', { type: 'checkbox', checked: !!hm[k] }); c.addEventListener('change', function () { if (c.checked) hm[k] = true; else delete hm[k]; }); return h('label', { class: 'chk' }, c, label); };
      var tri = function (k, label, area) {
        hm[k] = hm[k] || { fa: '', en: '', es: '' };
        var fs = h('fieldset', {}, h('legend', { text: label }));
        [['fa', 'فارسی'], ['en', 'English'], ['es', 'Español']].forEach(function (l) {
          var inp = h(area ? 'textarea' : 'input', area ? { dir: l[0] === 'fa' ? 'rtl' : 'ltr' } : { type: 'text', dir: l[0] === 'fa' ? 'rtl' : 'ltr' });
          inp.value = hm[k][l[0]] || ''; inp.addEventListener('input', function () { hm[k][l[0]] = inp.value; }); fs.appendChild(h('label', {}, l[1], inp));
        });
        return fs;
      };
      var feats = h('div', { class: 'row' });
      Object.keys(FEATS).forEach(function (f) {
        var c = h('input', { type: 'checkbox', checked: (hm.features || []).indexOf(f) >= 0 });
        c.addEventListener('change', function () { hm.features = hm.features || []; var ix = hm.features.indexOf(f); if (c.checked && ix < 0) hm.features.push(f); if (!c.checked && ix >= 0) hm.features.splice(ix, 1); });
        feats.appendChild(h('label', { class: 'chk' }, c, FEATS[f][uiLang === 'fa' ? 0 : 1]));
      });
      var phBox = h('div', { class: 'grid' });
      function drawPhotos() {
        phBox.textContent = '';
        (hm.photos = hm.photos || []).forEach(function (n, k) {
          phBox.appendChild(h('div', { class: 'ph' }, h('img', { src: root + 'img/homes/' + encodeURIComponent(n) + '-800.webp', alt: '' }),
            h('div', {}, k === 0 ? h('span', { class: 'badge', text: tr('cover') }) : h('button', { class: 'sm', text: '↑ ' + tr('cover'), onclick: function () { hm.photos.unshift(hm.photos.splice(k, 1)[0]); drawPhotos(); } }),
              h('button', { class: 'sm', text: tr('del'), onclick: function () { hm.photos.splice(k, 1); drawPhotos(); } }))));
        });
      }
      drawPhotos();
      var file = h('input', { type: 'file', accept: 'image/*', multiple: true, style: 'display:none' });
      file.addEventListener('change', function () {
        var fl = [].slice.call(file.files); toast(tr('uploading'));
        fl.reduce(function (p, f) {
          return p.then(function () {
            return Promise.all([blobOf(f, 800, .8), blobOf(f, 1600, .82)]).then(function (b) {
              var fd = new FormData(); fd.append('f800', b[0], 'a.webp'); fd.append('f1600', b[1], 'b.webp'); return api('homephoto', fd, true);
            }).then(function (j) { if (j.ok) { hm.photos.push(j.name); drawPhotos(); } else toast(tr('err')); });
          });
        }, Promise.resolve()).catch(function () { toast(tr('err')); });
      });
      [h('h2', { text: hm.id }),
        h('div', { class: 'row' }, txt('id', tr('id')), sel('status', tr('status'), ['available', 'reserved', 'sold', 'rented']), sel('deal', tr('deal'), ['sale', 'rent']), sel('type', tr('type'), ['apartment', 'house'])),
        h('div', { class: 'row' }, num('price', tr('price')), num('beds', tr('beds')), num('bedsTo', tr('bedsTo')), num('baths', tr('baths')), num('size', tr('size')), txt('city', tr('city'))),
        h('div', { class: 'row' }, flag('priceFrom', tr('from')), flag('priceAbout', tr('about')), h('span', { class: 'cnt', style: 'color:#6b5a4c', text: tr('onReq') })),
        tri('title', tr('ttl'), false), tri('text', tr('txt'), true),
        h('fieldset', {}, h('legend', { text: tr('feat') }), feats),
        h('fieldset', {}, h('legend', { text: tr('ph') }), phBox, h('div', { class: 'row' }, h('button', { text: '+ ' + tr('addPh'), onclick: function () { file.click(); } }), file)),
        h('div', { class: 'row' }, h('button', { class: 'pri', text: tr('done'), onclick: function () { hm.id = String(hm.id || '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 20) || ('NX-' + Date.now() % 10000); render(); } }))
      ].forEach(function (x) { card.appendChild(x); });
    }
    ov = overlay([]); render();
  }

  /* GitHub Pages serves edits.js with a delay; read the latest from the repo so she always sees her own newest changes */
  function syncFresh() {
    if (!GH) return;
    ghEdits().then(function (d) {
      E.text = d.text; E.images = d.images; E.homes = d.homes;
      var t = d.text[LANG] || {};
      Object.keys(t).forEach(function (k) { [].forEach.call(document.querySelectorAll('[data-i18n="' + k + '"]'), function (el) { if (el !== cur) el.textContent = t[k]; }); });
      if (window.NX_APPLY_IMAGES) window.NX_APPLY_IMAGES();
    }).catch(function () {});
  }

  /* ---------- go ---------- */
  api('status', undefined).then(function (j) {
    csrf = j.csrf || '';
    if (j.auth) { start(); syncFresh(); } else login();
  }).catch(function () { toast(tr('err')); });
})();
