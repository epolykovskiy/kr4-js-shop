'use strict';

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}

function initMenu() {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  if (!menuButton || !navigation) return;

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
    if (desktop.matches && focusWasOnButton && navigation.querySelector('a')) {
      navigation.querySelector('a').focus();
    }
  }

  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

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
}

function initAddToCart() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.product-card__add');
    if (!button) return;
    const product = products.find((p) => p.id === Number(button.dataset.id));
    if (!product || !product.isAvailable) return;
    Cart.add(product.id);
    showToast(`«${product.title}» добавлен в корзину`);
    const dialog = button.closest('dialog');
    if (dialog) dialog.close();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initAddToCart();
  Cart.updateBadge();

  if (typeof initPopularProducts === 'function') initPopularProducts();
  if (typeof initCatalog === 'function') initCatalog();
  if (typeof initQuickView === 'function') initQuickView();
  if (typeof initProductPage === 'function') initProductPage();
  if (typeof initOrderPage === 'function') initOrderPage();
  if (typeof initFeedbackPage === 'function') initFeedbackPage();
  Cart.initPage();
});
