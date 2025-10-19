// blackout.js
(function () {
  const el = document.getElementById('blackout');

  function showBlackout() {
    return new Promise((resolve) => {
      // ensure starting state
      el.classList.remove('is-visible');
      // let the browser paint once before adding the class (for transition to fire)
      requestAnimationFrame(() => {
        el.classList.add('is-visible');
        // resolve after the CSS transition ends (fallback 800ms)
        const onEnd = () => { el.removeEventListener('transitionend', onEnd); resolve(); };
        el.addEventListener('transitionend', onEnd);
        setTimeout(onEnd, 800); // safety
      });
    });
  }

  // Public: wait N ms, then fade to black
  window.triggerBlackout = async function (delayMs = 2000) {
    if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
    await showBlackout();
  };
})();
