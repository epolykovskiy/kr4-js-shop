'use strict';

function initOrderPage() {
  const form = document.getElementById('order-form');
  if (!form) return;

  const productSelect = document.getElementById('order-selected-product');
  const quantityInput = document.getElementById('order-quantity');
  const success = document.getElementById('success-message');

  productSelect.replaceChildren();
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Выберите товар';
  productSelect.append(placeholder);
  products
    .filter((product) => product.isAvailable)
    .forEach((product) => {
      const option = document.createElement('option');
      option.value = String(product.id);
      option.textContent = product.title;
      productSelect.append(option);
    });

  const requested = Number(new URLSearchParams(window.location.search).get('product'));
  if (products.some((product) => product.id === requested)) {
    productSelect.value = String(requested);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    success.hidden = true;
    if (!validation(form)) return;

    const product = products.find((p) => p.id === Number(productSelect.value));
    const quantity = quantityInput ? quantityInput.value : '1';
    success.textContent = `Заявка подготовлена: ${product.title} × ${quantity}. Данные никуда не отправлены.`;
    success.hidden = false;
    form.reset();
  });
}
