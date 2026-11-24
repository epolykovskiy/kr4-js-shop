'use strict';

// Корзина хранится в localStorage как массив позиций { id, quantity }.
const Cart = {
  STORAGE_KEY: 'shop-cart',
  PROMO_KEY: 'shop-promo',

  // Читает корзину из localStorage; при ошибке возвращает пустой массив.
  load() {
    try {
      const raw = localStorage.getItem(Cart.STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  // Сохраняет корзину; недоступность localStorage не ломает работу.
  save(items) {
    try {
      localStorage.setItem(Cart.STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* Корзина действует до перезагрузки страницы. */
    }
  },

  getItems() {
    return Cart.load();
  },

  // Количество единиц товара в корзине (для счётчика в шапке).
  count() {
    return Cart.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },

  add(id, quantity = 1) {
    const items = Cart.load();
    const existing = items.find((item) => item.id === id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ id, quantity });
    }
    Cart.save(items);
    Cart.updateBadge();
  },

  remove(id) {
    Cart.save(Cart.load().filter((item) => item.id !== id));
    Cart.updateBadge();
  },

  setQuantity(id, quantity) {
    if (quantity <= 0) {
      Cart.remove(id);
      return;
    }
    const items = Cart.load();
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    item.quantity = quantity;
    Cart.save(items);
    Cart.updateBadge();
  },

  clear() {
    Cart.save([]);
    Cart.updateBadge();
  },

  // Полные позиции корзины: товар, количество и сумма по позиции.
  getDetailedItems() {
    return Cart.getItems()
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return null;
        return {
          ...product,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter(Boolean);
  },

  // Сумма всех позиций без учёта скидки.
  subtotal() {
    return Cart.getDetailedItems().reduce((sum, item) => sum + item.lineTotal, 0);
  },

  getPromo() {
    try {
      return localStorage.getItem(Cart.PROMO_KEY) || null;
    } catch {
      return null;
    }
  },

  // Применяет промокод; возвращает код при успехе, иначе null.
  applyPromo(code) {
    const normalized = (code || '').trim().toUpperCase();
    if (!normalized) {
      try {
        localStorage.removeItem(Cart.PROMO_KEY);
      } catch {
        /* нет доступа */
      }
      return null;
    }
    if (promoCodes[normalized]) {
      try {
        localStorage.setItem(Cart.PROMO_KEY, normalized);
      } catch {
        /* нет доступа */
      }
      return normalized;
    }
    return null;
  },

  // Размер скидки в рублях по применённому промокоду.
  discount() {
    const promo = Cart.getPromo();
    if (!promo || !promoCodes[promo]) return 0;
    return Math.round((Cart.subtotal() * promoCodes[promo].percent) / 100);
  },

  // Итоговая сумма с учётом скидки.
  total() {
    return Cart.subtotal() - Cart.discount();
  },

  // Обновляет счётчики корзины в шапке.
  updateBadge() {
    const count = Cart.count();
    document.querySelectorAll('.cart-badge').forEach((badge) => {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    });
  },

  // Рендерит страницу корзины (cart.html).
  initPage() {
    const root = document.getElementById('cart-root');
    if (!root) return;

    const empty = document.getElementById('cart-empty');

    const render = () => {
      const items = Cart.getDetailedItems();
      root.replaceChildren();

      if (items.length === 0) {
        empty.hidden = false;
        return;
      }
      empty.hidden = true;

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

        const quantity = document.createElement('div');
        quantity.className = 'cart-item__quantity';

        const minus = document.createElement('button');
        minus.type = 'button';
        minus.className = 'button button--secondary cart-item__minus';
        minus.dataset.id = String(item.id);
        minus.textContent = '−';
        minus.setAttribute('aria-label', `Уменьшить количество: ${item.title}`);

        const value = document.createElement('span');
        value.className = 'cart-item__quantity-value';
        value.textContent = String(item.quantity);

        const plus = document.createElement('button');
        plus.type = 'button';
        plus.className = 'button button--secondary cart-item__plus';
        plus.dataset.id = String(item.id);
        plus.textContent = '+';
        plus.setAttribute('aria-label', `Увеличить количество: ${item.title}`);

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'button button--secondary cart-item__remove';
        remove.dataset.id = String(item.id);
        remove.textContent = 'Удалить';

        quantity.append(minus, value, plus, remove);

        li.append(image, info, quantity);
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

      // Промокод.
      const promo = document.createElement('div');
      promo.className = 'cart-promo';

      const promoInput = document.createElement('input');
      promoInput.className = 'order-form__input';
      promoInput.id = 'cart-promo-input';
      promoInput.type = 'text';
      promoInput.placeholder = 'Промокод (MERCH10, MERCH20)';
      promoInput.value = Cart.getPromo() || '';

      const promoButton = document.createElement('button');
      promoButton.type = 'button';
      promoButton.className = 'button button--secondary';
      promoButton.textContent = 'Применить';

      const promoStatus = document.createElement('p');
      promoStatus.className = 'cart-promo-status';
      promoStatus.setAttribute('role', 'status');

      promo.append(promoInput, promoButton, promoStatus);

      promoButton.addEventListener('click', () => {
        const applied = Cart.applyPromo(promoInput.value);
        if (applied) {
          promoStatus.textContent = `Промокод ${applied} применён: скидка ${promoCodes[applied].percent}%.`;
        } else {
          promoStatus.textContent = 'Промокод не найден.';
        }
        render();
      });

      const actions = document.createElement('div');
      actions.className = 'cart-actions';

      const orderLink = document.createElement('a');
      orderLink.className = 'button button--primary';
      orderLink.href = 'order.html';
      orderLink.textContent = 'Оформить заказ';

      const clearButton = document.createElement('button');
      clearButton.type = 'button';
      clearButton.className = 'button button--secondary';
      clearButton.textContent = 'Очистить корзину';
      clearButton.addEventListener('click', () => {
        Cart.clear();
        render();
      });

      actions.append(orderLink, clearButton);

      root.append(list, summary, promo, actions);
    };

    // Изменение количества и удаление через делегирование.
    root.addEventListener('click', (event) => {
      const minus = event.target.closest('.cart-item__minus');
      if (minus) {
        const id = Number(minus.dataset.id);
        const item = Cart.getItems().find((entry) => entry.id === id);
        if (item) {
          Cart.setQuantity(id, item.quantity - 1);
          render();
        }
        return;
      }
      const plus = event.target.closest('.cart-item__plus');
      if (plus) {
        const id = Number(plus.dataset.id);
        const item = Cart.getItems().find((entry) => entry.id === id);
        if (item) {
          Cart.setQuantity(id, item.quantity + 1);
          render();
        }
        return;
      }
      const remove = event.target.closest('.cart-item__remove');
      if (remove) {
        Cart.remove(Number(remove.dataset.id));
        render();
      }
    });

    render();
  },
};
