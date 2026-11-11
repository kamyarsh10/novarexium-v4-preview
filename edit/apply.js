/* Novarexium: applies the owner's saved edits (edit/data/edits.js) on top of the built pages,
   and opens the editor when the address ends in ?edit. Loaded before js/site.js. */
(function () {
  'use strict';
  var E = window.NX_EDITS || {};
  var root = document.documentElement.getAttribute('data-root') || '';

  /* Text: merge into the site dictionary before site.js reads it */
  var D = window.NX_TEXT, T = E.text || {};
  if (D) for (var l in T) { D[l] = D[l] || {}; for (var k in T[l]) D[l][k] = T[l][k]; }

  /* Photos: an uploaded photo replaces every <img> that shows the same original photo */
  function baseOf(src) {
    if (!src) return null;
    var s = src.split('?')[0];
    if (root && s.indexOf(root) === 0) s = s.slice(root.length);
    var m = s.match(/^(.*?)-(\d+)\.(?:webp|jpe?g|png)$/);
    return m ? { base: m[1], w: +m[2] } : null;
  }
  function images() {
    var I = E.images || {};
    var list = document.querySelectorAll('img');
    for (var i = 0; i < list.length; i++) {
      var im = list[i];
      if (!im.hasAttribute('data-orig')) im.setAttribute('data-orig', im.getAttribute('src') || '');
      var o = baseOf(im.getAttribute('data-orig'));
      if (!o) continue;
      var nb = I[o.base];
      if (nb) {
        im.src = root + nb + (o.w <= 1000 ? '-960.webp' : '-1920.webp');
        if (im.hasAttribute('srcset')) im.srcset = root + nb + '-960.webp 960w, ' + root + nb + '-1920.webp 1920w';
      } else if (im.getAttribute('src') !== im.getAttribute('data-orig')) {
        im.src = im.getAttribute('data-orig');
      }
    }
  }
  window.NX_EDITS = E;
  window.NX_APPLY_IMAGES = images;
  images();

  /* Homes: her list replaces the one from js/homes-data.js (which loads later) */
  if (E.homes) {
    var cur;
    Object.defineProperty(window, 'NX_HOMES', {
      configurable: true,
      get: function () { return E.homes; },
      set: function (v) { cur = v; }
    });
  }

  /* Editor */
  if (/[?&]edit(=|&|$)/.test(location.search)) {
    var s = document.createElement('script');
    s.src = root + 'edit/edit.js?v=' + Date.now();
    document.head.appendChild(s);
  }
})();
