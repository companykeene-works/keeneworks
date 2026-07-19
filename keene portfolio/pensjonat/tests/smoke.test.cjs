const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert(ids.length === new Set(ids).size, 'HTML contains duplicate IDs');
assert((html.match(/class="amenity-icon"/g) || []).length === 3, 'Expected three experience icons');
assert((html.match(/aria-label="Nórda na (Instagramie|Facebooku)"/g) || []).length === 2, 'Expected Instagram and Facebook links');

const assetRefs = [...html.matchAll(/(?:src|href)="((?:assets|styles|motion|refinement|script)[^"]+)"/g)].map((match) => match[1]);
for (const ref of assetRefs) assert(fs.existsSync(path.join(root, ref)), `Missing local resource: ${ref}`);

const handlers = new Map();
const makeElement = (selector) => ({
  selector,
  textContent: '',
  value: '',
  placeholder: '',
  style: {},
  hidden: true,
  classList: { add() {}, remove() {}, toggle() { return false; } },
  addEventListener(type, callback) { handlers.set(`${selector}:${type}`, callback); },
  setAttribute() {},
  focus() {},
  querySelector() { return makeElement(`${selector} child`); },
  closest() { return makeElement(`${selector} parent`); }
});

const elements = new Map([
  ['.review-main', makeElement('.review-main')],
  ['#review-quote', makeElement('#review-quote')],
  ['#review-avatar', makeElement('#review-avatar')],
  ['#review-name', makeElement('#review-name')],
  ['#review-meta', makeElement('#review-meta')],
  ['#review-date', makeElement('#review-date')],
  ['#review-progress-bar', makeElement('#review-progress-bar')],
  ['#review-count', makeElement('#review-count')],
  ['.review-prev', makeElement('.review-prev')],
  ['.review-next', makeElement('.review-next')]
]);

const context = {
  console,
  FormData: class {},
  IntersectionObserver: class {},
  alert() {},
  document: {
    body: { style: {} },
    querySelector: (selector) => elements.get(selector) || null,
    querySelectorAll: () => [],
    addEventListener() {}
  },
  window: {
    setTimeout: (callback) => callback(),
    matchMedia: () => ({ matches: true })
  }
};

vm.createContext(context);
vm.runInContext(script, context);

const click = (selector) => {
  const handler = handlers.get(`${selector}:click`);
  assert(handler, `Missing click handler for ${selector}`);
  handler();
};

click('.review-prev');
assert(elements.get('#review-count').textContent === '03 / 03', 'Previous arrow does not wrap to the last review');
assert(elements.get('#review-progress-bar').style.width === '100%', 'Progress bar is incorrect for the last review');

click('.review-next');
assert(elements.get('#review-count').textContent === '01 / 03', 'Next arrow does not return to the first review');

click('.review-next');
assert(elements.get('#review-count').textContent === '02 / 03', 'Next arrow does not advance to the second review');
assert(elements.get('#review-name').textContent === 'Marta K.', 'Review author was not updated');

console.log('Smoke test passed: icons, assets, unique IDs and review carousel.');
