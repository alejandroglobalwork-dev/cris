# 🎁 Página de cumpleaños con QR

Una página web de una sola URL: se escanea un QR, se abre, se ve un vídeo y se
desbloquean tres regalos superando tres mini-juegos. Sin frameworks, sin build,
sin servidor: HTML + CSS + JavaScript.

## El recorrido

1. **Portada** — su nombre en grande, con el fondo aura (naranja · rosa · rojo).
2. **Vídeo** — tu mensaje grabado (desactivado: pon `video.activo` en `true` para que vuelva).
3. **Tres regalos, tres retos**
   - 🃏 **Rasca y gana** (encuentra tres 7) → el cuadro
   - 💭 **Quiz "¿cuánto nos conocemos?"** → el perfume
   - 🎡 **Ruleta del destino** (trucada, siempre cae en Tenerife) → el viaje,
     con tarjeta de embarque incluida
4. **Carta final** — con lluvia de confeti.

El progreso se guarda en el navegador, así que puede cerrar la página y volver
sin perder lo desbloqueado.

## Cómo personalizarlo

**Todo** lo editable está en un único archivo: `assets/js/config.js`.
Ahí cambias el nombre, la frase, el vídeo, los textos de los tres regalos,
las preguntas del quiz, la tarjeta de embarque y la carta final.

### 1. El vídeo

La sección está **apagada**. Para encenderla, en `config.js`:

```js
video: { activo: true, ... }
```

Opción A — archivo propio (recomendado):

```js
video: { tipo: "local", fuente: "assets/video/mensaje.mp4" }
```

Guarda tu vídeo en `assets/video/mensaje.mp4`. Formato **MP4 (H.264)** para que
funcione en cualquier móvil. Si pesa mucho, comprímelo:

```bash
ffmpeg -i original.mov -vcodec libx264 -crf 26 -preset slow -acodec aac assets/video/mensaje.mp4
```

Opción B — YouTube (útil si el vídeo es largo o pesado); súbelo como **oculto**
y pon solo el ID:

```js
video: { tipo: "youtube", fuente: "dQw4w9WgXcQ" }
```

Si el archivo todavía no existe, la página muestra un aviso elegante en su
lugar (no se rompe).

### 2. Las fotos de vista previa

Copia algunas en `assets/img/` y añádelas a la lista:

```js
cuadro: { ..., fotos: ["assets/img/foto1.jpg", "assets/img/foto2.jpg"] }
```

### 3. El quiz

Cambia las tres preguntas por cosas vuestras. `correcta` es el índice de la
opción buena (`0`, `1` o `2`). Si falla, no pasa nada: puede seguir probando.

### 4. La música (opcional)

Pon el MP3 en `assets/audio/cancion.mp3` y activa `musica.activa = true`.
Empieza al pulsar "Abrir mi regalo" y se pausa sola cuando arranca el vídeo.

## Cómo publicarlo (gratis)

**GitHub Pages:** Settings → Pages → Source: `Deploy from a branch` → rama
`main`, carpeta `/ (root)`. En un par de minutos estará en
`https://TU-USUARIO.github.io/cris/`.

Alternativas igual de válidas: arrastrar la carpeta a
[netlify.com/drop](https://app.netlify.com/drop) o usar Vercel.

> Si el vídeo es muy personal, ten en cuenta que una URL pública es accesible
> para quien la conozca. Para más privacidad: sube el vídeo a YouTube como
> "oculto", o usa Netlify con protección por contraseña.

## Cómo generar el QR

Abre `qr.html` en la página publicada (`.../cris/qr.html`), pega la URL,
pulsa **Generar** y **Descargar PNG**.

Consejos para imprimirlo:
- Pruébalo con tu propio móvil **antes** de imprimir.
- Mínimo 3 × 3 cm, con margen blanco alrededor.
- Sobre papel mate (el brillo dificulta el escaneo).

## Probarlo en local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

(Abrir el `index.html` a pelo también funciona, pero con un servidor el vídeo
se comporta mejor.)

## Estructura

```
index.html            La página
qr.html               Generador del código QR
assets/css/styles.css Estilos y paleta
assets/js/config.js   👈 EDITA SOLO ESTE ARCHIVO
assets/js/app.js      Lógica de la experiencia
assets/js/games.js    Los tres mini-juegos
assets/js/confetti.js Confeti
assets/video/         Tu vídeo aquí
assets/img/           Tus fotos aquí
assets/audio/         Tu música aquí
```
