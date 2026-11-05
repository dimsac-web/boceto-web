// La página abre arriba, salvo que el enlace traiga una sección válida (ej. /#precios): entonces va a esa sección.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
(function () {
  const subir = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  const destino = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    return id ? document.getElementById(id) : null;
  };
  const ir = () => {
    const el = destino();
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    else subir();
  };
  if (location.hash && !destino()) history.replaceState(null, '', location.pathname + location.search);
  ir();
  window.addEventListener('load', ir, { once: true });
  window.addEventListener('pageshow', (e) => { if (e.persisted) ir(); });
})();

// Menú móvil
const boton = document.getElementById('menuBoton');
const menu = document.getElementById('menu');
boton.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierto');
  boton.setAttribute('aria-expanded', abierto);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('abierto');
  boton.setAttribute('aria-expanded', 'false');
}));

// Año del pie
document.getElementById('anio').textContent = new Date().getFullYear();

// Recorrido por el local: las fotos se funden y se acercan despacio mientras se baja la página.
// Si la persona pidió "reducir movimiento" en su dispositivo, no se activa y las fotos quedan fijas, una debajo de otra.
(function () {
  const rec = document.getElementById('recorrido');
  if (!rec || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  rec.classList.add('recorrido--anim');
  const cab = document.querySelector('.cabecera');
  const escenario = rec.querySelector('.recorrido__escenario');
  const escenas = Array.from(rec.querySelectorAll('.escena'));
  const puntos = Array.from(rec.querySelectorAll('.recorrido__puntos i'));
  const N = escenas.length;
  const limitar = (v, a, b) => Math.min(b, Math.max(a, v));
  let pendiente = false;

  function medir() {
    document.documentElement.style.setProperty('--cab', cab.offsetHeight + 'px');
  }

  function pintar() {
    pendiente = false;
    const cabAlto = cab.offsetHeight;
    const total = rec.offsetHeight - escenario.offsetHeight;
    const p = total > 0 ? limitar((cabAlto - rec.getBoundingClientRect().top) / total, 0, 1) : 0;
    const t = p * (N - 0.35); // posición en "escenas"

    escenas.forEach((el, i) => {
      const img = el.querySelector('img:not(.escena__fondo)');
      const opac = i === 0 ? 1 : limitar((t - i + 0.3) / 0.3, 0, 1);
      const s = limitar((t - (i - 0.3)) / 1.5, 0, 1);
      const dir = i % 2 ? -1 : 1;
      const x = dir * (s - 0.5) * 3;
      const y = -(s - 0.5) * 2;
      img.style.transform = 'translate3d(' + x + '%,' + y + '%,0) scale(' + (1.05 + 0.12 * s) + ')';

      const d = Math.abs(t - (i + 0.5));
      let cap = limitar((0.45 - d) / 0.2, 0, 1);
      if (i === 0 && t < 0.5) cap = 1;
      el.style.setProperty('--cap', cap);

      el.style.opacity = opac;
      el.style.visibility = (opac === 0 || t > i + 1.05) ? 'hidden' : 'visible';
    });

    const activo = limitar(Math.floor(t + 0.3), 0, N - 1);
    puntos.forEach((pt, i) => pt.classList.toggle('activo', i === activo));
  }

  function pedir() {
    if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); }
  }

  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', () => { medir(); pedir(); });
  medir();
  pintar();
})();

// Onda al presionar botones
document.addEventListener('pointerdown', (e) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const b = e.target.closest('.boton, .menu-boton');
  if (!b) return;
  const r = b.getBoundingClientRect();
  const o = document.createElement('span');
  o.className = 'onda';
  o.style.left = (e.clientX - r.left) + 'px';
  o.style.top = (e.clientY - r.top) + 'px';
  b.appendChild(o);
  o.addEventListener('animationend', () => o.remove());
});

