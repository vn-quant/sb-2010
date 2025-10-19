// fireworks-init.js — start fireworks together with the envelope (after morph)
(function () {
  function getCtor() {
    const g = window;
    return (
      g.Fireworks?.Fireworks ||
      g.fireworks?.Fireworks ||
      g.Fireworks ||
      g.fireworks
    );
  }

  let fw = null;
  let ready = false;
  const queued = []; // calls to startFireworks made before ready

  // Public API (works even before init)
  window.startFireworks = function (ms = 10000) {
    if (!ready) { queued.push(ms); return; }
    fw.start();
    if (ms > 0) setTimeout(() => fw.stop(), ms);
  };
  window.stopFireworks = function () {
    if (ready) fw.stop();
  };

  function setup() {
    const layer = document.getElementById('fireworks-layer');
    const Ctor  = getCtor();
    if (!layer || !Ctor) {
      console.error('[fireworks] Missing #fireworks-layer or CDN not loaded.');
      return;
    }

    fw = new Ctor(layer, {
      autoresize: true,
      hue: { min: 0, max: 360 },
      rocketsPoint: { min: 20, max: 74 },
      opacity: 0.5,
      acceleration: 1.10,
      friction: 0.99,
      gravity: 1.41,
      brightness: { min: 50, max: 100 },
      decay: { min: 0.001, max: 0.05 },
      delay: { min: 30, max: 40 },
      intensity: 45.25,
      flickering: 35.87,
      explosion: 7,
      particles: 60,
      traceLength: 3,
      traceSpeed: 17,
      lineWidth: {
        explosion: { min: 1.0, max: 4.0 },
        trace: { min: 0.10, max: 1.77 }
      },
      lineStyle: 'round',
      mouse: { click: false, move: false, max: 4 },
      sound: { enabled: false }
    });

    ready = true;
    // flush any early calls
    while (queued.length) {
      const ms = queued.shift();
      window.startFireworks(ms);
    }
  }

  // init after DOM is ready (CDN is already before this file in HTML)
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
