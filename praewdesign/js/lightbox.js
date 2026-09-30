/* ============================================
   LIGHTBOX — click/tap any .pj-zoom-btn to enlarge its
   image in #pj-lightbox. Self-contained; pages that don't
   include the #pj-lightbox markup simply don't use it.
   ============================================ */
(function () {
  var DOC = document;

  function qs(sel, ctx) { return (ctx || DOC).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || DOC).querySelectorAll(sel)); }

  var lightbox = qs('#pj-lightbox');
  if (!lightbox) return;
  var img = qs('.pj-lightbox-img', lightbox);
  var closeBtn = qs('.pj-lightbox-close', lightbox);
  var lastTrigger = null;

  function open(trigger) {
    var sourceImg = qs('img', trigger);
    if (!sourceImg) return;
    lastTrigger = trigger;
    img.src = sourceImg.currentSrc || sourceImg.src;
    img.alt = sourceImg.alt || '';
    lightbox.hidden = false;
    closeBtn.focus();
    DOC.addEventListener('keydown', onKeydown, true);
  }

  function close() {
    lightbox.hidden = true;
    img.src = '';
    DOC.removeEventListener('keydown', onKeydown, true);
    if (lastTrigger) lastTrigger.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'Tab') {
      /* only the close button is focusable inside the dialog */
      e.preventDefault();
      closeBtn.focus();
    }
  }

  qsa('.pj-zoom-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { open(btn); });
  });
  qsa('[data-pj-lightbox-close]', lightbox).forEach(function (el) {
    el.addEventListener('click', close);
  });
})();
