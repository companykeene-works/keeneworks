const cart = new Map();
const cartDrawer = document.querySelector(".cart-drawer");
const backdrop = document.querySelector(".drawer-backdrop");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartFooter = document.querySelector("#cart-footer");
const cartTotal = document.querySelector("#cart-total");
const toast = document.querySelector(".toast");
let lastFocused;
let toastTimer;

const formatPrice = value => `${value} zł`;

function getCartSummary() {
  let count = 0;
  let total = 0;
  cart.forEach(item => {
    count += item.quantity;
    total += item.price * item.quantity;
  });
  return { count, total };
}

function renderCart() {
  const { count, total } = getCartSummary();
  document.querySelectorAll("[data-cart-count]").forEach(element => element.textContent = count);
  document.querySelector("[data-mobile-total]").textContent = formatPrice(total);
  cartEmpty.hidden = count > 0;
  cartItems.hidden = count === 0;
  cartFooter.hidden = count === 0;
  cartTotal.textContent = formatPrice(total);
  cartItems.innerHTML = [...cart.entries()].map(([name, item]) => `
    <article class="cart-row">
      <h3>${name}</h3>
      <strong>${formatPrice(item.price * item.quantity)}</strong>
      <div class="cart-controls" aria-label="Liczba: ${item.quantity}">
        <button type="button" data-cart-name="${name}" data-delta="-1" aria-label="Usuń jedną ${name}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-cart-name="${name}" data-delta="1" aria-label="Dodaj jedną ${name}">+</button>
      </div>
    </article>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2100);
}

function addItem(name, price) {
  const current = cart.get(name);
  cart.set(name, { price, quantity: current ? current.quantity + 1 : 1 });
  renderCart();
  showToast(`${name} dodana do zamówienia`);
}

function changeQuantity(name, delta) {
  const item = cart.get(name);
  if (!item) return;
  const quantity = item.quantity + delta;
  if (quantity <= 0) cart.delete(name);
  else cart.set(name, { ...item, quantity });
  renderCart();
}

function openCart() {
  lastFocused = document.activeElement;
  cartDrawer.classList.add("is-open");
  backdrop.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  setTimeout(() => cartDrawer.querySelector("[data-drawer-close]").focus(), 80);
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  backdrop.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  lastFocused?.focus();
}

document.querySelectorAll("[data-add-item]").forEach(button => {
  button.addEventListener("click", () => addItem(button.dataset.name, Number(button.dataset.price)));
});

cartItems.addEventListener("click", event => {
  const control = event.target.closest("[data-cart-name]");
  if (control) changeQuantity(control.dataset.cartName, Number(control.dataset.delta));
});

document.querySelectorAll("[data-open-cart]").forEach(button => button.addEventListener("click", openCart));
document.querySelectorAll("[data-drawer-close]").forEach(button => button.addEventListener("click", closeCart));
backdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) closeCart();
});

document.querySelector("#checkout").addEventListener("click", () => {
  showToast("To wersja demonstracyjna — koszyk działa lokalnie");
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mainNav.classList.toggle("is-open", !isOpen);
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("is-open");
}));

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 40), { passive: true });

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px" })
  : null;

document.documentElement.classList.add("js");
if (revealObserver) revealElements.forEach(element => revealObserver.observe(element));
else revealElements.forEach(element => element.classList.add("is-visible"));

const categoryLinks = [...document.querySelectorAll(".category-nav a")];
const menuSections = document.querySelectorAll("[data-menu-section]");
if ("IntersectionObserver" in window) {
  const categoryObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    categoryLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
  }, { rootMargin: "-30% 0px -60%", threshold: [0, .15, .5] });
  menuSections.forEach(section => categoryObserver.observe(section));
}

renderCart();
