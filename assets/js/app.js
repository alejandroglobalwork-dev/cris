/* =====================================================================
   App — orquesta la experiencia completa.
   ===================================================================== */
(function () {
  const C = window.CONFIG;
  const $ = (sel) => document.querySelector(sel);
  const STORE_KEY = "regalos-desbloqueados";

  const REGALOS = [
    { id: "album",   cfg: C.album },
    { id: "perfume", cfg: C.perfume },
    { id: "viaje",   cfg: C.viaje }
  ];

  /* ---------------- Estado persistente ---------------- */
  let unlocked = new Set();
  try {
    unlocked = new Set(JSON.parse(localStorage.getItem(STORE_KEY) || "[]"));
  } catch (_) { /* modo privado: seguimos sin memoria */ }

  const save = () => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify([...unlocked])); } catch (_) {}
  };

  /* ---------------- Portada ---------------- */
  $("#intro-name").textContent = C.nombre;
  $("#intro-phrase").textContent = C.fraseIntro;

  if (C.fechaCumple) {
    const d = new Date(C.fechaCumple + "T00:00:00");
    if (!isNaN(d)) {
      const fecha = d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
      $("#intro-date").textContent =
        C.edad ? `${fecha} · ${C.edad} años` : fecha;
    }
  }

  $("#start-btn").addEventListener("click", () => {
    if (window.confetti) window.confetti.burst(90);
    startMusic();
    $("#video").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------------- Vídeo ---------------- */
  $("#video-title").textContent = C.video.titulo;
  $("#video-subtitle").textContent = C.video.subtitulo;

  (function mountVideo() {
    const frame = $("#video-frame");
    const v = C.video;

    if (v.tipo === "youtube" && v.fuente) {
      frame.innerHTML =
        `<iframe src="https://www.youtube-nocookie.com/embed/${v.fuente}?rel=0"
                 title="${v.titulo}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                 allowfullscreen></iframe>`;
      return;
    }
    if (v.tipo === "vimeo" && v.fuente) {
      frame.innerHTML =
        `<iframe src="https://player.vimeo.com/video/${v.fuente}"
                 title="${v.titulo}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
      return;
    }

    const video = document.createElement("video");
    video.src = v.fuente;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    if (v.poster) video.poster = v.poster;
    frame.appendChild(video);

    // Si el archivo aún no existe, mostramos un aviso bonito en vez de un hueco negro
    video.addEventListener("error", () => {
      frame.insertAdjacentHTML("beforeend",
        `<div class="video-missing">
           <strong>Aquí irá el vídeo</strong>
           <span>Coloca tu archivo en <code>${v.fuente}</code></span>
         </div>`);
    });

    // Vídeo vertical (grabado con el móvil) → ajustamos el marco
    video.addEventListener("loadedmetadata", () => {
      if (video.videoHeight > video.videoWidth) frame.classList.add("is-portrait");
    });

    video.addEventListener("play", () => pauseMusic());
  })();

  $("#to-gifts").addEventListener("click", () =>
    $("#gifts").scrollIntoView({ behavior: "smooth" }));

  /* ---------------- Aviso (falso) ---------------- */
  if (C.aviso && C.aviso.activo) {
    $("#warning-label").textContent = C.aviso.etiqueta;
    $("#warning-title").textContent = C.aviso.titulo;
    $("#warning-text").textContent = C.aviso.texto;
    $("#warning").hidden = false;
  }

  /* ---------------- Tarjetas de regalo ---------------- */
  const cardsEl = $("#cards");

  function boardingPass(b) {
    if (!b) return "";
    return `
      <div class="pass">
        <div>
          <div class="pass__route">
            <div>
              <div class="pass__code">${b.origen.codigo}</div>
              <div class="pass__city">${b.origen.ciudad}</div>
            </div>
            <svg class="pass__plane" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z"/>
            </svg>
            <div>
              <div class="pass__code">${b.destino.codigo}</div>
              <div class="pass__city">${b.destino.ciudad}</div>
            </div>
          </div>
          <div class="pass__grid">
            <div><span class="pass__k">Pasajeros</span><span class="pass__v">${b.pasajeros}</span></div>
            <div><span class="pass__k">Vuelo</span><span class="pass__v">${b.vuelo}</span></div>
            <div><span class="pass__k">Fecha</span><span class="pass__v">${b.fecha}</span></div>
            <div><span class="pass__k">Salida</span><span class="pass__v">${b.hora}</span></div>
            <div class="pass__wide"><span class="pass__k">Asientos</span><span class="pass__v">${b.asientos}</span></div>
          </div>
        </div>
        <div class="pass__stub">Boarding pass</div>
      </div>`;
  }

  const rellena = (txt, n) => (txt || "").replace(/\{n\}/g, n);

  function cardMarkup(cfg, isUnlocked, numero) {
    if (!isUnlocked) {
      return `
        <div class="card__icon">🔒</div>
        <span class="card__label">${cfg.etiqueta}</span>
        <h3 class="card__title">Por descubrir</h3>
        <p class="card__lock">${cfg.pista}</p>
        <button class="btn btn--ghost" data-play>Jugar</button>`;
    }

    // Ganado: se le dice QUÉ número ha ganado, nunca qué es. Eso lo abre en persona.
    const e = C.entrega;
    return `
      <div class="card__seal">${numero}</div>
      <span class="card__label">${e.estado}</span>
      <div class="card__body card__reveal">
        <h3 class="card__title">${rellena(e.titulo, numero)}</h3>
        <p class="card__text">${rellena(e.texto, numero)}</p>
        <p class="card__detail">${e.nota}</p>
      </div>`;
  }

  /* El desglose completo, solo al final */
  function giftMarkup(cfg) {
    const fotos = (cfg.fotos && cfg.fotos.length)
      ? `<div class="card__photos">${cfg.fotos.map((f) => `<img src="${f}" alt="" loading="lazy">`).join("")}</div>`
      : "";
    return `
      <article class="gift">
        <div class="gift__icon">${cfg.icono}</div>
        <div class="gift__body">
          <span class="card__label">${cfg.etiqueta}</span>
          <h3 class="gift__title">${cfg.titulo}</h3>
          <p class="gift__text">${cfg.descripcion}</p>
          ${fotos}
          ${cfg.boarding ? boardingPass(cfg.boarding) : ""}
          <p class="gift__detail">${cfg.detalle}</p>
        </div>
      </article>`;
  }

  function renderCards() {
    cardsEl.innerHTML = "";
    REGALOS.forEach(({ id, cfg }, i) => {
      const isUnlocked = unlocked.has(id);
      const card = document.createElement("article");
      card.className = "card reveal" + (isUnlocked ? " is-unlocked" : "");
      card.innerHTML = cardMarkup(cfg, isUnlocked, i + 1);
      const play = card.querySelector("[data-play]");
      if (play) play.addEventListener("click", () => openGame(id, cfg));
      cardsEl.appendChild(card);
      observer.observe(card);
    });
    updateProgress();
  }

  function updateProgress() {
    const n = unlocked.size;
    $("#progress-fill").style.width = (n / REGALOS.length) * 100 + "%";
    $("#progress-label").textContent = `${n} de ${REGALOS.length} desbloqueados`;
    $("#finale-btn").hidden = n < REGALOS.length;
  }

  /* ---------------- Modal + juegos ---------------- */
  const modal = $("#modal");
  const stage = $("#modal-stage");

  function openGame(id, cfg) {
    $("#modal-eyebrow").textContent = cfg.etiqueta;
    $("#modal-title").textContent = cfg.juegoTitulo || "Reto";
    $("#modal-hint").textContent = cfg.pista;
    stage.innerHTML = "";
    modal.hidden = false;
    document.body.style.overflow = "hidden";

    const game = window.GAMES[cfg.juego] || window.GAMES.scratch;
    game(stage, cfg, () => win(id, cfg));
  }

  function closeModal() {
    modal.hidden = true;
    stage.innerHTML = "";
    document.body.style.overflow = "";
  }

  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  function win(id, cfg) {
    unlocked.add(id);
    save();
    closeModal();
    if (window.confetti) window.confetti.burst(80);
    renderCards();
    // Enfocamos la tarjeta recién revelada
    const idx = REGALOS.findIndex((r) => r.id === id);
    const card = cardsEl.children[idx];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("is-in");
    }
    if (unlocked.size === REGALOS.length) {
      setTimeout(() => { $("#finale-btn").hidden = false; }, 400);
    }
  }

  /* ---------------- Final: el resumen ---------------- */
  $("#letter-eyebrow").textContent = C.carta.etiqueta;
  $("#letter-title").textContent = C.carta.titulo;
  $("#letter-intro").textContent = C.carta.intro;
  $("#summary").innerHTML = REGALOS.map(({ cfg }) => giftMarkup(cfg)).join("");
  $("#letter-close").textContent = C.carta.cierre;
  $("#letter-sign").textContent = `${C.carta.firma} — ${C.deParteDe}`;

  $("#finale-btn").addEventListener("click", () => {
    $("#finale").hidden = false;
    requestAnimationFrame(() => {
      $("#finale").scrollIntoView({ behavior: "smooth" });
      if (window.confetti) window.confetti.rain(4);
      document.querySelectorAll("#finale .reveal").forEach((n) => n.classList.add("is-in"));
    });
  });

  $("#replay-btn").addEventListener("click", () => {
    unlocked = new Set();
    save();
    renderCards();
    $("#finale").hidden = true;
    $("#intro").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------------- Música ---------------- */
  let audio = null;
  const musicBtn = $("#music-toggle");

  if (C.musica && C.musica.activa) {
    audio = new Audio(C.musica.fuente);
    audio.loop = true;
    audio.volume = 0.35;
    musicBtn.hidden = false;
    musicBtn.addEventListener("click", () => {
      if (audio.paused) startMusic(); else pauseMusic();
    });
  }

  function startMusic() {
    if (!audio) return;
    audio.play().then(() => musicBtn.setAttribute("aria-pressed", "true")).catch(() => {});
  }
  function pauseMusic() {
    if (!audio) return;
    audio.pause();
    musicBtn.setAttribute("aria-pressed", "false");
  }

  /* ---------------- Aparición al hacer scroll ---------------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((n) => observer.observe(n));

  renderCards();
})();
