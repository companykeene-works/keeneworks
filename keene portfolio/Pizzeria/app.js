document.documentElement.classList.add("js");

const menu = {
  rosse: [
    { id: "margherita", name: "Margherita DOP", ingredients: "San Marzano DOP, fior di latte, parmigiano, bazylia, oliwa EVO", price: 36, badge: "klasyk" },
    { id: "diavola", name: "Diavola del Sud", ingredients: "San Marzano DOP, fior di latte, spianata piccante, miód chilli, oregano", price: 44, badge: "pikantna" },
    { id: "nduja", name: "Fuoco Calabrese", ingredients: "San Marzano DOP, 'nduja, papryka corno, provola affumicata, czerwona cebula", price: 47 },
    { id: "napoli", name: "Napoli 2.0", ingredients: "San Marzano DOP, anchois z Cetary, kapary, czosnek, oliwki taggiasche", price: 45 },
    { id: "marinara", name: "Marinara Antica", ingredients: "San Marzano DOP, czosnek confit, oregano sycylijskie, oliwa EVO", price: 31, badge: "vegan" }
  ],
  bianche: [
    { id: "mortadella", name: "Mortadella e Pistacchio", ingredients: "Fior di latte, mortadella IGP, burrata, pistacje z Bronte, skórka cytryny", price: 49, badge: "bestseller" },
    { id: "bosco", name: "Passeggiata nel Bosco", ingredients: "Crema di funghi, taleggio, boczniak królewski, szałwia, parmigiano", price: 46, badge: "vege" },
    { id: "patate", name: "Patate & Rosmarino", ingredients: "Fior di latte, ziemniaki, pancetta, rozmaryn, pecorino romano", price: 44 },
    { id: "limone", name: "Limone", ingredients: "Ricotta, fior di latte, cukinia, cytryna, mięta, prażony migdał", price: 43, badge: "vege" },
    { id: "quattro", name: "Quattro Formaggi", ingredients: "Fior di latte, gorgonzola dolce, taleggio, parmigiano, gruszka", price: 47, badge: "vege" }
  ],
  piccoli: [
    { id: "focaccia", name: "Focaccia al Forno", ingredients: "Oliwa EVO, rozmaryn, sól Maldon — dobra do dzielenia", price: 21, badge: "vegan" },
    { id: "burrata", name: "Burrata Pugliese", ingredients: "Pomidory sezonowe, pesto z bazylii, oliwa cytrynowa, focaccia", price: 34, badge: "vege" },
    { id: "olive", name: "Olive Calde", ingredients: "Ciepłe oliwki, skórka pomarańczy, chilli, zioła", price: 18, badge: "vegan" },
    { id: "tiramisu", name: "Tiramisù della Casa", ingredients: "Mascarpone, espresso, marsala, kakao", price: 24 },
    { id: "panna-cotta", name: "Panna Cotta", ingredients: "Wanilia, palone masło, wiśnie amarena", price: 23 }
  ]
};

const allItems = Object.values(menu).flat();
const state = { category: "rosse", cart: new Map() };
const list = document.querySelector("#menu-list");
const cartDrawer = document.querySelector(".cart-drawer");
const backdrop = document.querySelector(".drawer-backdrop");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartFooter = document.querySelector("#cart-footer");
const cartTotal = document.querySelector("#cart-total");
const toast = document.querySelector(".toast");
let toastTimer;
let lastFocused;

function formatPrice(price) {
  return `${price} zł`;
}

function renderMenu(category = state.category) {
  state.category = category;
  list.innerHTML = menu[category].map(item => `
    <article class="menu-item">
      <div class="menu-item__title">
        <h3>${item.name}</h3>
        ${item.badge ? `<span class="menu-item__badge">${item.badge}</span>` : ""}
      </div>
      <p>${item.ingredients}</p>
      <div class="menu-item__side">
        <span class="menu-item__price">${formatPrice(item.price)}</span>
        <button class="menu-item__add" type="button" data-add="${item.id}" aria-label="Dodaj ${item.name} do zamówienia">+</button>
      </div>
    </article>
  `).join("");
}

function cartSummary() {
  let count = 0;
  let total = 0;
  state.cart.forEach((quantity, id) => {
    const item = allItems.find(entry => entry.id === id);
    count += quantity;
    total += item.price * quantity;
  });
  return { count, total };
}

function renderCart() {
  const { count, total } = cartSummary();
  document.querySelectorAll("[data-cart-count]").forEach(el => el.textContent = count);
  document.querySelector("[data-mobile-total]").textContent = formatPrice(total);
  cartEmpty.hidden = count > 0;
  cartItems.hidden = count === 0;
  cartFooter.hidden = count === 0;
  cartTotal.textContent = formatPrice(total);
  cartItems.innerHTML = [...state.cart.entries()].map(([id, quantity]) => {
    const item = allItems.find(entry => entry.id === id);
    return `
      <article class="cart-row">
        <h3>${item.name}</h3>
        <strong>${formatPrice(item.price * quantity)}</strong>
        <div class="cart-controls" aria-label="Liczba: ${quantity}">
          <button type="button" data-decrease="${id}" aria-label="Usuń jedną ${item.name}">−</button>
          <span>${quantity}</span>
          <button type="button" data-increase="${id}" aria-label="Dodaj jedną ${item.name}">+</button>
        </div>
      </article>
    `;
  }).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function addToCart(id) {
  const item = allItems.find(entry => entry.id === id);
  state.cart.set(id, (state.cart.get(id) || 0) + 1);
  renderCart();
  showToast(`${item.name} dodana do zamówienia`);
}

function changeQuantity(id, amount) {
  const next = (state.cart.get(id) || 0) + amount;
  if (next <= 0) state.cart.delete(id);
  else state.cart.set(id, next);
  renderCart();
}

function openCart() {
  lastFocused = document.activeElement;
  cartDrawer.classList.add("is-open");
  backdrop.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  window.setTimeout(() => cartDrawer.querySelector("[data-close-cart]").focus(), 100);
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  backdrop.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  lastFocused?.focus();
}

document.querySelectorAll("[data-category]").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("[data-category]").forEach(button => button.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
    renderMenu(tab.dataset.category);
  });
});

list.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

cartItems.addEventListener("click", event => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  if (increase) changeQuantity(increase.dataset.increase, 1);
  if (decrease) changeQuantity(decrease.dataset.decrease, -1);
});

document.querySelectorAll("[data-open-cart]").forEach(button => button.addEventListener("click", openCart));
document.querySelectorAll("[data-close-cart]").forEach(button => button.addEventListener("click", closeCart));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) closeCart();
});

document.querySelector("#checkout").addEventListener("click", () => {
  showToast("To wersja demonstracyjna — koszyk działa lokalnie");
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
}));

const bookingForm = document.querySelector("#booking-form");
const dateInput = document.querySelector("#date");
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
dateInput.min = localToday;
bookingForm.addEventListener("submit", event => {
  event.preventDefault();
  bookingForm.querySelector(".form-success").hidden = false;
  bookingForm.querySelector("button[type='submit']").textContent = "Zapytanie wysłane ✓";
});

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 40), { passive: true });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px" });

document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
renderMenu();
renderCart();
