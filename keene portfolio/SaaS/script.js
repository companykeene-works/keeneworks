const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
});

navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach((item) => revealObserver.observe(item));

const countItems = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const start = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
countItems.forEach((item) => countObserver.observe(item));

const stories = [...document.querySelectorAll('.story')];
const storyDots = [...document.querySelectorAll('.story-dots button')];
let storyIndex = 0;

function showStory(index) {
  storyIndex = (index + stories.length) % stories.length;
  stories.forEach((story, i) => story.classList.toggle('active', i === storyIndex));
  storyDots.forEach((dot, i) => dot.classList.toggle('active', i === storyIndex));
}

document.querySelector('.story-prev')?.addEventListener('click', () => showStory(storyIndex - 1));
document.querySelector('.story-next')?.addEventListener('click', () => showStory(storyIndex + 1));
storyDots.forEach((dot, i) => dot.addEventListener('click', () => showStory(i)));

function wireDialog(dialog, triggers) {
  if (!dialog) return;
  triggers.forEach((trigger) => trigger.addEventListener('click', () => dialog.showModal()));
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

const signupDialog = document.querySelector('#signup-dialog');
const demoDialog = document.querySelector('#demo-dialog');
wireDialog(signupDialog, document.querySelectorAll('.trial-trigger'));
wireDialog(demoDialog, document.querySelectorAll('.demo-trigger'));

document.querySelector('#trial-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  signupDialog.querySelector('[data-step="form"]').classList.remove('active');
  signupDialog.querySelector('[data-step="success"]').classList.add('active');
});

document.querySelector('.dialog-finish')?.addEventListener('click', () => {
  signupDialog.close();
  setTimeout(() => {
    signupDialog.querySelector('[data-step="success"]').classList.remove('active');
    signupDialog.querySelector('[data-step="form"]').classList.add('active');
    document.querySelector('#trial-form').reset();
  }, 250);
});

const heroVisual = document.querySelector('.hero-visual');
const appWindow = document.querySelector('.app-window');
if (heroVisual && appWindow && matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVisual.addEventListener('pointermove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    appWindow.style.transform = `rotateY(${x * 5 - 4}deg) rotateX(${-y * 4 + 2}deg) translate3d(0, 0, 0)`;
  });
  heroVisual.addEventListener('pointerleave', () => {
    appWindow.style.transform = 'rotateY(-4deg) rotateX(2deg)';
  });
}
