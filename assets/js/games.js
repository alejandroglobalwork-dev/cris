/* =====================================================================
   Mini-juegos. Cada uno se monta en un contenedor y llama a onWin().
   Ninguno se puede perder: son juegos para regalar, no para competir.
   ===================================================================== */
(function () {
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* ---------------------------------------------------------------
     1. RASCA Y DESCUBRE
     --------------------------------------------------------------- */
  function scratch(stage, cfg, onWin) {
    const wrap = el("div", "scratch");
    wrap.appendChild(el("div", "scratch__under",
      `<div class="emoji">${cfg.icono || "🎁"}</div>
       <div class="big">${cfg.titulo}</div>`));

    const canvas = el("canvas");
    wrap.appendChild(canvas);
    stage.appendChild(wrap);

    const note = el("p", "quiz__note", "Pasa el dedo (o el ratón) por encima.");
    stage.appendChild(note);

    const ctx = canvas.getContext("2d");
    let done = false;

    function paint() {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      g.addColorStop(0, "#F3C9B6");
      g.addColorStop(0.5, "#E9A9A0");
      g.addColorStop(1, "#D99BA8");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.font = "600 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("R A S C A   A Q U Í", rect.width / 2, rect.height / 2);

      ctx.globalCompositeOperation = "destination-out";
    }
    // Espera al layout del modal antes de medir
    requestAnimationFrame(paint);

    function pos(e) {
      const r = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    }

    function erase(e) {
      if (done) return;
      const { x, y } = pos(e);
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();
    }

    function cleared() {
      const w = canvas.width, h = canvas.height;
      const data = ctx.getImageData(0, 0, w, h).data;
      let clear = 0, total = 0;
      for (let i = 3; i < data.length; i += 4 * 40) {   // muestreo
        total++;
        if (data[i] < 40) clear++;
      }
      return total ? clear / total : 0;
    }

    function check() {
      if (done || cleared() < 0.48) return;
      done = true;
      canvas.classList.add("is-done");
      note.textContent = "";
      setTimeout(onWin, 600);
    }

    let drawing = false;
    const down = (e) => { drawing = true; erase(e); };
    const move = (e) => { if (!drawing) return; e.preventDefault(); erase(e); };
    const up = () => { if (!drawing) return; drawing = false; check(); };

    canvas.addEventListener("mousedown", down);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    canvas.addEventListener("touchstart", down, { passive: true });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", up);

    // Atajo por si el navegador se resiste: doble clic revela
    canvas.addEventListener("dblclick", () => {
      if (done) return;
      done = true;
      canvas.classList.add("is-done");
      setTimeout(onWin, 600);
    });
  }

  /* ---------------------------------------------------------------
     2. QUIZ "¿CUÁNTO NOS CONOCEMOS?"
     --------------------------------------------------------------- */
  function quiz(stage, cfg, onWin) {
    const preguntas = cfg.preguntas || [];
    const box = el("div", "quiz");
    const dots = el("div", "quiz__dots",
      preguntas.map(() => "<span></span>").join(""));
    const q = el("p", "quiz__q");
    const opts = el("div", "quiz__opts");
    const note = el("p", "quiz__note", "");
    box.append(dots, q, opts, note);
    stage.appendChild(box);

    let i = 0;
    let locked = false;

    function render() {
      const item = preguntas[i];
      q.textContent = item.pregunta;
      opts.innerHTML = "";
      note.textContent = "";
      locked = false;

      item.opciones.forEach((texto, idx) => {
        const b = el("button", "quiz__opt", texto);
        b.addEventListener("click", () => choose(idx, b, item));
        opts.appendChild(b);
      });

      [...dots.children].forEach((d, k) => d.classList.toggle("on", k <= i));
    }

    function choose(idx, btn, item) {
      if (locked) return;
      const ok = idx === item.correcta;

      if (!ok) {
        btn.classList.add("is-off");
        btn.disabled = true;
        note.textContent = "Casi… prueba otra 💭";
        return;
      }

      locked = true;
      btn.classList.add("is-ok");
      [...opts.children].forEach((b) => { if (b !== btn) b.classList.add("is-off"); });
      note.textContent = i === preguntas.length - 1 ? "Perfecto ✨" : "¡Correcto!";

      setTimeout(() => {
        i++;
        if (i < preguntas.length) render();
        else onWin();
      }, 850);
    }

    if (!preguntas.length) { onWin(); return; }
    render();
  }

  /* ---------------------------------------------------------------
     3. RULETA DEL DESTINO (siempre cae en el premio)
     --------------------------------------------------------------- */
  function ruleta(stage, cfg, onWin) {
    const casillas = cfg.casillas || [];
    const n = casillas.length;
    const wrap = el("div", "wheel-wrap");
    const canvas = el("canvas");
    canvas.id = "wheel";
    wrap.appendChild(canvas);
    stage.appendChild(wrap);

    const note = el("p", "quiz__note", "");
    const btn = el("button", "btn btn--primary", "<span>Girar</span>");
    stage.append(btn, note);

    const SIZE = 460;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const COLORS = ["#FFA552", "#FF6B4A", "#FF4D8D", "#D7263D"];
    const seg = (Math.PI * 2) / n;
    const R = SIZE / 2;

    casillas.forEach((c, k) => {
      const start = k * seg - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(R, R);
      ctx.arc(R, R, R - 4, start, start + seg);
      ctx.closePath();
      ctx.fillStyle = COLORS[k % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.75)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Texto: lo volteamos en la mitad izquierda para que nunca salga del revés
      const mid = start + seg / 2;
      ctx.save();
      ctx.translate(R, R);
      ctx.rotate(mid);
      ctx.fillStyle = "#fff";
      ctx.font = "600 19px Inter, sans-serif";
      if (Math.cos(mid) < 0) {
        ctx.rotate(Math.PI);
        ctx.textAlign = "left";
        ctx.fillText(c.texto, -(R - 26), 7);
      } else {
        ctx.textAlign = "right";
        ctx.fillText(c.texto, R - 26, 7);
      }
      ctx.restore();
    });

    // Centro
    ctx.beginPath();
    ctx.arc(R, R, 34, 0, Math.PI * 2);
    ctx.fillStyle = "#FFF7F3";
    ctx.fill();
    ctx.strokeStyle = "rgba(215,38,61,.25)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#D7263D";
    ctx.font = "22px serif";
    ctx.textAlign = "center";
    ctx.fillText("♥", R, R + 8);

    let spun = false;
    btn.addEventListener("click", () => {
      if (spun) return;
      spun = true;
      btn.disabled = true;
      note.textContent = "Girando…";

      // Elegimos una casilla premiada al azar y calculamos el ángulo exacto
      const premios = casillas.map((c, k) => (c.premio ? k : -1)).filter((k) => k >= 0);
      const target = premios.length
        ? premios[(Math.random() * premios.length) | 0]
        : 0;

      const centerDeg = (target + 0.5) * (360 / n);   // centro de la casilla
      const jitter = (Math.random() - 0.5) * (360 / n) * 0.5;
      const final = 360 * 6 + (360 - centerDeg) + jitter;

      canvas.style.transform = `rotate(${final}deg)`;

      setTimeout(() => {
        note.textContent = `¡${casillas[target].texto}! 🎉`;
        if (window.confetti) window.confetti.burst(60);
        setTimeout(onWin, 900);
      }, 5500);
    });
  }

  window.GAMES = { scratch, quiz, ruleta };
})();
