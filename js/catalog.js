'use strict';

// Собирает карточку товара средствами DOM: createElement, textContent,
// classList и append. Пользовательские данные не попадают в innerHTML.
function buildCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const imageButton = document.createElement('button');
  imageButton.type = 'button';
  imageButton.className = 'product-card__image-button';
  imageButton.dataset.id = String(product.id);
  imageButton.setAttribute('aria-label', `Быстрый просмотр: ${product.title}`);

  const image = document.createElement('img');
  image.className = 'product-card__image';
  image.src = product.image;
  image.srcset = `${product.image320} 320w, ${product.image640} 640w`;
  image.sizes = '(min-width: 1024px) 320px, (min-width: 640px) 45vw, calc(100vw - 64px)';
  image.alt = product.alt;
  image.loading = 'lazy';
  imageButton.append(image);
  card.append(imageButton);

  const title = document.createElement('h3');
  title.className = 'product-card__title';
  title.textContent = product.title;
  card.append(title);

  if (product.badge) {
    const badge = document.createElement('span');
    badge.className = `product-card__badge product-card__badge--${product.badge}`;
    badge.textContent = badgeLabels[product.badge];
    card.append(badge);
  }

  const description = document.createElement('p');
  description.className = 'product-card__description';
  description.textContent = product.description;
  card.append(description);

  if (product.oldPrice) {
    const oldPrice = document.createElement('p');
    oldPrice.className = 'product-card__old-price';
    oldPrice.textContent = formatPrice(product.oldPrice);
    card.append(oldPrice);
  }

  const price = document.createElement('p');
  price.className = 'product-card__price';
  price.textContent = `Цена: ${formatPrice(product.price)}`;
  card.append(price);

  const availability = document.createElement('p');
  availability.className = 'product-card__availability';
  if (product.isAvailable) {
    availability.textContent = 'В наличии';
  } else {
    availability.textContent = 'Нет в наличии';
    availability.classList.add('product-card__availability--out');
  }
  card.append(availability);

  const actions = document.createElement('div');
  actions.className = 'product-card__actions';

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'button button--primary product-card__add';
  addButton.dataset.id = String(product.id);
  addButton.textContent = 'В корзину';
  if (!product.isAvailable) {
    addButton.disabled = true;
  }

  const detailsLink = document.createElement('a');
  detailsLink.className = 'button button--secondary';
  detailsLink.href = `product.html?id=${product.id}`;
  detailsLink.textContent = 'Подробнее';

  actions.append(addButton, detailsLink);
  card.append(actions);

  return card;
}

// Компаратор сортировки по значению из выпадающего списка.
function sortComparator(sort) {
  switch (sort) {
    case 'price-asc':
      return (a, b) => a.price - b.price;
    case 'price-desc':
      return (a, b) => b.price - a.price;
    case 'name-asc':
      return (a, b) => a.title.localeCompare(b.title, 'ru');
    case 'name-desc':
      return (a, b) => b.title.localeCompare(a.title, 'ru');
    default:
      return (a, b) => a.id - b.id;
  }
}

// Инициализирует каталог: генерация карточек, поиск, фильтр и сортировка.
function initCatalog() {
  const grid = document.querySelector('.catalog-products .products-grid');
  if (!grid) return;

  const form = document.getElementById('catalog-filters-form');
  const searchInput = document.getElementById('catalog-search');
  const categorySelect = document.getElementById('catalog-category');
  const priceFrom = document.getElementById('price-from');
  const priceTo = document.getElementById('price-to');
  const sortSelect = document.getElementById('catalog-sort');
  const status = document.getElementById('catalog-status');
  const empty = document.getElementById('catalog-empty');
  const resetButton = document.getElementById('catalog-reset');

  // Категории заполняются из data.js, чтобы значения совпадали с фильтром.
  if (categorySelect) {
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'Все категории';
    categorySelect.append(allOption);
    Object.entries(categories).forEach(([value, label]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      categorySelect.append(option);
    });
  }

  function getFilteredProducts() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const category = categorySelect ? categorySelect.value : 'all';
    const min = priceFrom ? Number(priceFrom.value) || 0 : 0;
    const max = priceTo && priceTo.value !== '' ? Number(priceTo.value) : Infinity;

    const filtered = products.filter((product) => {
      const matchesQuery = product.title.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || product.category === category;
      const matchesPrice = product.price >= min && product.price <= max;
      return matchesQuery && matchesCategory && matchesPrice;
    });

    // Сортировка применяется к копии массива — исходный порядок не меняется.
    return [...filtered].sort(sortComparator(sortSelect ? sortSelect.value : 'default'));
  }

  function render() {
    const list = getFilteredProducts();
    grid.replaceChildren();
    list.forEach((product) => grid.append(buildCard(product)));
    if (status) status.textContent = `Найдено товаров: ${list.length}`;
    if (empty) empty.hidden = list.length !== 0;
  }

  if (searchInput) searchInput.addEventListener('input', render);
  if (categorySelect) categorySelect.addEventListener('change', render);
  if (sortSelect) sortSelect.addEventListener('change', render);
  if (priceFrom) priceFrom.addEventListener('input', render);
  if (priceTo) priceTo.addEventListener('input', render);

  if (form) {
    form.addEventListener('submit', (event) => event.preventDefault());
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categorySelect) categorySelect.value = 'all';
      if (sortSelect) sortSelect.value = 'default';
      if (priceFrom) priceFrom.value = '';
      if (priceTo) priceTo.value = '';
      render();
    });
  }

  render();
}

// Популярные товары на главной странице.
function initPopularProducts() {
  const grid = document.getElementById('popular-grid');
  if (!grid) return;
  const popular = products
    .filter((product) => product.isAvailable && product.badge)
    .slice(0, 3);
  grid.replaceChildren();
  popular.forEach((product) => grid.append(buildCard(product)));
}
