function initMatrixRain(canvasId = "matrix") {
  // Settings inside JS
  const settings = {
    fontSize: 34,
    changeIntervalMs: 200,
    mode: "message", // "random" | "message"
    message: "HAPPY BIRTHDAY",
    charset: "HAPPY BIRTHDAY",
    speedJitter: 0.2
  };

  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  let columns, drops, rafId;

  function pickChar(d) {
    if (settings.mode === "message") {
      d.msgIdx = (d.msgIdx + 1) % settings.message.length;
      return settings.message[d.msgIdx];
    }
    return settings.charset.charAt(Math.floor(Math.random() * settings.charset.length));
  }

  function initColumn() {
    return {
      y: Math.floor(Math.random() * 20),
      char: settings.mode === "message"
        ? settings.message[Math.floor(Math.random() * settings.message.length)]
        : settings.charset.charAt(Math.floor(Math.random() * settings.charset.length)),
      lastChange: performance.now(),
      speed: 1 + (Math.random() * 2 - 1) * settings.speedJitter,
      msgIdx: 0
    };
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / settings.fontSize);
    drops = Array.from({ length: columns }, () => initColumn());
  }

  function draw(time) {
    ctx.fillStyle = "rgba(0,0,0,0.05)"; // trail fade
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "PINK"; // PINK
    ctx.font = settings.fontSize + "px monospace";


    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];

      if (time - d.lastChange >= settings.changeIntervalMs) {
        d.char = pickChar(d);
        d.lastChange = time;
      }

      ctx.fillText(d.char, i * settings.fontSize, d.y * settings.fontSize);

      if (d.y * settings.fontSize > canvas.height && Math.random() > 0.975) {
        d.y = 0;
        d.char = pickChar(d);
        d.lastChange = time;
      }

      d.y += d.speed;
    }

    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (!rafId) rafId = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();

  return { start, resize, settings };
}

// Start automatically
window.addEventListener("DOMContentLoaded", () => {
  const rain = initMatrixRain("matrix");
  rain.start();
});
