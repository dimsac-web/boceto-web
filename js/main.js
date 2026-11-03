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
