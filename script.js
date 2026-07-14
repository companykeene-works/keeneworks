const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');
const navLinks = navigation?.querySelectorAll('a') ?? [];

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Otwórz menu');
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Otwórz menu' : 'Zamknij menu');
  navigation?.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -35px' },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const portfolioFrames = document.querySelectorAll('[data-preview-src]');
const loadPortfolioFrame = (frame) => {
  if (!frame.src) frame.src = frame.dataset.previewSrc;
};

if ('IntersectionObserver' in window) {
  const portfolioObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadPortfolioFrame(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '350px 0px', threshold: 0.01 },
  );
  portfolioFrames.forEach((frame) => portfolioObserver.observe(frame));
} else {
  portfolioFrames.forEach(loadPortfolioFrame);
}

const projectDialog = document.querySelector('[data-project-dialog]');
const projectFrame = projectDialog?.querySelector('[data-project-frame]');
const projectTitle = projectDialog?.querySelector('[data-project-dialog-title]');
const projectAddress = projectDialog?.querySelector('[data-project-address]');
const projectExternalLink = projectDialog?.querySelector('[data-project-external]');
const projectCloseButton = projectDialog?.querySelector('[data-project-close]');
let lastProjectTrigger = null;

const openProject = (trigger) => {
  const source = trigger.dataset.projectSrc;
  const title = trigger.dataset.projectTitle;
  if (!source || !title) return;

  if (!projectDialog?.showModal) {
    window.open(source, '_blank', 'noopener');
    return;
  }

  lastProjectTrigger = trigger;
  projectTitle.textContent = title;
  projectAddress.textContent = decodeURIComponent(source)
    .replace('keene portfolio/', '')
    .replace('/index.html', '');
  projectExternalLink.href = source;
  projectFrame.title = `Podgląd realizacji ${title}`;
  projectFrame.src = source;
  projectDialog.showModal();
  document.body.classList.add('preview-open');
};

document.querySelectorAll('[data-project-preview]').forEach((trigger) => {
  trigger.addEventListener('click', () => openProject(trigger));
});

projectCloseButton?.addEventListener('click', () => projectDialog.close());
projectDialog?.addEventListener('click', (event) => {
  if (event.target === projectDialog) projectDialog.close();
});
projectFrame?.addEventListener('load', () => {
  try {
    projectFrame.contentDocument?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && projectDialog.open) projectDialog.close();
    });
  } catch {
    // Podgląd może pochodzić z innej domeny po przyszłej rozbudowie portfolio.
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && projectDialog?.open) projectDialog.close();
});
projectDialog?.addEventListener('close', () => {
  document.body.classList.remove('preview-open');
  projectFrame.removeAttribute('src');
  lastProjectTrigger?.focus();
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const form = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input[required], textarea[required]')];

  fields.forEach((field) => field.classList.toggle('invalid', !field.checkValidity()));
  const firstInvalid = fields.find((field) => !field.checkValidity());
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent(`Zapytanie ze strony - ${data.get('service')}`);
  const body = encodeURIComponent(
    `Imię i nazwisko: ${data.get('name')}\nE-mail: ${data.get('email')}\nTemat: ${data.get('service')}\n\nWiadomość:\n${data.get('message')}`,
  );

  if (formStatus) {
    formStatus.textContent = 'Otwieramy Twój program pocztowy z gotową wiadomością…';
    formStatus.classList.add('visible');
  }
  window.location.href = `mailto:kontakt@keeneworks.pl?subject=${subject}&body=${body}`;
});

form?.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('input', () => {
    if (field.classList.contains('invalid')) {
      field.classList.toggle('invalid', !field.checkValidity());
    }
  });
});
