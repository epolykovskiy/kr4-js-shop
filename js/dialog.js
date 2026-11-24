const orderDialog = document.getElementById('order-dialog');
const orderForm = document.getElementById('order-form');
let dialogTrigger = null;
document.querySelectorAll('.product-card__button').forEach((button) => {
  button.addEventListener('click', () => {
    dialogTrigger = button;
    document.getElementById('selected-product').value = button.dataset.product;
    document.getElementById('dialog-product').textContent = `Товар: ${button.dataset.product}`;
    document.getElementById('order-topic').value = 'product';
    orderDialog.showModal();
  });
});
document.getElementById('close-order-dialog').addEventListener('click', () => orderDialog.close());
orderDialog.addEventListener('close', () => dialogTrigger?.focus());
orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('success-message').hidden = true;
  if (validation(orderForm)) {
    document.getElementById('success-message').hidden = false;
    orderForm.reset();
    orderDialog.close();
  }
});
