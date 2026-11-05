# Decisiones aprobadas

Formato: fecha, decisión, motivo. Lo más reciente arriba.

## 2026-11-05
- **Protección de la rama `main` y comprobaciones obligatorias:** reglaset de GitHub `Proteccion-main` creado y activado. Exige que los cambios entren por Pull Request y que pasen los checks `verificar` (sintaxis JS y recursos locales) y `responsive` (Chrome real a 360/390/1280 px, tablas de precios, menú y WhatsApp); impide borrar `main` o hacer force push. El ruleset requiere 0 aprobaciones formales de GitHub, por lo que la **autorización explícita del responsable antes de fusionar** sigue siendo una regla del equipo, no una aprobación formal exigida por GitHub. Motivo: evitar publicar cambios sin las comprobaciones automáticas y conservar revisión humana.
- **Desarrollo paralelo con ChatGPT y Claude Code:** el responsable puede asignar tareas distintas a cada IA; ambas trabajan en ramas/PR separados desde `main`, sin tocar la rama ajena. GitHub sirve de intercambio, y el responsable comparte el enlace del PR cuando haga falta una revisión cruzada. Codex revisa los cambios de ambos por el método de solo lectura a través de Claude Code; cada revisión reporta límites de pruebas y no reemplaza aprobación humana. Nunca hay fusión ni publicación automática; los trabajos sobre archivos compartidos se integran secuencialmente. Motivo: distribuir el desarrollo sin conflictos y conservar el control humano.
- **Flujo de trabajo permanente: Claude Code desarrolla, Codex revisa.** Claude Code es el desarrollador principal y trabaja en ramas separadas de `main`; Codex es revisor independiente de solo lectura, consultado por `codex exec --sandbox read-only -` con el diff por entrada estándar (no `codex review`, bloqueado por PowerShell). Máximo 2 rondas de Codex por tarea. Los cambios importantes de diseño se proponen antes de implementarse. Nada se fusiona ni se publica en `main` sin aprobación explícita; el review gate automático queda desactivado; no se desactiva el sandbox ni se cambian políticas de seguridad; no se envían secretos ni datos privados a Codex; no se presentan revisiones estáticas como pruebas visuales. Reglas completas en `CLAUDE.md`, plantilla en `docs/PLANTILLA_REVISION_CODEX.md`. Motivo: que el responsable solo dé instrucciones iniciales y revise el resultado final, con revisión independiente y bajo consumo de tokens.
- **Tablas de precios en celular (≤599 px)**: menos relleno lateral en las celdas, lista de precios 8 px más ancha por lado (tarjetas a 8 px del borde, aprobado frente a 4 px) e icono de WhatsApp de 16 px, para que "Impresa" y "Digital" se vean completas a 360 y 390 px sin desplazar la tabla. Letra de 18 px, textos, precios, enlaces y escritorio sin cambios; `overflow-x:auto` se conserva como protección.

## 2026-11-04
- **Botón flotante de WhatsApp compacto en celular**: círculo de 56 px solo con el icono (nombre accesible conservado), latido limitado a 3 repeticiones, burbuja oculta en la sección de precios y respeto del área segura del iPhone. En escritorio conserva el botón con texto. Aprobado tras revisión visual en iPhone.
- **WhatsApp por local**: un botón "Pedir cita por WhatsApp" en cada tarjeta de Locales, mismo número (947 707 736) y mensaje distinto por sede. Aprobado tras revisión de ChatGPT.
- **Automatización `@claude` en GitHub**: se deja para después; primero probar en un repositorio aparte. Mientras tanto, ciclo manual con pull requests.
- **Coordinación entre ChatGPT y Claude Code por GitHub**: archivos de reglas, registro y pull requests. Sin API adicional.
- **Recorrido de fotos: 6 escenas** (antes 9): fachada Los Coritos, recepción, sala de radiografías, equipo de radiografía y tomografía, pantalla táctil, rayos X intraoral. Motivo: menos desplazamiento en el celular. Las fotos serán retomadas por la dueña.
- **Botón fijo "Cómo llegar"** dentro del recorrido (lleva a Locales); se quitó el atajo de direcciones del inicio.
- **Orden de la página (móvil)**: Inicio, Recorrido, Lista de precios, orden del dentista (un solo botón de WhatsApp), Formas de pago, Cómo pedir tu cita, Locales, Equipo, Contacto. Se eliminó "Nuestros servicios".
- **Enlaces directos** a secciones (`#precios`, `#locales`) funcionan; sin `#` la página abre arriba.
- **Datos estructurados (JSON-LD)** válidos, con los dos locales.
- **Nombres**: "La Apacheta" y "Cohergo".
- **No se agregan**: red de odontólogos, derivaciones, consultas en sillón, catálogo de servicios previo a los precios, accesos rápidos duplicados.
- **Fichas del equipo incompletas** se mantienen como boceto mientras se desarrolla y se ocultan antes de publicar.

## Antes
- Se quitó el selector de modo claro/oscuro: la web usa un solo tema.
- Pagos con iconos simples (no logos de Yape/Plin).
- Fotos de ejemplo de radiografías de Wikimedia Commons con crédito; serán reemplazadas por imágenes reales anonimizadas.
