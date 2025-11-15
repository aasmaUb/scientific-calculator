// components/historyPanel.js
export default class HistoryPanel {
  constructor(container) {
    this.history = [];
    this.panel = document.createElement('div');
    this.panel.style.height = '100px';
    this.panel.style.overflowY = 'auto';
    this.panel.style.background = '#eaeaea';
    this.panel.style.marginTop = '10px';
    this.panel.style.borderRadius = '10px';
    this.panel.style.padding = '5px';
    this.panel.style.fontSize = '14px';
    this.panel.className = 'history-panel';

    container.appendChild(this.panel);
  }

  add(entry) {
    this.history.push(entry);
    const p = document.createElement('div');
    p.innerText = entry;
    this.panel.appendChild(p);
    this.panel.scrollTop = this.panel.scrollHeight;
  }
}
