// utils.js
export function calculate(expressionRaw) {
  try {
    if (!expressionRaw && expressionRaw !== 0) return '';

    let expr = expressionRaw.toString();

    // Handle implicit multiplication like 2(3+4), (2)(3), 2π, π(2), 2sin(30)
    expr = expr.replace(/(\d|\)|π|e|!)\s*\(/g, '$1*(');
    expr = expr.replace(/\)\s*(\d|π|e)/g, ')*$1');
    expr = expr.replace(/(\d)\s*(π|e)/g, '$1*$2');
    expr = expr.replace(/(\d)\s*(?=[a-zA-Z])/g, '$1*');

    // Handle percent calculations smartly based on operator
    expr = expr.replace(/(\d+)\s*([+\-*/])\s*(\d+)%/g, (match, num1, operator, num2) => {
      switch (operator) {
        case '+': return `${num1}+(${num1}*${num2}/100)`;
        case '-': return `${num1}-(${num1}*${num2}/100)`;
        case '*': return `(${num1}*${num2}/100)`;
        case '/': return `(${num1}/(${num2}/100))`;
        default: return match;
      }
    });

    // Handle standalone percentages like 50%
    expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // Replace unicode pi with Math.PI directly (LCD may show π, but code must see Math.PI)
    expr = expr.replace(/π|pi/g, 'Math.PI');

    // Replace 'e' with Math.E
    expr = expr.replace(/\be\b/g, 'Math.E');

    // Handle √ and sqrt( properly
expr = expr.replace(/√\s*\(/g, 'Math.sqrt(');
expr = expr.replace(/√\s*([0-9\.]+)/g, 'Math.sqrt($1)'); // √9 -> Math.sqrt(9)
expr = expr.replace(/Math\.sqrt\(([^()]*(\([^()]*\)[^()]*)*)\)/g, 'Math.sqrt($1)'); // balance inner ()

    // Replace power operator
    expr = expr.replace(/\^/g, '**');

    // Replace trig/log functions to Math.*
    expr = expr
      .replace(/\bsin\(/g, 'Math.sin(')
      .replace(/\bcos\(/g, 'Math.cos(')
      .replace(/\btan\(/g, 'Math.tan(')
      .replace(/\blog\(/g, 'Math.log10(')
      .replace(/\bln\(/g, 'Math.log(');

    // ✅ Convert trig degree inputs to radians (skip if already in radians like π)
    expr = expr.replace(/Math\.(sin|cos|tan)\(\s*([^\)]+)\s*\)/g, (m, fn, arg) => {
      if (/Math\.PI/i.test(arg)) {
        return `Math.${fn}(${arg})`; // radians (like π, π/2)
      }
      return `Math.${fn}((${arg}) * Math.PI / 180)`; // degrees
    });

    // Handle factorial
    expr = expr.replace(/(\d+)!/g, (m, n) => `fact(${n})`);

    // Evaluate safely
    const funcBody = `
      function fact(n){
        n = Math.floor(n);
        if(n < 0) return NaN;
        if(n === 0 || n === 1) return 1;
        let res = 1;
        for(let i=2;i<=n;i++) res *= i;
        return res;
      }
      "use strict";
      return (${expr});
    `;

    const result = Function(funcBody)();

    if (result === Infinity || result === -Infinity || isNaN(result)) return 'Error';

    if (typeof result === 'number') {
      const cleaned = (Math.abs(result) === 0) ? 0 : parseFloat(result.toPrecision(12));
      return cleaned;
    }

    return result;
  } catch (err) {
    return 'Error';
  }
}
