// rotate-fit.js — rotates the whole stage in portrait and scales to fit
(function () {
  const stage = document.getElementById('stage');
  const hint = document.getElementById('orient-hint');

  function isPortrait() {
    // Fallback-safe check
    return window.matchMedia('(orientation: portrait)').matches ||
           window.innerHeight >= window.innerWidth;
  }

  function fit() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // We want a "landscape canvas" feel everywhere.
    // In portrait: rotate 90deg and scale to fit within the portrait bounds.
    if (isPortrait()) {
      // After rotation, stage width/height swap.
      // We need a scale so that landscape (width=vh, height=vw) fits inside (vw x vh)
      const targetW = vh; // because rotated 90deg
      const targetH = vw;
      const scale = Math.min(vw / targetW, vh / targetH);

      stage.style.transform = `rotate(90deg) scale(${scale})`;
      // center after transform
      const tx = (vw - targetW * scale) / 2;
      const ty = (vh - targetH * scale) / 2;
      stage.style.left = `${tx}px`;
      stage.style.top  = `${ty}px`;
      stage.style.width  = `${targetW}px`;
      stage.style.height = `${targetH}px`;

      // brief hint on first rotate
      if (hint) hint.style.display = 'flex';
      clearTimeout(fit._hide);
      fit._hide = setTimeout(() => { if (hint) hint.style.display = 'none'; }, 700);
    } else {
      // In landscape: no rotation, stage fills viewport.
      stage.style.transform = 'none';
      stage.style.left = '0px';
      stage.style.top  = '0px';
      stage.style.width  = '100vw';
      stage.style.height = '100vh';
      if (hint) hint.style.display = 'none';
    }

    // Notify any canvas resizers (your scripts already listen to resize).
    window.dispatchEvent(new Event('resize'));
  }

  // iOS sometimes delays orientation; use a small debounce
  let t;
  function onChange() { clearTimeout(t); t = setTimeout(fit, 80); }

  window.addEventListener('resize', onChange);
  window.addEventListener('orientationchange', onChange);
  document.addEventListener('visibilitychange', onChange);

  // Kick once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fit);
  } else {
    fit();
  }
})();
