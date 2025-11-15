import Display from './components/Display.js';
import Keypad from './components/Keypad.js';
import HistoryPanel from './components/HistoryPanel.js';
import ThemeToggle from './components/ThemeToggle.js';
import { calculate } from './utils.js';


// Initialize calculator
const container = document.getElementById('calculator-container');

const display = new Display(container);
const history = new HistoryPanel(container);

const keypad = new Keypad(container, (value) => {
  if (value === '=') {
    // ✅ HISTORY FIX
    const expression = display.value;
    const result = calculate(expression);
    display.update(result);
    history.add(`${expression} = ${result}`);
    display.justCalculated = true; // mark that result was just calculated
  } 
  else if (value === 'C') {
    // ✅ Backspace: remove last character only
    if (display.value.length > 0) {
      display.value = display.value.slice(0, -1);
      display.update(display.value); // refresh LCD
    }
  } 
  else if (value === 'AC') {
    // Clear all
    display.clear();
  } 
  else {
    // If a result was just shown, start new input
    if (display.justCalculated) {
      display.value = '';
      display.justCalculated = false;
    }
    display.append(value);
  }
});

const themeToggle = new ThemeToggle(container);



// ----------------------------------------------------
// ✅ KEYBOARD SUPPORT
// ----------------------------------------------------

document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Prevent page scroll by space or backspace
  if (key === " " || key === "Backspace") e.preventDefault();


  // 1️⃣ Digits
  if (/^[0-9]$/.test(key)) {
    handleInput(key);
  }

  // 2️⃣ Operators
  if (["+", "-", "*", "/"].includes(key)) {
    handleInput(key);
  }

  // 3️⃣ Decimal
  if (key === ".") handleInput(".");

  // 4️⃣ Parentheses
  if (key === "(" || key === ")") handleInput(key);

  // 5️⃣ Enter = equals
  if (key === "Enter") {
    e.preventDefault();
    const expression = display.value;
    const result = calculate(expression);
    display.update(result);
    history.add(`${expression} = ${result}`);
    display.justCalculated = true;
  }

  // 6️⃣ Backspace → delete 1 char
  if (key === "Backspace") {
    if (display.value.length > 0) {
      display.value = display.value.slice(0, -1);
      display.update(display.value);
    }
  }

  // 7️⃣ Escape → AC (All Clear)
  if (key === "Escape") {
    display.clear();
  }

  // ----------------------------------------------------
  // 8️⃣ SHORTCUTS FOR TRIG FUNCTIONS
  // ----------------------------------------------------
  if (key === "s") handleInput("sin(");
  if (key === "c") handleInput("cos(");
  if (key === "t") handleInput("tan(");

  // Log, ln
  if (key === "l") handleInput("log(");

  // ----------------------------------------------------
  // 🔥 SPECIAL KEYS (FIXED)
  // ----------------------------------------------------
  if (key === "r") handleInput("√(");   // Square root
  if (key === "p") handleInput("π");    // Pi
  if (key === "e") handleInput("e");    // Euler's Number
});


// ----------------------------------------------------
// Helper function
// ----------------------------------------------------
function handleInput(val) {
  if (display.justCalculated) {
    display.value = "";
    display.justCalculated = false;
  }
  display.append(val);
}
