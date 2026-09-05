/* =====================================================================
   CONFIG — Todo lo personalizable está aquí. Edita solo este archivo.
   ===================================================================== */

window.CONFIG = {
  /* ---------- Datos básicos ---------- */
  nombre: "Cris",                       // Su nombre / cómo la llamas
  deParteDe: "Alejandro",               // Tu nombre (firma de la carta)
  edad: null,                           // Ej: 25 — pon null para no mostrarlo
  fraseIntro: "Hoy el mundo celebra que existes.",
  fechaCumple: "2026-01-01",            // AAAA-MM-DD (solo decorativo)

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

  /* ---------- Juego 1: Rasca y gana → Álbum de fotos ---------- */
  album: {
    titulo: "Álbum de recuerdos",
    etiqueta: "Regalo 1",
    icono: "📖",
    juego: "scratch",
    pista: "Rasca la superficie para revelar tu primer regalo.",
    descripcion:
      "Un álbum hecho a mano con nuestras fotos favoritas. Cada página es un día que no quiero que se nos olvide nunca.",
    detalle: "Impreso, con fotos reales y notas escritas a mano.",
    // Fotos de vista previa (opcional). Pon rutas en assets/img/ y aparecerán en un carrusel.
    fotos: []
  },

  /* ---------- Juego 2: Quiz → Perfume ---------- */
  perfume: {
    titulo: "Tu nuevo aroma",
    etiqueta: "Regalo 2",
    icono: "🌸",
    juego: "quiz",
    pista: "Responde tres preguntas sobre nosotros para desbloquearlo.",
    descripcion:
      "Un perfume elegido pensando en ti: cálido, dulce y con carácter. Para que allá donde vayas, vayas siendo tú.",
    detalle: "Notas de vainilla, ámbar y flor de naranjo.",
    // Preguntas del quiz. `correcta` = índice (0,1,2) de la opción correcta.
    preguntas: [
      {
        pregunta: "¿Dónde nos vimos por primera vez?",
        opciones: ["En una cafetería", "En casa de un amigo", "Por internet"],
        correcta: 0
      },
      {
        pregunta: "¿Cuál es mi comida favorita?",
        opciones: ["Sushi", "Pizza", "Pasta"],
        correcta: 2
      },
      {
        pregunta: "¿Qué canción es 'nuestra'?",
        opciones: ["La que ya sabes", "La del coche", "Las dos"],
        correcta: 2
      }
    ]
  },

  /* ---------- Juego 3: Ruleta → Viaje a Tenerife ---------- */
  viaje: {
    titulo: "Nos vamos a Tenerife",
    etiqueta: "Regalo 3",
    icono: "✈️",
    juego: "ruleta",
    pista: "Gira la ruleta del destino. El universo ya sabe adónde vamos.",
    descripcion:
      "Vuelos reservados. Tú, yo, el Teide de fondo y unos días sin reloj ni prisas.",
    detalle: "Los billetes están dentro del sobre. En papel, para que puedas tocarlos.",
    // Tarjeta de embarque
    boarding: {
      pasajeros: "CRIS & ALEJANDRO",
      origen: { codigo: "MAD", ciudad: "Madrid" },
      destino: { codigo: "TFS", ciudad: "Tenerife" },
      fecha: "POR CONFIRMAR",
      hora: "--:--",
      vuelo: "LOVE 001",
      asientos: "1A · 1B"
    },
    // Casillas de la ruleta. La ganadora es la marcada con `premio: true`.
    casillas: [
      { texto: "París", premio: false },
      { texto: "Tenerife", premio: true },
      { texto: "Roma", premio: false },
      { texto: "Tenerife", premio: true },
      { texto: "Lisboa", premio: false },
      { texto: "Tenerife", premio: true },
      { texto: "Nueva York", premio: false },
      { texto: "Tenerife", premio: true }
    ]
  },

  /* ---------- Carta final ---------- */
  carta: {
    titulo: "Una última cosa",
    texto: [
      "Podría llenar esta página de regalos y aun así se quedaría corta.",
      "Gracias por cada día normal contigo, que resulta que son los mejores.",
      "Feliz cumpleaños, mi amor. Que cumplas muchísimos más, y todos conmigo."
    ],
    firma: "Te quiero."
  },

  /* ---------- Música de fondo (opcional) ---------- */
  musica: {
    activa: false,                       // ponlo en true cuando tengas el archivo
    fuente: "assets/audio/cancion.mp3"
  }
};
