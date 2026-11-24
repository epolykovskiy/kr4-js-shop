'use strict';

function initOrderPage() {
  const form = document.getElementById('order-form');
  if (!form) return;

  const summaryRoot = document.getElementById('order-summary-root');
  if (!summaryRoot) return;

  const success = document.getElementById('success-message');
  const submitButton = form.querySelector('button[type="submit"]');

  function renderSummary() {
    const items = Cart.getDetailedItems();
    summaryRoot.replaceChildren();

    if (items.length === 0) {
      if (submitButton) submitButton.disabled = true;
      const empty = document.createElement('p');
      empty.className = 'catalog-empty';
      empty.textContent = 'Корзина пуста. ';
      const link = document.createElement('a');
      link.href = 'catalog.html';
      link.textContent = 'Перейти в каталог';
      empty.append(link);
      summaryRoot.append(empty);
      return;
    }

    if (submitButton) submitButton.disabled = false;

    const list = document.createElement('ul');
    list.className = 'cart-list';

    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart-item';

      const image = document.createElement('img');
      image.className = 'cart-item__image';
      image.src = item.image320;
      image.alt = item.alt;

      const info = document.createElement('div');
      info.className = 'cart-item__info';

      const title = document.createElement('h3');
      title.className = 'cart-item__title';
      title.textContent = item.title;

      const linePrice = document.createElement('p');
      linePrice.className = 'cart-item__line-price';
      linePrice.textContent = `${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(item.lineTotal)}`;

      info.append(title, linePrice);
      li.append(image, info);
      list.append(li);
    });

    const summary = document.createElement('div');
    summary.className = 'cart-summary';

    const subtotalRow = document.createElement('div');
    subtotalRow.className = 'cart-summary__row';
    const subtotalLabel = document.createElement('span');
    subtotalLabel.textContent = 'Сумма товаров';
    const subtotalValue = document.createElement('span');
    subtotalValue.textContent = formatPrice(Cart.subtotal());
    subtotalRow.append(subtotalLabel, subtotalValue);

    const discountRow = document.createElement('div');
    discountRow.className = 'cart-summary__row';
    const discountLabel = document.createElement('span');
    discountLabel.textContent = 'Скидка по промокоду';
    const discountValue = document.createElement('span');
    discountValue.textContent = `−${formatPrice(Cart.discount())}`;
    discountRow.append(discountLabel, discountValue);

    const totalRow = document.createElement('div');
    totalRow.className = 'cart-summary__row cart-summary__total';
    const totalLabel = document.createElement('span');
    totalLabel.textContent = 'Итого';
    const totalValue = document.createElement('span');
    totalValue.textContent = formatPrice(Cart.total());
    totalRow.append(totalLabel, totalValue);

    summary.append(subtotalRow, discountRow, totalRow);

    summaryRoot.append(list, summary);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    success.hidden = true;
    if (!validation(form)) return;

    if (Cart.count() === 0) {
      success.textContent = 'Корзина пуста, заказ не оформлен';
      success.hidden = false;
      return;
    }

    success.textContent = `Заявка подготовлена: ${Cart.count()} товаров на сумму ${formatPrice(Cart.total())}. Данные никуда не отправлены.`;
    success.hidden = false;
    Cart.clear();
    renderSummary();
    form.reset();
  });

  renderSummary();
}
