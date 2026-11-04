# DIMSAC DENT: reglas del proyecto (para Claude Code, ChatGPT/Codex y personas)

Sitio estático (HTML, CSS y JS sin frameworks) del centro de radiología odontológica **Dimsac Dent** (Arequipa, Perú), parte de Cohergo. Se publica con GitHub Pages desde la rama `main`: **todo lo que entra a `main` se publica**. Estado: boceto en revisión (`noindex`).

## Negocio (confirmado)
- Solo **radiología e imagen dental**: radiografías intraorales y extraorales, cefalometría y tomografía 3D (Cone Beam). **No hay atención ni tratamientos en sillón.**
- **No se recomiendan ni derivan pacientes a otros doctores.** No inventar servicios, tratamientos, convenios ni redes de especialistas.
- Dos locales: **Los Coritos** (lun-vie 9:00-19:00 corrido, sáb 9:00-17:00, dom cerrado) y **La Apacheta** (Calle Italia 666, Las Casuarinas; lun-vie 9:00-13:00 y 14:30-19:00; sáb y dom cerrado).
- Formas de pago: Yape, Plin, transferencia y efectivo. Precios iguales para todos los pacientes.
- Todo dato médico, precio u horario nuevo debe estar confirmado por la dueña del negocio antes de publicarse.

## Prioridades de diseño
1. **Móvil primero**: la mayoría ve la web desde el celular. Probar a 390 y 360 px de ancho, sin desplazamiento horizontal.
2. Facilidad de consultar **precios** (lista de precios, toque en un estudio abre WhatsApp con mensaje). No esconderla ni complicarla.
3. Identidad visual: negro `#111`, dorado `#e0a800`, crema `#fffaf0`; tipografías Manrope e Inter; texto mínimo 18 px; botones de 48 px o más. Cambiarla solo si se aprueba en `docs/DECISIONES.md`.
4. No rediseñar secciones que ya funcionan sin una justificación escrita.
5. Respetar `prefers-reduced-motion` y que la página funcione sin JavaScript.

## Cómo trabajamos
- **Claude Code**: implementa, mantiene y prueba (móvil y escritorio) antes de publicar.
- **ChatGPT**: revisa código, diseño y experiencia de usuario; propone mejoras con un Issue o una rama y un pull request.
- Antes de implementar una propuesta, se analiza si encaja con este documento.
- **Nadie sube directo a `main` si hay un pull request abierto que toque los mismos archivos.** Cambios compartidos: rama + pull request + revisión del otro.
- Al subir CSS o JS, subir el número de versión (`?v=N`) en `index.html` para evitar caché.
- Cada decisión importante se anota en `docs/DECISIONES.md`; el trabajo pendiente, en `docs/PENDIENTES.md`.
- Los dos modelos **no conversan entre sí**: se comunican solo mediante este repositorio.

## Privacidad
El repositorio es **público**. No guardar contraseñas, credenciales, información sensible ni datos identificables de pacientes. Los datos profesionales y las fotografías del equipo solo podrán publicarse con autorización de cada persona.
