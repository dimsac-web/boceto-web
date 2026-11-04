---
name: revisar-dimsac
description: Revisa la calidad y riesgos de una modificación de DIMSAC DENT antes de publicarla. Usar al pedir una revisión de cambios, del diseño, de una rama o de un pull request del sitio.
---

# Revisión web de DIMSAC DENT

## Preparación
- Lee primero `AGENTS.md`, `CLAUDE.md`, `docs/DECISIONES.md` y `docs/PENDIENTES.md` cuando existan.
- Verifica la rama activa y los archivos realmente modificados. No supongas que un cambio está publicado.
- No modifiques, hagas commit, subas ni fusiones archivos al ejecutar esta skill, salvo autorización específica posterior.

## Comprobaciones
1. Comprueba que la web representa únicamente los servicios radiológicos confirmados; no inventes consultas, tratamientos o derivaciones.
2. Revisa que los precios, el contacto y el acceso por WhatsApp sean claros, sobre todo en móvil.
3. Comprueba el diseño a 360 y 390 px y también en escritorio, si dispones de navegador de pruebas. No afirmes haber probado algo que no ejecutaste.
4. Inspecciona enlaces, saltos a secciones, navegación, formularios y botones. Verifica que no haya desplazamiento horizontal.
5. Revisa accesibilidad: textos alternativos, encabezados, foco por teclado, contraste y `prefers-reduced-motion`.
6. Si cambian CSS o JS, revisa la versión de caché `?v=N`. Si hay datos de pacientes, reporta posibles riesgos de privacidad.
7. Señala optimizaciones de rendimiento solo si tienes evidencia (imágenes, carga o mediciones), sin inventar puntuaciones.

## Informe
Da un resultado breve en español con estas secciones:
- Cambios confirmados
- Problemas reales (prioridad alta/media/baja, archivo o línea, causa y solución)
- Mejoras opcionales (sin confundirlas con errores)
- Pruebas ejecutadas y pruebas pendientes
- Recomendación: aprobar, corregir antes de publicar o falta verificar

Mantén la identidad aprobada de DIMSAC DENT. No propongas rediseños generales ni nuevas funcionalidades ajenas al encargo.
