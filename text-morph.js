// ===== Settings (edit here) =====
const MORPH_SETTINGS = {
  sequence: ["3", "2", "1", "HAPPY", "BIRTHDAY", "10/02","FROM \nQUANG.VN3"],
  dwellMs: 900,
  morphMs: 1000,
  finalHoldMs: 4000,
  dotStep: 5,
  dotRadius: 2,
  color: "#F3A8C6",
  glow: true,
  glowCSS: "0 0 6px #F3A8C6, 0 0 14px #F3A8C6",
  fontWeight: "800",
  fontFamily: "'Montserrat', system-ui, Arial, sans-serif",
  fontPxDefault: 180,
  fontPxPerIndex: { 0: 320, 1: 320, 2: 320, 3: 220, 4: 170, 5: 220, 6: 170 },
  lineGap: 0.94,
  centerBias: true,
  fadeOutAtEnd: false
};
// =================================

(function () {
  const canvas = document.getElementById("morph");
  const ctx = canvas.getContext("2d");
  const off = document.createElement("canvas");
  const offCtx = off.getContext("2d");

  function resize() {
    canvas.width = innerWidth; canvas.height = innerHeight;
    off.width = innerWidth;    off.height = innerHeight;
  }
  addEventListener("resize", resize, { passive: true });
  resize();

  const getPx = (i) => MORPH_SETTINGS.fontPxPerIndex[i] ?? MORPH_SETTINGS.fontPxDefault;

  function pointsForText(text, px) {
    const lines = String(text).split("\n");
    offCtx.clearRect(0, 0, off.width, off.height);
    offCtx.fillStyle = "#fff";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    const totalH = px * MORPH_SETTINGS.lineGap * (lines.length - 1) + px;
    const startY = off.height / 2 - totalH / 2 + px * 0.1;
    offCtx.font = `${MORPH_SETTINGS.fontWeight} ${px}px ${MORPH_SETTINGS.fontFamily}`;
    lines.forEach((ln, i) => {
      const y = startY + i * px * MORPH_SETTINGS.lineGap;
      offCtx.fillText(ln, off.width / 2, y);
    });
    const step = MORPH_SETTINGS.dotStep;
    const img = offCtx.getImageData(0, 0, off.width, off.height).data;
    const pts = [];
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        const a = img[(y * off.width + x) * 4 + 3];
        if (a > 128) pts.push({ x, y });
      }
    }
    return pts;
  }

  const particles = [];
  function makeParticle() {
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const r = Math.min(cx, cy) * 0.25;
    const a = Math.random() * Math.PI * 2;
    const rr = MORPH_SETTINGS.centerBias ? Math.random() * r : Math.random() * Math.max(cx, cy);
    return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr, tx: cx, ty: cy, px: cx, py: cy, t0: 0, dur: 1 };
  }
  function ensureParticleCount(n) {
    while (particles.length < n) particles.push(makeParticle());
    while (particles.length > n) particles.pop();
  }
  const ease = t => (t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3));
  function assignTargets(points, now, duration) {
    ensureParticleCount(points.length);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i], tgt = points[i % points.length];
      p.px = p.x; p.py = p.y; p.tx = tgt.x; p.ty = tgt.y; p.t0 = now; p.dur = duration;
    }
  }

  const seq = MORPH_SETTINGS.sequence;
  let idx = 0, phase = "dwell", phaseStart = performance.now();
  let didFireDone = false; // <— NEW: ensure we trigger the next scene only once

  let currentPoints = pointsForText(seq[0], getPx(0));
  let nextPoints = seq.length > 1 ? pointsForText(seq[1], getPx(1)) : currentPoints;

  assignTargets(currentPoints, phaseStart, 1);

  function step(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = MORPH_SETTINGS.color;
    if (MORPH_SETTINGS.glow) { ctx.shadowColor = MORPH_SETTINGS.color; ctx.shadowBlur = 12; }

    const r = MORPH_SETTINGS.dotRadius;
    for (const p of particles) {
      const t = ease((now - p.t0) / p.dur);
      p.x = p.px + (p.tx - p.px) * t;
      p.y = p.py + (p.ty - p.py) * t;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
    }
    if (MORPH_SETTINGS.glow) ctx.shadowBlur = 0;

    if (phase === "dwell" && now - phaseStart >= MORPH_SETTINGS.dwellMs) {
      phase = "morph"; phaseStart = now; assignTargets(nextPoints, now, MORPH_SETTINGS.morphMs);
    } else if (phase === "morph" && now - phaseStart >= MORPH_SETTINGS.morphMs) {
      idx++;
      if (idx >= seq.length) {
        if (MORPH_SETTINGS.finalHoldMs > 0 && MORPH_SETTINGS.fadeOutAtEnd) {
          setTimeout(() => fadeOut(), MORPH_SETTINGS.finalHoldMs);
        }
        phase = "done";

        // ===== NEW: trigger blackout (2s delay) then show envelope =====
        if (!didFireDone) {
          didFireDone = true;
          (async () => {
            // wait 1s, fade to black, then show the envelope
            if (window.triggerBlackout) {
              await window.triggerBlackout(1000);
            }
            if (window.showEnvelope3D) {
              window.showEnvelope3D();
              window.startFireworks?.(0); 
            }
          })();
        }
        // ================================================================
      } else {
        currentPoints = nextPoints;
        const nxtIdx = idx + 1;
        nextPoints = seq[nxtIdx] ? pointsForText(seq[nxtIdx], getPx(nxtIdx)) : currentPoints;
        phase = "dwell"; phaseStart = now;
      }
    }

    if (phase !== "done") requestAnimationFrame(step);
  }

  function fadeOut() {
    let alpha = 1;
    (function f() {
      alpha -= 0.02; canvas.style.opacity = String(Math.max(0, alpha));
      if (alpha > 0) requestAnimationFrame(f);
    })();
  }

  requestAnimationFrame(step);
})();

