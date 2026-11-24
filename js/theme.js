const root = document.documentElement;
try {
  if (localStorage.getItem('theme') === 'dark') root.dataset.theme = 'dark';
} catch {  }
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('theme-toggle');
  const update = () => {
    const dark = root.dataset.theme === 'dark';
    button.textContent = dark ? 'Светлая тема' : 'Тёмная тема';
    button.setAttribute('aria-pressed', String(dark));
  };
  button.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch {  }
    update();
  });
  update();
});
