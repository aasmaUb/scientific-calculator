// components/themeToggle.js
export default class ThemeToggle {
  constructor(container) {
    this.container = container;
    this.button = document.createElement('button');

    // Accessible label + class
    this.button.className = 'theme-toggle-btn';
    this.button.type = 'button';
    this.button.setAttribute('aria-pressed', 'false');
    this.button.title = 'Toggle theme';
    this.button.innerHTML = '🌙'; // icon only (changeable)

    // Append inside calculator container (so it's not floating separately)
    this.container.appendChild(this.button);

    // Bind
    this.button.addEventListener('click', () => this.toggle());

    // Initialize from saved preference (if any)
    const saved = localStorage.getItem('calc-theme');
    if (saved === 'dark') {
      this.enableDark();
    } else {
      this.disableDark();
    }
  }

  enableDark() {
    document.body.classList.add('dark-theme');
    this.button.setAttribute('aria-pressed', 'true');
    this.button.innerHTML = '☀️';
    localStorage.setItem('calc-theme', 'dark');
  }

  disableDark() {
    document.body.classList.remove('dark-theme');
    this.button.setAttribute('aria-pressed', 'false');
    this.button.innerHTML = '🌙';
    localStorage.setItem('calc-theme', 'light');
  }

  toggle() {
    if (document.body.classList.contains('dark-theme')) {
      this.disableDark();
    } else {
      this.enableDark();
    }
  }
}
