// Local storage names used by the website.
const CART_KEY = "toyHavenCart";
const WISHLIST_KEY = "toyHavenWishlist";
const NEWSLETTER_KEY = "toyHavenNewsletter";
const FEEDBACK_KEY = "toyHavenFeedback";
const ORDER_KEY = "toyHavenOrders";

// Read an array from localStorage.
function readStorage(key) {
  const savedData = localStorage.getItem(key);

  if (savedData === null) {
    return [];
  }

  try {
    return JSON.parse(savedData);
  } catch (error) {
    return [];
  }
}

// Save an array in localStorage.
function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCart() {
  return readStorage(CART_KEY);
}

function saveCart(cart) {
  saveStorage(CART_KEY, cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  let itemCount = 0;

  for (let i = 0; i < cart.length; i++) {
    itemCount += cart[i].quantity;
  }

  const counters = document.querySelectorAll(".cart-count");

  for (let i = 0; i < counters.length; i++) {
    counters[i].textContent = itemCount;
  }
}

function addToCart(productId) {
  const cart = getCart();
  let itemFound = false;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === Number(productId)) {
      cart[i].quantity += 1;
      itemFound = true;
    }
  }

  if (itemFound === false) {
    cart.push({
      id: Number(productId),
      quantity: 1
    });
  }

  saveCart(cart);
}

function getWishlist() {
  return readStorage(WISHLIST_KEY);
}

function saveWishlist(wishlist) {
  saveStorage(WISHLIST_KEY, wishlist);
}

function addToWishlist(productId) {
  const wishlist = getWishlist();

  for (let i = 0; i < wishlist.length; i++) {
    if (wishlist[i].id === Number(productId)) {
      return;
    }
  }

  wishlist.push({
    id: Number(productId),
    status: "Interested"
  });

  saveWishlist(wishlist);
}

// Mobile navigation.
function setupNavigation() {
  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector(".nav-links");

  if (menuButton === null || navigation === null) {
    return;
  }

  menuButton.addEventListener("click", function () {
    navigation.classList.toggle("open");
    menuButton.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");
    menuButton.setAttribute("aria-expanded", isOpen);
  });
}

// Home page promotional slider.
function setupSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const buttons = document.querySelectorAll(".slider-dot");

  if (slides.length === 0) {
    return;
  }

  let currentSlide = 0;

  function showSlide(slideNumber) {
    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove("active");
      buttons[i].classList.remove("active");
    }

    currentSlide = slideNumber;
    slides[currentSlide].classList.add("active");
    buttons[currentSlide].classList.add("active");
  }

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      showSlide(i);
    });
  }

  setInterval(function () {
    let nextSlide = currentSlide + 1;

    if (nextSlide === slides.length) {
      nextSlide = 0;
    }

    showSlide(nextSlide);
  }, 5000);
}

// Featured product shown on the home page.
function showFeaturedProduct() {
  const featuredArea = document.querySelector("#featured-product");

  if (featuredArea === null) {
    return;
  }

  const dayNumber = new Date().getDate();
  const product = PRODUCTS[dayNumber % PRODUCTS.length];

  featuredArea.innerHTML = `
    <article class="feature-layout reveal">
      <img src="${product.image}" alt="${product.name}">
      <div class="feature-copy">
        <p class="eyebrow">${product.categoryLabel}</p>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">${formatMoney(product.price)}</p>
        <div class="button-row">
          <button class="primary-button featured-cart" type="button">Add to Cart</button>
          <a class="secondary-button" href="products.html">View Products</a>
        </div>
      </div>
    </article>
  `;

  const cartButton = featuredArea.querySelector(".featured-cart");

  cartButton.addEventListener("click", function () {
    addToCart(product.id);
    cartButton.textContent = "Added";
  });
}

function setupNewsletter() {
  const form = document.querySelector("#newsletter-form");

  if (form === null) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput = document.querySelector("#newsletter-email");
    const message = document.querySelector("#newsletter-message");

    if (emailInput.validity.valid === false) {
      message.textContent = "Please enter a valid email address.";
      message.className = "form-message error";
      return;
    }

    const emails = readStorage(NEWSLETTER_KEY);
    emails.push(emailInput.value.trim());
    saveStorage(NEWSLETTER_KEY, emails);

    message.textContent = "Thank you for subscribing.";
    message.className = "form-message success";
    form.reset();
  });
}

