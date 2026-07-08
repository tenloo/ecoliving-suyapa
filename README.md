# ecoliving suyapa — Landing (producción)

Sitio estático listo para publicar. Reproduce fielmente el diseño `Landing ecoliving Suyapa v4` del handoff, en HTML/CSS/JS limpio, responsive y accesible.

## Estructura
```
site/
├─ index.html      # marcado semántico completo
├─ styles.css      # sistema de diseño + estilos
├─ main.js         # nav móvil, formulario, acordeón FAQ, toggle interés, scroll reveal
└─ assets/
   ├─ logo-*.svg   # logos (emerald, lime, white, dark)
   └─ img/
      ├─ habitacion-1.png  # render real (hero + galería)
      └─ habitacion-2.png  # render real (tarjeta "Habitación privada")
```

## Cómo verlo
Abrí `index.html` en el navegador, o serví la carpeta:
```
cd site && python3 -m http.server 4173
# http://localhost:4173
```

## Imágenes
Todos los slots ya tienen render (imágenes IA generadas + optimizadas a WebP): fachada,
rooftop, coworking, lounge, gimnasio, áreas verdes, áreas comunes, comunidad y habitación.
Cuando tengas los **renders/fotos oficiales**, reemplazá el `src` de cada `<img>` en `index.html`
por tu archivo (mantené `assets/img/` y el formato WebP para peso; mismo `width`/`height`).

## Qué falta reemplazar (datos reales) — buscá los `[corchetes]` en index.html
- **Contacto:** WhatsApp `50400000000` y `+504 0000-0000`, correo `hola@ecolivingsuyapa.com`, redes (Instagram/Facebook/TikTok).
- **Precios** (sección `#precios`): `L. [X,XXX] /mes` (vivir) y `Desde $[XX,XXX]` (invertir), retorno `[XX]%`, plazo `[XX] meses`.
- **Urgencia** (franja bajo el hero): `[12] unidades`, `L. [X,XXX]` de reserva.
- **Comparativa**: costos `L. [X,XXX]` en la fila de total.
- **Inversionistas** (`#invertir`): `[XX,XXX]+` estudiantes, `[XX]%` ocupación, `L. [X,XXX]` renta, `[XX]%` retorno, `[XX]` meses/prima.
- **Desarrollador** (`#desarrollador`): `[Nombre del desarrollador]`, años, proyectos, `RTN [número]`, `[Banco 1/2/3]`.
- **Testimonios**: reemplazar los `[Nombre]` y las citas de ejemplo por reseñas reales.

## Analytics / retargeting (imprescindible antes de pautar)
En el `<head>` de index.html reemplazá:
- `G-XXXXXXXXXX` → tu ID de **Google Analytics 4**.
- `XXXXXXXXXXXXXXX` → tu ID de **Meta Pixel**.
Eventos que ya disparan solos: `generate_lead`/`Lead` (envío de formulario), `whatsapp_click`/`Contact`, `cta_click`, `ViewContent` (lista de precios).

## Conectar el formulario a un backend
En `main.js`, función de `submit`, el objeto `data` (`{nombre, telefono, correo, interes}`) está listo para enviarse a tu backend / email / API de WhatsApp donde dice `console.log('Lead ...')`.
- **Formulario:** en `main.js`, la función de `submit` ya arma el objeto `{nombre, telefono, correo, interes}`.
  Conectalo a tu backend / servicio de email / API de WhatsApp donde dice `console.log('Lead ...')`.

## Paleta
`#123329` (verde ink) · `#19B269` (verde) · `#B2E67B` (lima) · `#DFF4E0` (menta) · `#F3F6F2` (fondo) · tipografía Plus Jakarta Sans.
