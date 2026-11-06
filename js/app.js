let siteData = {};
let productData = { categories: [], items: [] };
let cart = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initStore();
});

async function initStore() {
  try {
    const [siteRes, productsRes] = await Promise.all([
      fetch('/content/site.json'),
      fetch('/content/products.json')
    ]);

    siteData = await siteRes.json();
    productData = await productsRes.json();

    renderSiteText();
    renderCategoryFilters();
    renderProducts();
    setupEventListeners();
  } catch (err) {
    console.error('Error loading store data:', err);
  }
}

function renderSiteText() {
  document.title = siteData.title || 'Barber Kutzone Store';
  document.getElementById('site-title').textContent = siteData.title || '';
  document.getElementById('site-tagline').textContent = siteData.tagline || '';
  document.getElementById('hero-headline').textContent = siteData.hero_headline || '';
  document.getElementById('hero-subtext').textContent = siteData.hero_subtext || '';
  document.getElementById('hero-cta-btn').textContent = siteData.hero_cta_button || '';
  document.getElementById('nav-home').textContent = siteData.nav_home || 'Home';
  document.getElementById('nav-tools').textContent = siteData.nav_tools || 'Tools';
  document.getElementById('nav-attire').textContent = siteData.nav_attire || 'Attire';
  document.getElementById('nav-cart').textContent = siteData.nav_cart || 'Cart';
  document.getElementById('footer-text').textContent = siteData.footer_text || '';
}

function renderCategoryFilters() {
  const container = document.getElementById('category-filters');
  container.innerHTML = `<button class="filter-btn active" data-category="all">All Items</button>`;

  productData.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.setAttribute('data-category', cat.id);
    btn.textContent = cat.name;
    container.appendChild(btn);
  });
}

function renderProducts(searchQuery = '') {
  const container = document.getElementById('product-grid');
  container.innerHTML = '';

  const filtered = productData.items.filter(item => {
    const matchesCategory = currentFilter === 'all' || item.category === currentFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No cosmic gear found matching your query.</p>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
      <img src="${item.image}" alt="${item.name}" class="card-image">
      <h3 class="card-title">${item.name}</h3>
      <p class="card-description">${item.description}</p>
      <div class="card-footer">
        <span class="card-price">$${item.price.toFixed(2)}</span>
        <button class="btn btn-primary add-to-cart-btn" data-id="${item.id}">Add to Bay</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function setupEventListeners() {
  // Category Filter Click
  document.getElementById('category-filters').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.getAttribute('data-category');
      renderProducts(document.getElementById('search-input').value);
    }
  });

  // Nav Category Clicks
  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const cat = e.target.getAttribute('data-category');
      currentFilter = cat;
      const filterBtns = document.querySelectorAll('.filter-btn');
      filterBtns.forEach(b => {
        if (b.getAttribute('data-category') === cat) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      renderProducts(document.getElementById('search-input').value);
    });
  });

  // Search Input
  document.getElementById('search-input').addEventListener('input', (e) => {
    renderProducts(e.target.value);
  });

  // Add to Cart Delegate
  document.getElementById('product-grid').addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const id = e.target.getAttribute('data-id');
      addToCart(id);
    }
  });

  // Cart Drawer Toggle
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  
  const toggleCart = () => {
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
  };

  document.getElementById('cart-toggle-btn').addEventListener('click', toggleCart);
  document.getElementById('cart-close-btn').addEventListener('click', toggleCart);
  overlay.addEventListener('click', toggleCart);

  // Cart Remove Item Delegate
  document.getElementById('cart-items-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
      const index = parseInt(e.target.getAttribute('data-index'), 10);
      removeFromCart(index);
    }
  });

  // Checkout Action
  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cargo bay is empty!');
      return;
    }
    alert('Hyper-Checkout Initiated! Quantum transmission sent.');
    cart = [];
    updateCartUI();
    toggleCart();
  });
}

function addToCart(id) {
  const product = productData.items.find(p => p.id === id);
  if (product) {
    cart.push(product);
    updateCartUI();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  document.getElementById('cart-count').textContent = cart.length;
  const container = document.getElementById('cart-items-container');
  container.innerHTML = '';

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <button class="remove-item" data-index="${index}">&times;</button>
    `;
    container.appendChild(itemEl);
  });

  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}