// Create one product card.
function createProductCard(product) {
  return `
    <article class="product-card reveal">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-body">
        <p class="product-meta">${product.categoryLabel}</p>
        <h2>${product.name}</h2>
        <p class="price">${formatMoney(product.price)}</p>
        <div class="product-actions">
          <button class="primary-button add-cart" type="button" data-id="${product.id}">Add to Cart</button>
          <button class="secondary-button view-product" type="button" data-id="${product.id}">Details</button>
          <button class="text-button add-wishlist" type="button" data-id="${product.id}">Add to Wishlist</button>
        </div>
      </div>
    </article>
  `;
}

function showProducts(productList) {
  const productGrid = document.querySelector("#product-grid");

  if (productGrid === null) {
    return;
  }

  if (productList.length === 0) {
    productGrid.innerHTML = '<p class="empty-state">No products match your search.</p>';
    return;
  }

  let productHtml = "";

  for (let i = 0; i < productList.length; i++) {
    productHtml += createProductCard(productList[i]);
  }

  productGrid.innerHTML = productHtml;
  setupProductButtons();
  setupReveal();
}

function filterProducts() {
  const searchInput = document.querySelector("#product-search");
  const categorySelect = document.querySelector("#category-filter");
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCategory = categorySelect.value;
  const filteredProducts = [];

  for (let i = 0; i < PRODUCTS.length; i++) {
    const product = PRODUCTS[i];
    const nameMatches = product.name.toLowerCase().includes(searchText);
    const categoryMatches = selectedCategory === "" || product.category === selectedCategory;

    if (nameMatches && categoryMatches) {
      filteredProducts.push(product);
    }
  }

  showProducts(filteredProducts);
}

function setupProductPage() {
  const productGrid = document.querySelector("#product-grid");

  if (productGrid === null) {
    return;
  }

  showProducts(PRODUCTS);

  document.querySelector("#product-search").addEventListener("input", filterProducts);
  document.querySelector("#category-filter").addEventListener("change", filterProducts);
}

function setupProductButtons() {
  const cartButtons = document.querySelectorAll(".add-cart");
  const wishlistButtons = document.querySelectorAll(".add-wishlist");
  const detailButtons = document.querySelectorAll(".view-product");

  for (let i = 0; i < cartButtons.length; i++) {
    cartButtons[i].addEventListener("click", function () {
      addToCart(this.dataset.id);
      this.textContent = "Added";
    });
  }

  for (let i = 0; i < wishlistButtons.length; i++) {
    wishlistButtons[i].addEventListener("click", function () {
      addToWishlist(this.dataset.id);
      this.textContent = "Saved";
    });
  }

  for (let i = 0; i < detailButtons.length; i++) {
    detailButtons[i].addEventListener("click", function () {
      openProductModal(this.dataset.id);
    });
  }
}

function openProductModal(productId) {
  const product = getProduct(productId);
  const modal = document.querySelector("#product-modal");
  const modalBody = modal.querySelector(".modal-body");

  modalBody.innerHTML = `
    <div class="modal-grid">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <p class="eyebrow">${product.categoryLabel}</p>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p class="price">${formatMoney(product.price)}</p>
      </div>
    </div>
  `;

  modal.showModal();
}

function setupModal() {
  const modal = document.querySelector("#product-modal");

  if (modal === null) {
    return;
  }

  modal.querySelector(".modal-close").addEventListener("click", function () {
    modal.close();
  });
}

// Shopping cart page.
function calculateCartTotal(cart) {
  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const product = getProduct(cart[i].id);

    if (product !== undefined) {
      total += product.price * cart[i].quantity;
    }
  }

  return total;
}

function showCart() {
  const cartList = document.querySelector("#cart-list");

  if (cartList === null) {
    return;
  }

  const cart = getCart();
  const totalArea = document.querySelector("#cart-total");
  const checkoutLink = document.querySelector("#checkout-link");

  if (cart.length === 0) {
    cartList.innerHTML = '<p class="empty-state">Your cart is empty. <a href="products.html">View products</a>.</p>';
    totalArea.textContent = formatMoney(0);
    checkoutLink.classList.add("disabled");
    return;
  }

  let cartHtml = "";

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const product = getProduct(item.id);

    if (product !== undefined) {
      cartHtml += `
        <article class="cart-item">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <h2>${product.name}</h2>
            <p>${formatMoney(product.price)} each</p>
            <div class="quantity-controls">
              <button type="button" data-action="decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
              <span>Quantity: ${item.quantity}</span>
              <button type="button" data-action="increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div>
            <p class="price">${formatMoney(product.price * item.quantity)}</p>
            <button class="text-button remove-item" type="button" data-id="${product.id}">Remove</button>
          </div>
        </article>
      `;
    }
  }

  cartList.innerHTML = cartHtml;
  totalArea.textContent = formatMoney(calculateCartTotal(cart));
  checkoutLink.classList.remove("disabled");
  setupCartButtons();
}

