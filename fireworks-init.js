// fireworks-init.js — robust start/stop (no surprise 10s stop)
(function () {
  function getCtor() {
    const g = window;
    return g.Fireworks?.Fireworks || g.fireworks?.Fireworks || g.Fireworks || g.fireworks;
  }

  let fw = null;
  let ready = false;
  let queued = [];
  let stopTimer = null;  // <— track any previous auto-stop

  // Start: ms=0 => run forever. Clears any previous stop timer.
  window.startFireworks = function (ms = 0) {
    if (!ready) { queued.push(ms); return; }
    if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; } // <—
    fw.start();
    if (ms > 0) {
      stopTimer = setTimeout(() => { fw.stop(); stopTimer = null; }, ms);
    }
  };

  window.stopFireworks = function () {
    if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
    if (ready) fw.stop();
  };

  function setup() {
    const layer = document.getElementById('fireworks-layer');
    const Ctor = getCtor();
    if (!layer || !Ctor) { console.error('[fireworks] layer/CDN missing'); return; }

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
      lineWidth: { explosion: { min: 1.0, max: 4.0 }, trace: { min: 0.10, max: 1.77 } },
      lineStyle: 'round',
      mouse: { click: false, move: false, max: 4 },
      sound: { enabled: false }
    });

    ready = true;
    while (queued.length) window.startFireworks(queued.shift());
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
