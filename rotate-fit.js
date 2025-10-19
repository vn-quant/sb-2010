// rotate-fit.js — rotate/scale the whole page when in portrait
(function () {
  const root = document.body;         // rotate the body, not #stage
  const hint = document.getElementById('orient-hint');

  function isPortrait() {
    return window.matchMedia('(orientation: portrait)').matches ||
           window.innerHeight >= window.innerWidth;
  }

  function fit() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Ensure the body acts like a transform container
    root.style.position = 'fixed';
    root.style.inset = '0';
    root.style.transformOrigin = '50% 50%';

    if (isPortrait()) {
      // After 90° rotation, logical width/height swap
      const targetW = vh;
      const targetH = vw;
      const scale = Math.min(vw / targetW, vh / targetH);

      root.style.transform = `rotate(90deg) scale(${scale})`;

      // Center it
      const tx = (vw - targetW * scale) / 2;
      const ty = (vh - targetH * scale) / 2;
      root.style.left = `${tx}px`;
      root.style.top  = `${ty}px`;
      root.style.width  = `${targetW}px`;
      root.style.height = `${targetH}px`;

      if (hint) hint.style.display = 'flex';
      clearTimeout(fit._hide);
      fit._hide = setTimeout(() => { if (hint) hint.style.display = 'none'; }, 700);
    } else {
      root.style.transform = 'none';
      root.style.left = '0px';
      root.style.top  = '0px';
      root.style.width  = '100vw';
      root.style.height = '100vh';
      if (hint) hint.style.display = 'none';
    }

    // Let canvases recompute sizes
    window.dispatchEvent(new Event('resize'));
  }

  let t;
  function onChange(){ clearTimeout(t); t = setTimeout(fit, 80); }

  window.addEventListener('resize', onChange);
  window.addEventListener('orientationchange', onChange);
  document.addEventListener('visibilitychange', onChange);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fit);
  } else {
    fit();
  }
})();
