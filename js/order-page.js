const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');
const productSelect = document.getElementById('order-selected-product');
const selectedProduct = new URLSearchParams(window.location.search).get('product');
if ([...productSelect.options].some((option) => option.value === selectedProduct)) {
  productSelect.value = selectedProduct;
  productSelect.querySelector(`option[value="${selectedProduct}"]`).defaultSelected = true;
  document.getElementById('order-topic').value = 'product';
}
orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.hidden = true;
  if (validation(orderForm)) {
    successMessage.hidden = false;
    orderForm.reset();
  }
});