function changeCartQuantity(productId, change) {
  const cart = getCart();

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === Number(productId)) {
      cart[i].quantity += change;

      if (cart[i].quantity <= 0) {
        cart.splice(i, 1);
      }

      break;
    }
  }

  saveCart(cart);
  showCart();
}

function removeCartItem(productId) {
  const cart = getCart();

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === Number(productId)) {
      cart.splice(i, 1);
      break;
    }
  }

  saveCart(cart);
  showCart();
}

function setupCartButtons() {
  const quantityButtons = document.querySelectorAll(".quantity-controls button");
  const removeButtons = document.querySelectorAll(".remove-item");

  for (let i = 0; i < quantityButtons.length; i++) {
    quantityButtons[i].addEventListener("click", function () {
      const change = this.dataset.action === "increase" ? 1 : -1;
      changeCartQuantity(this.dataset.id, change);
    });
  }

  for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", function () {
      removeCartItem(this.dataset.id);
    });
  }
}

function setupCartPage() {
  const clearButton = document.querySelector("#clear-cart");

  if (clearButton === null) {
    return;
  }

  showCart();

  clearButton.addEventListener("click", function () {
    saveCart([]);
    showCart();
  });

  document.querySelector("#checkout-link").addEventListener("click", function (event) {
    if (getCart().length === 0) {
      event.preventDefault();
    }
  });
}

// Checkout page.
function showCheckoutSummary() {
  const summary = document.querySelector("#checkout-summary");

  if (summary === null) {
    return;
  }

  const cart = getCart();

  if (cart.length === 0) {
    summary.innerHTML = '<p>Your cart is empty.</p><a href="products.html">View products</a>';
    document.querySelector("#place-order").disabled = true;
    return;
  }

  let summaryHtml = "";

  for (let i = 0; i < cart.length; i++) {
    const product = getProduct(cart[i].id);
    summaryHtml += `
      <div class="summary-row">
        <span>${product.name} × ${cart[i].quantity}</span>
        <span>${formatMoney(product.price * cart[i].quantity)}</span>
      </div>
    `;
  }

  summaryHtml += `
    <div class="summary-row total">
      <span>Total</span>
      <span>${formatMoney(calculateCartTotal(cart))}</span>
    </div>
  `;

  summary.innerHTML = summaryHtml;
}

function setupCheckout() {
  const form = document.querySelector("#checkout-form");

  if (form === null) {
    return;
  }

  showCheckoutSummary();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const message = document.querySelector("#checkout-message");

    if (form.checkValidity() === false) {
      message.textContent = "Please complete all fields correctly.";
      message.className = "form-message error";
      form.reportValidity();
      return;
    }

    const cart = getCart();
    const orders = readStorage(ORDER_KEY);
    const selectedPayment = document.querySelector('input[name="payment"]:checked');

    orders.push({
      orderNumber: Date.now(),
      customerName: document.querySelector("#full-name").value.trim(),
      email: document.querySelector("#checkout-email").value.trim(),
      address: document.querySelector("#address").value.trim(),
      payment: selectedPayment.value,
      items: cart,
      total: calculateCartTotal(cart)
    });

    saveStorage(ORDER_KEY, orders);
    saveCart([]);

    document.querySelector(".checkout-layout").innerHTML = `
      <section class="success-panel">
        <div class="success-icon">✓</div>
        <h2>Order Confirmed</h2>
        <p>Thank you. Your order has been saved successfully.</p>
        <a class="primary-button" href="products.html">Continue Shopping</a>
      </section>
    `;
  });
}

