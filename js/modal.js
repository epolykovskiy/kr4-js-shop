'use strict';

// Заполняет и открывает модальное окно быстрого просмотра товара.
function openQuickView(product) {
  const dialog = document.getElementById('quick-view');
  if (!dialog) return;

  const image = document.getElementById('quick-view-image');
  image.src = product.image;
  image.alt = product.alt;

  document.getElementById('quick-view-title').textContent = product.title;
  document.getElementById('quick-view-category').textContent = categories[product.category];

  const price = document.getElementById('quick-view-price');
  price.textContent = `Цена: ${formatPrice(product.price)}`;

  const oldPrice = document.getElementById('quick-view-old-price');
  if (product.oldPrice) {
    oldPrice.textContent = formatPrice(product.oldPrice);
    oldPrice.hidden = false;
  } else {
    oldPrice.hidden = true;
  }

  document.getElementById('quick-view-description').textContent = product.description;
  document.getElementById('quick-view-availability').textContent = product.isAvailable
    ? 'В наличии'
    : 'Нет в наличии';

  const addButton = document.getElementById('quick-view-add');
  addButton.dataset.id = String(product.id);
  addButton.disabled = !product.isAvailable;

  const detailsLink = document.getElementById('quick-view-details');
  detailsLink.href = `product.html?id=${product.id}`;

  dialog.showModal();
}

// Инициализирует модальное окно: делегирование кликов и закрытие.
function initQuickView() {
  const dialog = document.getElementById('quick-view');
  if (!dialog) return;

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.product-card__image-button');
    if (!button) return;
    const product = products.find((p) => p.id === Number(button.dataset.id));
    if (product) openQuickView(product);
  });

  const closeButton = document.getElementById('quick-view-close');
  if (closeButton) closeButton.addEventListener('click', () => dialog.close());
}
