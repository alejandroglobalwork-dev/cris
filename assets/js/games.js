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
     1. RASCA Y GANA (estilo cartilla de lotería)
     Hay que descubrir N veces el número de la suerte. Siempre están
     todos en la cartilla, así que rascándola entera siempre se gana.
     --------------------------------------------------------------- */
  function scratch(stage, cfg, onWin) {
    const suerte    = cfg.numeroSuerte != null ? cfg.numeroSuerte : 7;
    const necesarios = cfg.necesarios || 3;
    const total      = Math.max(cfg.casillas || 6, necesarios);

    /* Números: los de la suerte + relleno distinto, todo barajado */
    const relleno = [1, 2, 3, 4, 5, 6, 8, 9]
      .filter((n) => n !== suerte)
      .sort(() => Math.random() - 0.5)
      .slice(0, total - necesarios);
    const numeros = Array(necesarios).fill(suerte)
      .concat(relleno)
      .sort(() => Math.random() - 0.5);

    const ticket = el("div", "ticket");
    ticket.appendChild(el("p", "ticket__head",
      `Encuentra <strong>${necesarios} números ${suerte}</strong>`));

    const grid = el("div", "ticket__grid");
    numeros.forEach((n) => {
      const cell = el("div", "ticket__cell");
      cell.dataset.num = n;
      cell.appendChild(el("span", "ticket__num", String(n)));
      cell.appendChild(el("canvas"));
      grid.appendChild(cell);
    });
    ticket.appendChild(grid);

    const marcador = el("p", "ticket__score", `0 de ${necesarios}`);
    ticket.appendChild(marcador);
    stage.appendChild(ticket);

    const nota = el("p", "quiz__note", "Rasca con el dedo (o el ratón).");
    stage.appendChild(nota);

    /* ---- Pintar la capa plateada de cada casilla ---- */
    const capas = [...grid.querySelectorAll("canvas")];

    function pintar() {
      capas.forEach((canvas) => {
        if (canvas.dataset.hecho) return;
        const r = canvas.parentElement.getBoundingClientRect();
        if (!r.width) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = r.width * dpr;
        canvas.height = r.height * dpr;
        const c = canvas.getContext("2d");
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        const g = c.createLinearGradient(0, 0, r.width, r.height);
        g.addColorStop(0, "#F6D3BE");
        g.addColorStop(0.5, "#E7A79C");
        g.addColorStop(1, "#DC9BAB");
        c.fillStyle = g;
        c.fillRect(0, 0, r.width, r.height);
        c.fillStyle = "rgba(255,255,255,.5)";
        c.font = "600 15px Inter, sans-serif";
        c.textAlign = "center";
        c.fillText("?", r.width / 2, r.height / 2 + 5);
        c.globalCompositeOperation = "destination-out";
      });
    }
    requestAnimationFrame(pintar);
    window.addEventListener("resize", pintar);

    /* ---- Rascado ---- */
    let aciertos = 0;
    let ganado = false;
    let rascando = false;

    function porcentaje(canvas) {
      const c = canvas.getContext("2d");
      const d = c.getImageData(0, 0, canvas.width, canvas.height).data;
      let libre = 0, muestras = 0;
      for (let i = 3; i < d.length; i += 4 * 20) {
        muestras++;
        if (d[i] < 40) libre++;
      }
      return muestras ? libre / muestras : 0;
    }

    function abrir(cell) {
      const canvas = cell.querySelector("canvas");
      if (canvas.dataset.hecho) return;
      canvas.dataset.hecho = "1";
      canvas.classList.add("is-done");

      if (+cell.dataset.num === suerte) {
        cell.classList.add("is-hit");
        aciertos++;
        marcador.textContent = `${aciertos} de ${necesarios}`;
        if (window.confetti) window.confetti.burst(18);

        if (aciertos >= necesarios && !ganado) {
          ganado = true;
          marcador.textContent = "¡Premio! 🎉";
          nota.textContent = "";
          if (window.confetti) window.confetti.burst(80);
          setTimeout(onWin, 1100);
        }
      } else {
        cell.classList.add("is-miss");
      }
    }

    function rascar(e) {
      if (ganado) return;
      const p = e.touches ? e.touches[0] : e;
      const bajo = document.elementFromPoint(p.clientX, p.clientY);
      const canvas = bajo && bajo.tagName === "CANVAS" ? bajo : null;
      if (!canvas || canvas.dataset.hecho) return;

      const r = canvas.getBoundingClientRect();
      const c = canvas.getContext("2d");
      const radio = Math.max(Math.min(r.width, r.height) / 4, 14);
      c.beginPath();
      c.arc(p.clientX - r.left, p.clientY - r.top, radio, 0, Math.PI * 2);
      c.fill();

      // Con rascar poco más de un tercio ya se da por descubierta
      if (porcentaje(canvas) > 0.36) abrir(canvas.parentElement);
    }

    const abajo = (e) => { rascando = true; rascar(e); };
    const mover = (e) => { if (!rascando) return; e.preventDefault(); rascar(e); };
    const arriba = () => { rascando = false; };

    grid.addEventListener("mousedown", abajo);
    grid.addEventListener("mousemove", mover);
    window.addEventListener("mouseup", arriba);
    grid.addEventListener("touchstart", abajo, { passive: true });
    grid.addEventListener("touchmove", mover, { passive: false });
    grid.addEventListener("touchend", arriba);

    /* Atajo de emergencia: doble clic abre la cartilla entera */
    grid.addEventListener("dblclick", () => {
      [...grid.children].forEach((cell, i) => setTimeout(() => abrir(cell), i * 120));
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
      // Los nombres largos ("Fuerteventura") van un punto más pequeños
      ctx.font = `600 ${c.texto.length > 10 ? 15 : 19}px Inter, sans-serif`;
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
