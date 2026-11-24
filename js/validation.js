function validation(form) {
  const controls = [...form.elements].filter((element) => element.willValidate);
  let firstInvalid = null;
  controls.forEach((control) => {
    const errorId = `${control.id}-error`;
    let error = document.getElementById(errorId);
    if (!control.validity.valid) {
      if (!error) {
        error = document.createElement('span');
        error.id = errorId;
        error.className = 'field-error';
        control.closest('.order-form__field').append(error);
      }
      error.textContent = control.validity.valueMissing ? 'Заполните обязательное поле.' : control.validationMessage;
      control.setAttribute('aria-invalid', 'true');
      const descriptions = new Set((control.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
      descriptions.add(errorId);
      control.setAttribute('aria-describedby', [...descriptions].join(' '));
      firstInvalid ||= control;
    } else {
      error?.remove();
      control.removeAttribute('aria-invalid');
      const descriptions = (control.getAttribute('aria-describedby') || '').split(' ').filter((id) => id && id !== errorId);
      if (descriptions.length) control.setAttribute('aria-describedby', descriptions.join(' '));
      else control.removeAttribute('aria-describedby');
    }
  });
  firstInvalid?.focus();
  return firstInvalid === null;
}
