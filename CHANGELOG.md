# CHANGELOG — Ecoliving Suyapa (sitio web)

Registro de cambios del sitio. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

Referencias usadas en las entradas:
- **MS** → `WEBSITE_V2/ECOLIVING_WEBSITE_MASTER_SPECIFICATION.md`
- **DS** → `WEBSITE_V2/ECOLIVING_UXUI_ENTERPRISE_DESIGN_SPECIFICATION.md`
- **AUD-NN** → documento NN de `AUDITORIA_ECOLIVING/`

---

## [V2 · Sprint 1 — Hero: Technical Pass] — 2026-07-25 · commit `e7ef2aa`

Primer sprint de la transformación a V2. Alcance **exclusivamente técnico y de UX no visual** sobre la sección Hero: accesibilidad, validación, rendimiento y limpieza de código. **No se modificó copy, titular, subtítulo, imagen ni el selector de perfiles** — eso queda para el Sprint 2 (UX y diseño).

### Añadido
- **Tokens de color accesibles** en `:root`, reutilizables por el resto de secciones (DS Parte 5):
  - `--text-secondary` `rgba(18,51,41,.72)` — 5.66:1 sobre blanco
  - `--text-placeholder` `rgba(18,51,41,.65)` — 4.58:1
  - `--danger` `#C4362E` — 5.36:1 · `--danger-soft` para el halo de foco en error
- **Validación real del formulario del Hero** (`main.js`), con reglas declarativas por campo:
  - Teléfono hondureño: acepta 8 dígitos con o sin código de país y con cualquier separador (`99999999`, `9999-9999`, `+504 9999-9999`, `(504) 9999-9999`); rechaza 7 dígitos y texto no numérico.
  - Correo: validación de formato real. Nombre: mínimo 2 caracteres.
  - Mensajes de error en español con voseo, mostrados bajo cada campo.
- **Estados de error visuales** (`.field-error`) con ícono, borde `--danger` y halo de foco propio.
- Atributos de accesibilidad en el formulario: `aria-describedby` por campo, `aria-invalid` dinámico, y `role="status"` + `aria-live="polite"` + `tabindex="-1"` en el mensaje de éxito.
- `inputmode="tel"` / `inputmode="email"` para teclados móviles correctos.
- Este archivo `CHANGELOG.md`.

### Corregido
- **Contraste WCAG AA en 6 elementos del Hero** que fallaban o estaban al límite (AUD-07 §6):

  | Elemento | Antes | Después |
  |---|---|---|
  | Subtítulo del formulario | 3.92:1 ❌ | 5.66:1 ✅ |
  | Labels de campo | 4.58:1 (al límite) | 5.66:1 ✅ |
  | Botón de interés inactivo | 3.92:1 ❌ | 5.66:1 ✅ |
  | Placeholders | 2.21:1 ❌ | 4.58:1 ✅ |
  | Texto del mensaje de éxito | 3.72:1 ❌ | 5.66:1 ✅ |
  | Texto de error | n/a (no existía) | 5.36:1 ✅ |

- **Bug de breakpoint del sello giratorio (821–980 px).** El hero pasa a layout apilado en 980 px, pero el sello solo se reposicionaba en 820 px: en ese rango quedaba anclado al fondo del `.hero-wrap` — ya con el formulario dentro — y se desprendía del diseño, apareciendo cortado bajo el formulario. Su regla responsive se movió al mismo breakpoint que el hero (980 px).
- **Doble descarga de la imagen del Hero en móvil.** El `preload` apuntaba siempre a `portada.webp` (208 KB, versión escritorio) aunque el `<picture>` mostrara `portada-mobile.webp` (125 KB): los dispositivos móviles descargaban ambas. Ahora hay dos `preload` con `media` que coinciden exactamente con los breakpoints del `<picture>` — **ahorro de ~208 KB por visita móvil**.
- El formulario aceptaba teléfonos inválidos (`checkValidity()` daba por bueno cualquier texto en un `type="tel"` sin patrón), generando leads no contactables.
- El foco no se gestionaba al enviar: ahora salta al primer campo con error, o al mensaje de éxito si el envío fue correcto.
- **WCAG 2.5.3 (Label in Name) en el sello giratorio.** El texto visible es «AGENDÁ TU VISITA AHORA» pero su `aria-label` decía «Agendá tu visita»: el nombre accesible no contenía el texto visible, por lo que un usuario de control por voz no podía activarlo diciendo lo que veía en pantalla. Detectado por Lighthouse en la revisión previa al despliegue.

### Cambiado
- Tamaño de fuente de los inputs de 14 px → **16 px**, para evitar el zoom automático de iOS al enfocar un campo.
- `.form-submit` y `.field` movieron su espaciado a CSS (antes venía de estilos inline).
- El texto del sello giratorio usa la clase `.spin-badge__text` en lugar de estilos inline en el SVG, y consume el token `--lime`.
- Se añadieron `width`/`height` al `<source>` móvil del `<picture>` para estabilidad de layout.

### Eliminado
- **7 bloques de estilos inline** en el Hero, sustituidos por clases (`.form-sub`, `.field`, `.form-submit`, `.spin-badge__text`). El Hero queda sin ningún `style=""`.

### Notas
- ⚠️ **El formulario sigue sin backend.** Los datos se registran en consola con un `TODO(backend)` explícito en `main.js`. Conectarlo a Zoho CRM o a un servicio de correo sigue siendo el bloqueante P0 de negocio (AUD-04 §3, MS Parte 7.4).
- Sin regresión visual en los 3 breakpoints. Sin errores en consola.
- Versiones de caché: `styles.css?v=13`, `main.js?v=4`.

---

## [V1.2] — 2026-07-25

### Corregido
- Las "amenidades" mezclaban sostenibilidad (paneles solares, áreas verdes, agua de pozo) con amenidades reales, y el número mostrado (7) no coincidía con la cantidad de chips (10). Ahora se muestran exactamente las 7 amenidades confirmadas por el cliente.

## [V1.1] — 2026-07-25

### Cambiado
- Datos reales del proyecto incorporados desde la documentación del cliente: 3 modelos de unidad con áreas y precios, amenidades confirmadas, contacto real (WhatsApp +504 9460-1511, info@suyapaecoliving.hn) y FAQ reescrito.

## [V1.0] — 2026-07-07

### Añadido
- Landing inicial de preventa: hero con formulario, espacios, amenidades, galería, distribuciones, ubicación, testimonios, FAQ y contacto.
