// Verificación básica offline para DIMSAC DENT. Sin paquetes externos.
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(root, "index.html"), "utf8");
const errors = [];
let checked = 0;

// Comprobar solo referencias locales <script src> y <link rel="stylesheet" href>.
// Esto NO verifica CSS visualmente ni el comportamiento de los botones.
for (const matchTag of html.matchAll(/<(?:script|link)\b[^>]*>/gi)) {
  const tag = matchTag[0];
  const script = /^<script\b/i.test(tag);
  if (!script && !/\brel\s*=\s*(["'])stylesheet\1/i.test(tag)) continue;
  const match = tag.match(script
    ? /\bsrc\s*=\s*(["'])(.*?)\1/i
    : /\bhref\s*=\s*(["'])(.*?)\1/i);
  const url = match?.[2];
  if (!url || /^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(url)) continue;
  const relative = url.split(/[?#]/)[0].replace(/^\/+/, "");
  if (!relative) continue;
  let decoded;
  try { decoded = decodeURIComponent(relative); }
  catch { errors.push("Ruta con codificación inválida: " + url); continue; }
  const file = resolve(root, decoded);
  if (file !== root && !file.startsWith(root + sep)) {
    errors.push("Ruta fuera del proyecto: " + url);
    continue;
  }
  checked++;
  if (!existsSync(file)) errors.push("Falta el archivo: " + url);
}
if (errors.length > 0) {
  errors.forEach(error => console.error("ERROR: " + error));
  process.exitCode = 1;
} else {
  console.log("OK: " + checked + " recursos locales JS/CSS comprobados.");
}