// Aparición suave de las secciones al bajar
(function () {
  const items = Array.from(document.querySelectorAll('.revelar'));
  if (!items.length) return;
  const mostrar = (el) => el.classList.add('visto');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(mostrar); return;
  }
  items.forEach((el) => {
    const hermanos = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.classList.contains('revelar')) : [];
    el.style.setProperty('--d', (Math.max(0, hermanos.indexOf(el)) * 0.1) + 's');
  });
  const obs = new IntersectionObserver((lista) => {
    lista.forEach((it) => { if (it.isIntersecting) { mostrar(it.target); obs.unobserve(it.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => obs.observe(el));
})();

// Burbuja de WhatsApp: aparece a los 5 s, se queda 8 s, se oculta y vuelve cada 25 s.
// Si la persona la cierra, no vuelve a salir mientras siga en la página (ni al recargar en la misma pestaña).
(function () {
  const burbuja = document.getElementById('waBurbuja');
  const cerrar = document.getElementById('waCerrar');
  if (!burbuja || !cerrar) return;
  let cerrada = false;
  try { cerrada = sessionStorage.getItem('waBurbujaCerrada') === '1'; } catch (e) {}
  if (cerrada) return;
  let tOcultar, tMostrar;
  const ocultar = () => { burbuja.classList.remove('visible'); };
  const mostrar = () => {
    if (cerrada) return;
    burbuja.classList.add('visible');
    tOcultar = setTimeout(ocultar, 8000);
    tMostrar = setTimeout(mostrar, 8000 + 25000);
  };
  tMostrar = setTimeout(mostrar, 5000);
  cerrar.addEventListener('click', () => {
    cerrada = true; ocultar(); clearTimeout(tOcultar); clearTimeout(tMostrar);
    try { sessionStorage.setItem('waBurbujaCerrada', '1'); } catch (e) {}
  });
  // Mientras la persona tiene el cursor o el foco en la burbuja, no se oculta
  ['mouseenter', 'focusin'].forEach(ev => burbuja.addEventListener(ev, () => clearTimeout(tOcultar)));
  ['mouseleave', 'focusout'].forEach(ev => burbuja.addEventListener(ev, () => { clearTimeout(tOcultar); tOcultar = setTimeout(ocultar, 3000); }));
})();

// Tocar cualquier parte de una fila de precios abre WhatsApp con el mensaje de ese estudio.
document.addEventListener('click', (e) => {
  const fila = e.target.closest('.fila-wa');
  if (!fila || e.target.closest('a')) return;
  const enlace = fila.querySelector('a');
  if (enlace) enlace.click();
});

// Radiografías de ejemplo: imágenes de libre uso de Wikimedia Commons (no son pacientes de Dimsac Dent).
(function () {
  const visor = document.getElementById('visor');
  if (!visor || typeof visor.showModal !== 'function') {
    document.querySelectorAll('.ver-ejemplo').forEach(b => b.hidden = true);
    return;
  }
  const fp = (archivo) => 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(archivo) + '?width=1000';
  const pag = (archivo) => 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(archivo.replace(/ /g, '_'));
  const LIC = {
    'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/deed.es',
    'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/deed.es',
    'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/deed.es',
    'CC0': 'https://creativecommons.org/publicdomain/zero/1.0/deed.es'
  };
  const EJ = {
    periapical: { t: 'Radiografía periapical', f: 'Periapical radiolucency.jpg', a: 'Shaimaa Abdellatif', l: 'CC BY-SA 4.0',
      d: 'Muestra 2 o 3 dientes completos, desde la corona hasta la raíz. Sirve para ver caries, infecciones en la raíz y tratamientos de conducto.' },
    oclusal: { t: 'Radiografía oclusal', f: 'Occlusal view symphsis fracture.jpg', a: 'Coronation Dental Specialty Group', l: 'CC BY 3.0',
      d: 'Se toma con la placa entre los dientes y muestra el piso o el techo de la boca. Sirve para ver dientes retenidos, fracturas o cálculos.' },
    panoramica: { t: 'Radiografía panorámica', f: 'Basic panoramic radiograph.jpg', a: 'Coronation Dental Specialty Group', l: 'CC BY 3.0',
      d: 'Muestra todos los dientes y los dos maxilares en una sola imagen. Sirve para ver muelas del juicio, dientes que no salen y el estado general de la boca.' },
    lateral: { t: 'Telerradiografía lateral (cefalometría)', f: 'Cephalometric radiograph.JPG', a: 'ANUG', l: 'CC BY-SA 4.0',
      d: 'Muestra el cráneo y la cara de perfil. La piden los ortodoncistas para planificar brackets; sobre ella se hacen los análisis cefalométricos (Steiner, Ricketts y otros).' },
    waters: { t: 'Radiografía de Waters (senos maxilares)', f: 'Paranasal sinuses radiograph occipitomental projection.jpg', a: 'Ptrump16', l: 'CC BY-SA 4.0',
      d: 'Vista de frente, con la cabeza inclinada. Sirve para ver los senos maxilares, por ejemplo cuando hay sinusitis.' },
    carpal: { t: 'Radiografía carpal (edad ósea)', f: 'X-ray of a hand before automatic bone age calculation.jpg', a: 'Mikael Häggström', l: 'CC0',
      d: 'Radiografía de la mano y la muñeca. Sirve para calcular la edad ósea y saber cuánto crecimiento le queda a un niño o adolescente.' },
    tomografia: { t: 'Tomografía 3D (Cone Beam)', f: 'Jaw lesions - Idiopathic osteosclerosis - Cone beam CT.jpg', a: 'B. S. F. Silva, M. R. Bueno, F. P. Yamamoto-Silva, R. S. S. Gomez, O. A. Peters y C. Estrela', l: 'CC BY 4.0',
      d: 'Imagen en 3D, en cortes, de los dientes y el hueso. Sirve para planificar implantes, ubicar dientes retenidos y ver lesiones con mucho detalle.' }
  };
  const $ = (id) => document.getElementById(id);
  let origen = null;
  function abrir(k, boton) {
    const e = EJ[k]; if (!e) return;
    origen = boton;
    $('visorTitulo').textContent = e.t;
    $('visorImg').src = fp(e.f);
    $('visorImg').alt = 'Ejemplo de ' + e.t.toLowerCase();
    $('visorTexto').textContent = e.d;
    $('visorCredito').innerHTML = 'Imagen de ejemplo, no corresponde a un paciente de Dimsac Dent. Autor: ' + e.a +
      ' · Licencia <a href="' + LIC[e.l] + '" target="_blank" rel="noopener">' + e.l + '</a> · vía <a href="' + pag(e.f) + '" target="_blank" rel="noopener">Wikimedia Commons</a>.';
    $('visorWa').href = 'https://wa.me/51947707736?text=' + encodeURIComponent('Hola, quiero consultar por: ' + e.t + '. ¿Qué horarios tienen disponibles?');
    visor.showModal();
  }
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('.ver-ejemplo');
    if (!b) return;
    ev.preventDefault(); ev.stopPropagation();
    abrir(b.dataset.ejemplo, b);
  }, true);
  $('visorCerrar').addEventListener('click', () => visor.close());
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && visor.open) visor.close(); });
  visor.addEventListener('click', (ev) => { if (ev.target === visor) visor.close(); });
  visor.addEventListener('close', () => { $('visorImg').src = ''; if (origen) origen.focus(); });
})();

// El botón y la burbuja de WhatsApp se ocultan mientras se ve la lista de precios, para no tapar importes.
(function () {
  const precios = document.getElementById('precios');
  if (!precios || !('IntersectionObserver' in window)) return;
  new IntersectionObserver((lista) => {
    document.body.classList.toggle('en-precios', lista[lista.length - 1].isIntersecting);
  }).observe(precios);
})();
