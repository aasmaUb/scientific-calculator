// src/components/Keypad.js
export default class Keypad {
  constructor(container, callback) {
    this.container = container;
    this.callback = callback;

    // Expanded button set (numbers, basic ops, scientific)
    // Note: layout uses a grid with 5 columns (adjust CSS if needed)
    this.keys = [
      'C', '(', ')', 'π', 'e',
      '7','8','9','/','^', 
      '4','5','6','*','√',
      '1','2','3','-','%',
      '0','.','=','+','!',
      'sin','cos','tan','log', 'ln'           
    ];

    this.render();
  }

  render() {
    // Remove existing keypad (if re-render)
    const existing = this.container.querySelector('.keypad');
    if (existing) existing.remove();

    const keypadDiv = document.createElement('div');
    keypadDiv.className = 'keypad';
    // allow CSS grid to style .keypad (uses grid-template-columns in your CSS)

    this.keys.forEach(key => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.innerText = key;
      btn.className = `key-${this._normalizeClass(key)}`;
      // special classes for styling if you want
      if (key === '=') btn.classList.add('equal');
      if (['C', '(', ')', 'π', 'e', '%', '!', '√', '^'].includes(key)) btn.classList.add('function');

      btn.addEventListener('click', () => {
        // map some buttons to expression-friendly tokens
        const mapped = this._mapKeyToInput(key);
        this.callback(mapped);
      });

      keypadDiv.appendChild(btn);
    });

    this.container.appendChild(keypadDiv);
  }

  // helper: convert key label to class-safe string
  _normalizeClass(key) {
    return key.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  }

  // helper: map button label -> expression token passed to main handler
  _mapKeyToInput(key) {
    switch (key) {
      case 'π': return 'π';
      case 'e': return 'e';
      case '√': return '√';     // user can type √9 -> we append sqrt( and expect user to close ) or we can auto-close in calculator logic
      case '^': return '^';
      case '%': return '%';
      case '!': return '!';        // factorial token, handle in calculate.js
      case 'sin': case 'cos': case 'tan':
      case 'log': case 'ln':
        return key + '(';          // e.g. sin(  -> user will then input number and close with ')'
      case 'C': return 'C';        // special clear command
      case '=': return '=';        // equals command
      default:
        return key;                // numbers, operators, parentheses, dot
    }
  }
}
