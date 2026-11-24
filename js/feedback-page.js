const feedbackForm = document.getElementById('feedback-form');
const successMessage = document.getElementById('success-message');
feedbackForm.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.hidden = true;
  if (validation(feedbackForm)) {
    successMessage.hidden = false;
    feedbackForm.reset();
  }
});
