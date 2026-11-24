'use strict';

function buildSpecs(product) {
  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrapper';

  const table = document.createElement('table');
  table.className = 'product__specs';

  const caption = document.createElement('caption');
  caption.className = 'product__specs-caption';
  caption.textContent = 'Характеристики';
  table.append(caption);

  const tbody = document.createElement('tbody');
  const rows = [
    ['Категория', categories[product.category]],
    ['Наличие', product.isAvailable ? 'В наличии' : 'Нет в наличии'],
    ['Цена', formatPrice(product.price)],
  ];

  rows.forEach(([name, value]) => {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.scope = 'row';
    th.className = 'product__specs-name';
    th.textContent = name;
    const td = document.createElement('td');
    td.className = 'product__specs-value';
    td.textContent = value;
    tr.append(th, td);
    tbody.append(tr);
  });

  table.append(tbody);
  wrapper.append(table);
  return wrapper;
}

function initProductPage() {
  const root = document.getElementById('product-root');
  if (!root) return;

  const id = Number(new URLSearchParams(window.location.search).get('id'));
  const product = products.find((p) => p.id === id) || products[0];

  document.title = `${product.title} — Учебный интернет-магазин`;

  const photo = document.createElement('div');
  photo.className = 'product__photo';
  const image = document.createElement('img');
  image.className = 'product__image';
  image.src = product.image;
  image.srcset = `${product.image320} 320w, ${product.image640} 640w`;
  image.sizes = '(min-width: 1024px) 520px, (min-width: 768px) 45vw, calc(100vw - 64px)';
  image.alt = product.alt;
  photo.append(image);

  const info = document.createElement('div');
  info.className = 'product__info';

  const title = document.createElement('h1');
  title.className = 'product__title';
  title.textContent = product.title;
  info.append(title);

  const description = document.createElement('p');
  description.textContent = product.description;
  info.append(description);

  const buy = document.createElement('div');
  buy.className = 'product__buy';

  const price = document.createElement('p');
  price.className = 'product__price';
  price.textContent = formatPrice(product.price);

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'button button--primary product__button product-card__add';
  addButton.dataset.id = String(product.id);
  addButton.textContent = 'В корзину';
  if (!product.isAvailable) {
    addButton.disabled = true;
  }

  buy.append(price, addButton);
  info.append(buy);
  info.append(buildSpecs(product));

  root.replaceChildren(photo, info);
}