// Wishlist page.
function showWishlist() {
  const wishlistGrid = document.querySelector("#wishlist-grid");

  if (wishlistGrid === null) {
    return;
  }

  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    wishlistGrid.innerHTML = '<p class="empty-state">Your wishlist is empty. <a href="products.html">View products</a>.</p>';
    return;
  }

  let wishlistHtml = "";

  for (let i = 0; i < wishlist.length; i++) {
    const savedItem = wishlist[i];
    const product = getProduct(savedItem.id);

    wishlistHtml += `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-body">
          <p class="product-meta">${product.categoryLabel}</p>
          <h2>${product.name}</h2>
          <p class="price">${formatMoney(product.price)}</p>
          <label for="status-${product.id}">Collection Status</label>
          <select class="status-select" id="status-${product.id}" data-id="${product.id}">
            <option value="Interested" ${savedItem.status === "Interested" ? "selected" : ""}>Interested</option>
            <option value="Owned" ${savedItem.status === "Owned" ? "selected" : ""}>Owned</option>
            <option value="Not Interested" ${savedItem.status === "Not Interested" ? "selected" : ""}>Not Interested</option>
          </select>
          <div class="product-actions">
            <button class="primary-button wishlist-cart" type="button" data-id="${product.id}">Add to Cart</button>
            <button class="text-button remove-wishlist" type="button" data-id="${product.id}">Remove</button>
          </div>
        </div>
      </article>
    `;
  }

  wishlistGrid.innerHTML = wishlistHtml;
  setupWishlistButtons();
}

function setupWishlistButtons() {
  const statusBoxes = document.querySelectorAll(".status-select");
  const cartButtons = document.querySelectorAll(".wishlist-cart");
  const removeButtons = document.querySelectorAll(".remove-wishlist");

  for (let i = 0; i < statusBoxes.length; i++) {
    statusBoxes[i].addEventListener("change", function () {
      const wishlist = getWishlist();

      for (let j = 0; j < wishlist.length; j++) {
        if (wishlist[j].id === Number(this.dataset.id)) {
          wishlist[j].status = this.value;
        }
      }

      saveWishlist(wishlist);
    });
  }

  for (let i = 0; i < cartButtons.length; i++) {
    cartButtons[i].addEventListener("click", function () {
      addToCart(this.dataset.id);
      this.textContent = "Added";
    });
  }

  for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", function () {
      const wishlist = getWishlist();

      for (let j = 0; j < wishlist.length; j++) {
        if (wishlist[j].id === Number(this.dataset.id)) {
          wishlist.splice(j, 1);
          break;
        }
      }

      saveWishlist(wishlist);
      showWishlist();
    });
  }
}

// Support form and FAQ.
function setupFeedbackForm() {
  const form = document.querySelector("#feedback-form");

  if (form === null) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const message = document.querySelector("#feedback-message");

    if (form.checkValidity() === false) {
      message.textContent = "Please complete all fields correctly.";
      message.className = "form-message error";
      form.reportValidity();
      return;
    }

    const feedbackList = readStorage(FEEDBACK_KEY);

    feedbackList.push({
      name: document.querySelector("#feedback-name").value.trim(),
      email: document.querySelector("#feedback-email").value.trim(),
      message: document.querySelector("#feedback-text").value.trim()
    });

    saveStorage(FEEDBACK_KEY, feedbackList);
    message.textContent = "Your feedback was sent successfully.";
    message.className = "form-message success";
    form.reset();
  });
}

function setupFaq() {
  const questions = document.querySelectorAll(".faq-question");

  for (let i = 0; i < questions.length; i++) {
    questions[i].addEventListener("click", function () {
      const faqItem = this.parentElement;
      faqItem.classList.toggle("open");

      const isOpen = faqItem.classList.contains("open");
      this.setAttribute("aria-expanded", isOpen);
      this.querySelector("span").textContent = isOpen ? "−" : "+";
    });
  }
}

// Small scroll reveal required by the brief.
function setupReveal() {
  const revealItems = document.querySelectorAll(".reveal:not(.visible)");

  if ("IntersectionObserver" in window === false) {
    for (let i = 0; i < revealItems.length; i++) {
      revealItems[i].classList.add("visible");
    }
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add("visible");
        observer.unobserve(entries[i].target);
      }
    }
  });

  for (let i = 0; i < revealItems.length; i++) {
    observer.observe(revealItems[i]);
  }
}

function setupYear() {
  const yearAreas = document.querySelectorAll(".current-year");

  for (let i = 0; i < yearAreas.length; i++) {
    yearAreas[i].textContent = new Date().getFullYear();
  }
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("service-worker.js");
    });
  }
}

// Run the functions needed for the current page.
document.addEventListener("DOMContentLoaded", function () {
  setupNavigation();
  updateCartCount();
  setupSlider();
  showFeaturedProduct();
  setupNewsletter();
  setupProductPage();
  setupModal();
  setupCartPage();
  setupCheckout();
  showWishlist();
  setupFeedbackForm();
  setupFaq();
  setupReveal();
  setupYear();
  registerServiceWorker();
});
