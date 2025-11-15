// components/display.js
export default class Display {
  constructor(container) {
    this.value = '';
    this.displayElement = document.createElement('div');
    this.displayElement.classList.add('display');
    this.displayElement.style.height = '60px';
    this.displayElement.style.background = '#f1f1f1';
    this.displayElement.style.marginBottom = '10px';
    this.displayElement.style.borderRadius = '10px';
    this.displayElement.style.padding = '10px';
    this.displayElement.style.fontSize = '24px';
    this.displayElement.style.textAlign = 'right';
    container.appendChild(this.displayElement);
    this.update('');
  }

  append(char) {
    this.value += char;
    this.update(this.value);
  }

  update(val) {
    this.value = val.toString();
    this.displayElement.innerText = this.value;
  }

  clear() {
    this.value = '';
    this.update('');
  }
}
