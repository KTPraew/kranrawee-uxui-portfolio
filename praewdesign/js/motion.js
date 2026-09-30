/* ============================================
   MOTION ENGINE — generic reveal/typing helpers shared
   by every page. Page-specific wiring (which elements to
   observe, in what order, with what delays) stays inline
   on each page and calls into window.PJMotion.
   ============================================ */
window.PJMotion = (function () {
  var DOC = document;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function qs(sel, ctx) { return (ctx || DOC).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || DOC).querySelectorAll(sel)); }
  function reveal(el) { if (el) el.classList.add('is-visible'); }

  /* handwrite elements: clean up clip-path entirely once the transition
     finishes, so no combination of stroke width / descender can ever
     be cut off by a lingering inset(...) box */
  function revealHandwrite(el) {
    if (!el) return;
    reveal(el);
    el.addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'clip-path') {
        el.style.clipPath = 'none';
        el.removeEventListener('transitionend', handler);
      }
    });
  }

  /* ---------- typing (anim-type) ---------- */
  function setupTyping(el, charDelay) {
    var text = el.textContent;
    var persistCursor = el.dataset.cursorPersist === 'true';
    el.textContent = '';
    el.classList.add('anim-type-wrap');
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }

    var sr = DOC.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = text;

    var spacer = DOC.createElement('span');
    spacer.className = 'anim-type-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    spacer.textContent = text;

    var visual = DOC.createElement('span');
    visual.className = 'anim-type-visual';
    visual.setAttribute('aria-hidden', 'true');

    var textNode = DOC.createTextNode('');
    var cursor = DOC.createElement('span');
    cursor.className = 'anim-type-cursor';

    visual.appendChild(textNode);
    visual.appendChild(cursor);

    el.appendChild(sr);
    el.appendChild(spacer);
    el.appendChild(visual);

    return { text: text, textNode: textNode, cursor: cursor, charDelay: charDelay, played: false, persistCursor: persistCursor };
  }

  function playTyping(state) {
    if (!state || state.played) return;
    state.played = true;
    state.cursor.classList.add('typing');
    var i = 0;
    function step() {
      i++;
      state.textNode.data = state.text.slice(0, i);
      if (i < state.text.length) {
        setTimeout(step, state.charDelay);
      } else if (!state.persistCursor) {
        state.cursor.classList.remove('typing');
        requestAnimationFrame(function () {
          state.cursor.classList.add('done');
        });
      }
      /* persistCursor: stay exactly as-is (opacity 1 from the 'typing'
         class already added above) — no fade, no removal */
    }
    setTimeout(step, state.charDelay);
  }

  var mobileScale = (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) ? 0.8 : 1;
  function ms(v) { return v * mobileScale; }

  return {
    qs: qs,
    qsa: qsa,
    reveal: reveal,
    revealHandwrite: revealHandwrite,
    setupTyping: setupTyping,
    playTyping: playTyping,
    ms: ms,
    reduceMotion: reduceMotion
  };
})();
