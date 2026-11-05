# Plantilla de revisión con Codex

Uso: Claude Code arma un archivo temporal (fuera del repositorio) con este texto más el diff, y lo envía por entrada estándar. No guardar el archivo armado en el repositorio.

```bash
git diff origin/main > diff.txt          # incluye cambios locales; revisar que no tenga secretos ni datos privados
# armar el mensaje = texto de abajo + contenido de diff.txt
codex exec --sandbox read-only - < mensaje.txt
```

Si `node` o `codex` no se encuentran en la sesión, anteponer al comando `C:\Program Files\nodejs` y `%APPDATA%\npm` en el `PATH` solo de ese comando.

## Texto del mensaje

```
Eres revisor de código. Analiza ÚNICAMENTE el contenido que sigue en este mensaje. NO ejecutes comandos, NO leas archivos y NO accedas al sistema de archivos ni a la red. Responde solo con tu análisis, en español.

Contexto: sitio estático (HTML/CSS/JS sin frameworks) del centro de radiología dental DIMSAC DENT. Objetivo del cambio: <una o dos frases>.

Reglas relevantes de AGENTS.md: <pegar solo las que aplican: móvil primero 360/390 px sin desborde horizontal; precios fáciles de consultar; identidad negro #111, dorado #e0a800, crema #fffaf0, Manrope e Inter, texto mínimo 18 px, botones de 48 px o más; prefers-reduced-motion y funcionamiento sin JavaScript; subir ?v=N al cambiar CSS o JS; no cambiar precios ni servicios sin aprobación; repositorio público sin datos sensibles; solo radiología, no inventar servicios>.

Contexto adicional del código existente que no está en el diff: <solo lo imprescindible>.

Entrega: problemas con gravedad (alta/media/baja), archivo y línea aproximada, causa y solución; después mejoras opcionales; y una recomendación final (aprobar / corregir / falta verificar). Si no encuentras problemas, dilo explícitamente.

=== DIFF COMPLETO (git diff origin/main) ===
<diff>
```

## Reglas de uso
- Máximo 2 rondas por tarea, salvo autorización del responsable.
- Codex no ejecuta ni modifica nada; si dice que no pudo inspeccionar el diff, no es una aprobación.
- Presentar sus hallazgos tal cual y separar lo que se verificó de lo que no.
