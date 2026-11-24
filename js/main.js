const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const desktop = window.matchMedia('(min-width: 1024px)');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Закрыть меню' : 'Меню';
  navigation.hidden = !open;
}
function syncMenu() {
  const focusWasInNavigation = navigation.contains(document.activeElement);
  const focusWasOnButton = document.activeElement === menuButton;
  menuButton.hidden = desktop.matches;
  if (!desktop.matches && focusWasInNavigation) menuButton.focus();
  setMenu(desktop.matches);
  if (desktop.matches && focusWasOnButton) navigation.querySelector('a').focus();
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !desktop.matches && !navigation.hidden) {
    setMenu(false);
    menuButton.focus();
  }
});
navigation.addEventListener('click', (event) => {
  if (!desktop.matches && event.target.closest('a')) {
    setMenu(false);
    menuButton.focus();
  }
});
desktop.addEventListener('change', syncMenu);
syncMenu();

const filters = document.querySelector('.filters-form');
if (filters) {
  const disclosure = document.querySelector('.filters-disclosure');
  const cards = [...document.querySelectorAll('.catalog-products .product-card')];
  const grid = document.querySelector('.catalog-products .products-grid');
  const status = document.getElementById('catalog-status');
  const error = document.querySelector('.filter-error');
  const syncFilters = () => { disclosure.open = desktop.matches; };
  desktop.addEventListener('change', syncFilters);
  syncFilters();
  const applyFilters = () => {
    const data = new FormData(filters);
    const min = Number(data.get('price-from') || 0);
    const max = data.get('price-to') === '' ? Infinity : Number(data.get('price-to'));
    error.hidden = min <= max;
    if (min > max) {
      error.textContent = 'Цена «От» не должна превышать цену «До».';
      document.getElementById('price-from').focus();
      return;
    }
    const category = data.get('category');
    const sort = data.get('sort');
    const sorted = [...cards].sort((a, b) => sort === 'default' ? a.dataset.index - b.dataset.index : (a.dataset.price - b.dataset.price) * (sort === 'asc' ? 1 : -1));
    let count = 0;
    sorted.forEach((card) => {
      card.hidden = !(Number(card.dataset.price) >= min && Number(card.dataset.price) <= max && (category === 'all' || card.dataset.category === category));
      if (!card.hidden) count++;
      grid.append(card);
    });
    status.textContent = `Найдено товаров: ${count}`;
    document.getElementById('catalog-empty').hidden = count !== 0;
  };
  filters.addEventListener('submit', (event) => { event.preventDefault(); applyFilters(); });
  filters.addEventListener('reset', () => { setTimeout(applyFilters, 0); });
}
