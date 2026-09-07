/* Confeti ligero en canvas — sin dependencias. */
(function () {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const COLORS = ["#FF6B4A", "#FF4D8D", "#D7263D", "#FFA552", "#FFD8CC"];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let pieces = [];
  let raf = null;
  let dpr = 1;
  let ultimo = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  function spawn(count, originY) {
    const w = window.innerWidth;
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * w,
        y: originY + Math.random() * 60 - 120,
        w: 5 + Math.random() * 7,
        h: 8 + Math.random() * 10,
        vx: (Math.random() - 0.5) * 2.4,
        vy: 3.4 + Math.random() * 4.2,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.22,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        life: 1
      });
    }
  }

  function tick(ahora) {
    // Avanzamos por tiempo real, no por fotogramas: así el confeti dura lo
    // mismo en un móvil de 60 Hz que en uno de 120 o en uno que va justo.
    const paso = ultimo ? Math.min((ahora - ultimo) / 16.67, 3) : 1;
    ultimo = ahora;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const h = window.innerHeight;

    pieces = pieces.filter((p) => p.life > 0 && p.y < h + 60);
    for (const p of pieces) {
      p.x += p.vx * paso;
      p.y += p.vy * paso;
      p.vy += 0.065 * paso;
      p.vx *= Math.pow(0.995, paso);
      p.rot += p.vr * paso;
      if (p.y > h * 0.6) p.life -= 0.022 * paso;

      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (pieces.length) {
      raf = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      raf = null;
      ultimo = 0;
    }
  }

  /* API pública: confetti.burst() / confetti.rain() */
  window.confetti = {
    burst(amount = 70) {
      if (reduced) return;
      spawn(amount, 0);
      if (!raf) raf = requestAnimationFrame(tick);
    },
    rain(seconds = 3) {
      if (reduced) return;
      const end = Date.now() + seconds * 1000;
      (function loop() {
        spawn(18, 0);
        if (!raf) raf = requestAnimationFrame(tick);
        if (Date.now() < end) setTimeout(loop, 220);
      })();
    }
  };
})();
