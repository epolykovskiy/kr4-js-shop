'use strict';

// Инициализирует форму обратной связи (feedback.html и contacts.html).
function initFeedbackPage() {
  const form = document.getElementById('feedback-form');
  if (!form) return;

  const success = document.getElementById('success-message');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    success.hidden = true;
    if (validation(form)) {
      success.textContent = 'Учебное сообщение проверено. Данные никуда не отправлены.';
      success.hidden = false;
      form.reset();
    }
  });
}
