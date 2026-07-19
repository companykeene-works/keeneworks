const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.primary-nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.querySelector('.announcement-close')?.addEventListener('click', (event) => {
  event.currentTarget.closest('.announcement').remove();
});

const filterButtons = document.querySelectorAll('.filter-btn');
const roomCards = document.querySelectorAll('.room-card');
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  roomCards.forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.type !== filter));
}));

const reviews = [
  { quote: '\u201ePrzyjechali\u015bmy na dwie noce, zostali\u015bmy na pi\u0119\u0107. N\u00f3rda ma ten rzadki rodzaj spokoju, kt\u00f3rego nie da si\u0119 zaprojektowa\u0107 \u2014 mo\u017cna go tylko stworzy\u0107.\u201d', initials: 'AK', name: 'Anna & Kuba', meta: 'Warszawa · pokój Brzeg', date: 'wrzesień 2024' },
  { quote: '\u201eWszystko jest tu przemy\u015blane, ale nic nie sprawia wra\u017cenia wymuszonego. Najlepsze \u015bniadanie i najcichszy poranek od dawna.\u201d', initials: 'MK', name: 'Marta K.', meta: 'Kraków · pokój Bór', date: 'październik 2024' },
  { quote: '\u201eNórda daje dokładnie to, po co przyjechaliśmy: przestrzeń, światło i poczucie, że nigdzie nie trzeba się spieszyć.\u201d', initials: 'PW', name: 'Piotr & Wiktor', meta: 'Gdańsk · apartament Polana', date: 'listopad 2024' }
];
let reviewIndex = 0;
const reviewMain = document.querySelector('.review-main');
const reviewQuote = document.querySelector('#review-quote');
const reviewAvatar = document.querySelector('#review-avatar');
const reviewName = document.querySelector('#review-name');
const reviewMeta = document.querySelector('#review-meta');
const reviewDate = document.querySelector('#review-date');
const reviewProgressBar = document.querySelector('#review-progress-bar');
const reviewCount = document.querySelector('#review-count');

const renderReview = (nextIndex) => {
  reviewIndex = (nextIndex + reviews.length) % reviews.length;
  reviewMain.classList.add('is-switching');
  window.setTimeout(() => {
    const review = reviews[reviewIndex];
    reviewQuote.textContent = review.quote;
    reviewAvatar.textContent = review.initials;
    reviewName.textContent = review.name;
    reviewMeta.textContent = review.meta;
    reviewDate.textContent = review.date;
    reviewProgressBar.style.width = `${((reviewIndex + 1) / reviews.length) * 100}%`;
    reviewCount.textContent = `0${reviewIndex + 1} / 0${reviews.length}`;
    reviewMain.classList.remove('is-switching');
  }, 160);
};

document.querySelector('.review-prev')?.addEventListener('click', () => renderReview(reviewIndex - 1));
document.querySelector('.review-next')?.addEventListener('click', () => renderReview(reviewIndex + 1));

const modal = document.querySelector('#booking-modal');
const bookingForm = document.querySelector('#booking-form');
const modalSummary = document.querySelector('#modal-summary');
const openModal = () => { modal.hidden = false; document.body.style.overflow = 'hidden'; modal.querySelector('.modal-close').focus(); };
const closeModal = () => { modal.hidden = true; document.body.style.overflow = ''; };
document.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const checkin = data.get('checkin');
  const checkout = data.get('checkout');
  if (checkin && checkout && checkin >= checkout) { alert('Data wyjazdu powinna być późniejsza niż data przyjazdu.'); return; }
  const formatDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' }) : '';
  modalSummary.textContent = `Dla ${data.get('guests')} · ${formatDate(checkin)} – ${formatDate(checkout)}. Zostały nam ostatnie wolne terminy tej jesieni.`;
  openModal();
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });

const newsletter = document.querySelector('.newsletter-form');
newsletter?.addEventListener('submit', (event) => { event.preventDefault(); newsletter.querySelector('button').textContent = '✓'; newsletter.querySelector('input').value = ''; newsletter.querySelector('input').placeholder = 'Dziękujemy za zapis!'; });

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), { threshold: 0.1 });
  document.querySelectorAll('.section, .closing-cta').forEach((el) => { el.classList.add('reveal'); revealObserver.observe(el); });
}
