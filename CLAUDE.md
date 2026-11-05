@AGENTS.md

## Notas para Claude Code
- Probar a 390 px y 360 px de ancho (y en escritorio) antes de publicar; revisar que el menú del celular abra y que no haya desborde horizontal. Usar Playwright si ya está instalado o, si no, el navegador integrado de la app; **decir en el informe cuál se usó**. No instalar Playwright ni otras dependencias sin pedir permiso.
- Cambios pequeños y de un tema por vez; no tocar portada ni precios sin aprobación.
- Al empezar una sesión, leer `docs/PENDIENTES.md` y `docs/DECISIONES.md`. Revisar también los Issues y pull requests abiertos cuando haya acceso; si no lo hay, trabajar con los documentos compartidos sin detener el desarrollo.

## Trabajo compartido con ChatGPT como desarrollador
- **Asignación:** el responsable decide quién implementa cada tarea. Claude Code y ChatGPT pueden programar tareas diferentes a la vez; cada uno usa su propia rama creada desde `main` y un PR independiente. No trabajan simultáneamente sobre una misma rama ni deben mezclar cambios de PR abiertos.
- **Cuando Claude Code implementa:** seguir el flujo permanente de abajo; Codex revisa el diff, Claude corrige los fallos importantes y presenta el PR sin fusionar.
- **Cuando ChatGPT implementa:** el responsable entrega a Claude Code el enlace del PR generado por ChatGPT. Claude comprueba la rama, el diff y las reglas, realiza las pruebas que pueda y encarga una revisión independiente a Codex usando `codex exec --sandbox read-only -`. Informa al responsable de errores, riesgos y pruebas pendientes. No modificar el PR o la rama de ChatGPT sin autorización explícita; si hace falta corregirlo, acordar quién hará la corrección.
- **Integración:** si dos PR afectan los mismos archivos, revisar conflictos y diferencias antes de fusionar. Nunca fusionar automáticamente ni actualizar `main` sin autorización del responsable. No solicitar una revisión Codex duplicada si ya existe un informe completo y vigente del mismo diff.
- **Límite de automatización:** GitHub es el medio compartido; ChatGPT en esta conversación y Claude Code local no se envían instrucciones entre sí automáticamente. El responsable pasa el enlace del PR y decide qué se aprueba.

## Flujo de trabajo permanente (Claude Code desarrolla, Codex revisa)
Claude Code es el desarrollador principal. Codex (OpenAI) es el revisor independiente y **solo lee**. La persona responsable del proyecto da la instrucción inicial y revisa el resultado final; entre ambos momentos Claude Code sigue estos pasos sin pedir confirmaciones innecesarias.

1. **Interpretar y revisar reglas.** Leer `AGENTS.md`, este archivo, `docs/DECISIONES.md` y `docs/PENDIENTES.md`. Si falta una decisión importante que solo el responsable puede tomar, preguntar **antes** de implementar; no preguntar por detalles con una opción convencional.
2. **Propuesta breve para cambios importantes de diseño.** Presentar primero los cambios visuales y funcionales esperados y esperar aprobación. Los ajustes pequeños dentro de lo ya aprobado no la necesitan.
3. **Desarrollar solo lo aprobado**, en una rama separada de `main` (partir de `origin/main`; no mezclar temas ni apoyarse en otro PR abierto).
4. **Probar** lo pertinente: móvil a 360 y 390 px, y escritorio. Registrar solo lo que realmente se ejecutó.
5. **Enviar el diff a Codex** (ver "Cómo se consulta a Codex").
6. **Corregir** los problemas importantes y, si hace falta, repetir la revisión. **Máximo 2 rondas de Codex por tarea**, salvo autorización expresa del responsable.
7. **Preparar el Pull Request** (sin fusionarlo) y entregar un **informe final breve**: qué se implementó, pruebas hechas y pendientes, hallazgos de Codex (y qué se hizo con cada uno) y pendientes.

### Cómo se consulta a Codex
- Comando: `codex exec --sandbox read-only -`, con el mensaje por **entrada estándar**. La plantilla está en `docs/PLANTILLA_REVISION_CODEX.md`.
- El mensaje debe incluir el diff completo contra `origin/main` (con los cambios locales), las reglas relevantes de `AGENTS.md` y la instrucción expresa de **analizar solo ese contenido, sin ejecutar comandos ni acceder al sistema de archivos**.
- **No usar `codex review`** mientras persista el bloqueo de PowerShell en Windows (falla con "execution policy blocked").
- Si la sesión de Claude Code abrió antes de instalar Node.js y no ve `node`/`codex`, añadir `C:\Program Files\nodejs` y `%APPDATA%\npm` al `PATH` **solo del comando** (no es un cambio del sistema). Reiniciar la app lo arregla de forma definitiva.
- Antes de enviar, comprobar que el diff no contenga credenciales, datos de pacientes ni datos privados. El repositorio es público, pero el envío es una salida de datos y se hace con cuidado.
- Si el método falla, **parar y explicar el error**. No ejecutar Codex sin sandbox, no cambiar su política ni la del sistema.
- No activar el *review gate* automático (`/codex:setup --enable-review-gate`).

### Reglas obligatorias
- **Nunca fusionar ni publicar en `main` sin aprobación explícita del responsable.** Tampoco aprobar o fusionar un PR por cuenta propia.
- No modificar precios, servicios médicos, identidad visual ni decisiones comerciales sin autorización.
- No desactivar el sandbox ni modificar políticas de seguridad para ejecutar Codex u otra herramienta.
- No enviar secretos, credenciales ni datos privados a Codex.
- **No inventar pruebas** ni presentar una revisión estática del código como prueba visual. Separar siempre "probado en navegador" de "revisado en el código" y de "pendiente".
- Evitar tareas, instalaciones y revisiones innecesarias que gasten tokens: pruebas y revisiones proporcionales al tamaño del cambio.
- Conservar las decisiones existentes de `docs/DECISIONES.md`; registrar las nuevas sin borrar el historial.

### Qué sigue necesitando aprobación del responsable
- Fusionar o publicar en `main`, y cualquier cambio que se publique en el sitio.
- Cambios de portada, precios, servicios, identidad visual o textos médicos y comerciales.
- Instalar herramientas o dependencias (Playwright, paquetes, plugins).
- Una tercera ronda o más de revisión de Codex.
- Activar el review gate, cambiar permisos o políticas de seguridad, o ejecutar Codex sin sandbox (esto último no se hace).
- Decisiones de negocio o médicas que no estén ya confirmadas en los documentos.
