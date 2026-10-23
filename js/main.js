// ---------- Slider ----------
const slides = document.querySelectorAll('.slide');
const dotsBox = document.getElementById('dots');
let current = 0;
let timer;

slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
  b.addEventListener('click', () => { show(i); restart(); });
  dotsBox.appendChild(b);
});
const dots = dotsBox.querySelectorAll('button');

function show(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}
function restart() {
  clearInterval(timer);
  timer = setInterval(() => show(current + 1), 6000);
}

document.getElementById('next').addEventListener('click', () => { show(current + 1); restart(); });
document.getElementById('prev').addEventListener('click', () => { show(current - 1); restart(); });
dots[0].classList.add('active');
restart();

// Deslizar con el dedo en móvil
let startX = 0;
const hero = document.getElementById('inicio');
hero.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
hero.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) { show(current + (dx < 0 ? 1 : -1)); restart(); }
});

// ---------- Header al hacer scroll ----------
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ---------- Menú móvil ----------
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  burger.classList.remove('open');
}));

// ---------- Modal de la carta ----------
const modal = document.getElementById('modal');
function toggleModal(open) {
  modal.classList.toggle('open', open);
  modal.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
}
document.querySelectorAll('[data-open-carta]').forEach(el =>
  el.addEventListener('click', e => { e.preventDefault(); toggleModal(true); })
);
document.getElementById('modalClose').addEventListener('click', () => toggleModal(false));
modal.addEventListener('click', e => { if (e.target === modal) toggleModal(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleModal(false); });

// ---------- Aparecer al hacer scroll ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Reserva por WhatsApp ----------
// CAMBIA AQUÍ el número del restaurante (código de país + número, sin + ni espacios). Ej: 51987654321
const WHATSAPP = '51000000000';

const form = document.getElementById('reservaForm');
const fecha = document.getElementById('fecha');
fecha.min = new Date().toISOString().split('T')[0];

form.addEventListener('submit', e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const err = document.getElementById('formError');
  if (!v('nombre') || !v('telefono') || !v('fecha')) {
    err.textContent = 'Completa tu nombre, teléfono y la fecha.';
    return;
  }
  err.textContent = '';
  const [y, m, d] = v('fecha').split('-');
  const personas = v('personas');
  const msg =
    `Hola, quiero reservar una mesa en San Isidro La Espiga.\n` +
    `Nombre: ${v('nombre')}\nTeléfono: ${v('telefono')}\n` +
    `Personas: ${personas}\nFecha: ${d}/${m}/${y}\nHora: ${v('hora')}` +
    (v('notas') ? `\nPedidos especiales: ${v('notas')}` : '');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});

// ---------- Año del footer ----------
document.getElementById('year').textContent = new Date().getFullYear();
