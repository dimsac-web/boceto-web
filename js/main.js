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
      const img = el.querySelector('img');
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
