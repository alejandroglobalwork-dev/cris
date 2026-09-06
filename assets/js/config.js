/* =====================================================================
   CONFIG — Todo lo personalizable está aquí. Edita solo este archivo.
   ===================================================================== */

window.CONFIG = {
  /* ---------- Datos básicos ---------- */
  nombre: "Cris",                       // Su nombre / cómo la llamas
  deParteDe: "Alejandro",               // Tu nombre (firma de la carta)
  edad: null,                           // Ej: 25 — pon null para no mostrarlo
  fraseIntro: "Hoy el mundo celebra que existes.",
  fechaCumple: "2026-09-07",
  // false = al recargar la página los tres retos vuelven a empezar.
  // true  = recuerda lo que ya había desbloqueado.
  guardarProgreso: false,            // AAAA-MM-DD (solo decorativo)

  /* ---------- Vídeo ---------- */
  video: {
    // tipo: "local" (archivo en assets/video/) | "youtube" | "vimeo"
    tipo: "local",
    // Si tipo = "local": ruta del archivo. Si "youtube": el ID (ej "dQw4w9WgXcQ").
    fuente: "assets/video/mensaje.mp4",
    poster: "",                          // opcional: assets/img/poster.jpg
    titulo: "Un mensaje para ti",
    subtitulo: "Dale al play, ponte cómoda y súbele el volumen."
  },

  /* ---------- Aviso falso (puro teatro: nunca bloquea nada) ---------- */
  aviso: {
    activo: true,
    etiqueta: "Aviso",
    titulo: "Un solo intento por reto",
    texto: "Si fallas, el sistema quedará bloqueado 24 horas antes de que puedas volver a intentarlo. Piénsatelo bien.",
    fallo: "Fallo registrado. Otro más y este reto se bloqueará 24 h."
  },

  /* ---------- Qué ve al ganar (sin desvelar todavía qué es) ---------- */
  entrega: {
    estado: "Desbloqueado",
    titulo: "Has obtenido el regalo {n}",
    texto: "Ya es tuyo. Busca el paquete con el número {n} y ábrelo delante de mí.",
    nota: "Sabrás qué es cuando lo tengas en las manos."
  },

  /* ---------- Juego 1: Rasca y gana → Álbum de fotos ---------- */
  album: {
    titulo: "Álbum de recuerdos",
    etiqueta: "Regalo 1",
    icono: "📖",
    juego: "scratch",
    juegoTitulo: "Rasca y gana",
    pista: "Como los de la lotería: encuentra tres 7 y el premio es tuyo.",
    numeroSuerte: 7,      // su número de la suerte
    necesarios: 3,        // cuántos tiene que encontrar
    casillas: 6,          // casillas de la cartilla
    descripcion:
      "Un álbum hecho a mano con nuestras fotos favoritas. Cada página es un día que no quiero que se nos olvide nunca.",
    detalle: "Impreso, con fotos reales y notas escritas a mano.",
    // Fotos de vista previa (opcional). Pon rutas en assets/img/ y aparecerán en un carrusel.
    fotos: []
  },

  /* ---------- Juego 2: Quiz → Perfume ---------- */
  perfume: {
    titulo: "Prada Paradox",
    etiqueta: "Regalo 2",
    icono: "🌸",
    juego: "quiz",
    juegoTitulo: "¿Cuánto nos conocemos?",
    pista: "Tres preguntas sobre nosotros. Te las sabes todas.",
    descripcion:
      "Prada Paradox. Floral, ámbar y con carácter, igual que tú. Para que allá donde vayas, se note que has pasado por ahí.",
    detalle: "Eau de Parfum · Notas de neroli, jazmín y ámbar.",
    // Preguntas del quiz. `correcta` = índice (0,1,2) de la opción correcta.
    preguntas: [
      {
        pregunta: "¿Cuál es nuestra comida favorita juntos?",
        opciones: ["Ramen", "Sushi", "Pizza"],
        correcta: 1
      },
      {
        pregunta: "¿Cuál es 'nuestra' canción?",
        opciones: ["Ti amo", "Perfect", "Anche stasera"],
        correcta: 2
      },
      {
        pregunta: "¿Cuál fue nuestra primera cita?",
        opciones: ["En la bolera", "En el cine", "Un paseo por la playa"],
        correcta: 0
      }
    ]
  },

  /* ---------- Juego 3: Ruleta → Viaje a Tenerife ---------- */
  viaje: {
    titulo: "Nos vamos a Tenerife",
    etiqueta: "Regalo 3",
    icono: "✈️",
    juego: "ruleta",
    juegoTitulo: "La ruleta del destino",
    pista: "Gira la ruleta del destino. El universo ya sabe adónde vamos.",
    descripcion:
      "Vuelos reservados. El 14 de octubre despegamos de Valencia a las 22:30 y aterrizamos en otra vida: tú, yo y el Teide de fondo.",
    detalle: "Los billetes están dentro del sobre. En papel, para que puedas tocarlos.",
    // Tarjeta de embarque
    boarding: {
      pasajeros: "CRIS & ALEJANDRO",
      origen: { codigo: "VLC", ciudad: "Valencia" },
      destino: { codigo: "TFS", ciudad: "Tenerife" },
      fecha: "14 OCT",
      hora: "22:30",
      vuelo: "LOVE 001",
      asientos: "1A · 1B"
    },
    // Los destinos reales de la ruleta. Ganan las marcadas con `premio: true`,
    // y la ruleta siempre para en una de ellas.
    casillas: [
      { texto: "Gran Canaria",  premio: false },
      { texto: "Tenerife",      premio: true  },
      { texto: "Madrid",        premio: false },
      { texto: "Fuerteventura", premio: false },
      { texto: "Tenerife",      premio: true  },
      { texto: "Mallorca",      premio: false },
      { texto: "Miami",         premio: false },
      { texto: "Tenerife",      premio: true  }
    ]
  },

  /* ---------- Final: resumen de todo lo ganado ---------- */
  carta: {
    etiqueta: "Ya puedes mirar",
    titulo: "Todo lo que te llevas",
    intro: "Tres retos, tres regalos. Ahora sí, esto es lo que hay dentro de cada paquete:",
    cierre: "Y queda una cosa más que no cabe en una pantalla: hay una carta esperándote en papel, escrita a mano. Ten paciencia con la letra.",
    firma: "Te quiero."
  },

  /* ---------- Música de fondo (opcional) ---------- */
  musica: {
    activa: false,                       // ponlo en true cuando tengas el archivo
    fuente: "assets/audio/cancion.mp3"
  }
};
