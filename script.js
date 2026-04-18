let currentInput = "0";
let expression = "";
let shouldResetScreen = false;

const mainDisplay = document.getElementById('main-display');
const expressionDisplay = document.getElementById('expression');

// --- Main Functions ---

function appendNumber(num) {
    if (currentInput === "0" || shouldResetScreen) resetScreen();
    if (num === "." && currentInput.includes(".")) return;
    currentInput += num;
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === "Error") return;
    if (expression !== "") calculate();
    expression = `${currentInput} ${op}`;
    shouldResetScreen = true;
    updateDisplay();
}

function calculate() {
    if (shouldResetScreen || expression === "") return;
    
    let result;
    const parts = expression.split(" ");
    const prev = parseFloat(parts[0]);
    const current = parseFloat(currentInput);
    const op = parts[1];

    switch (op) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '%': result = prev % current; break;
        case '/': 
            if (current === 0) {
                showError();
                return;
            }
            result = prev / current; 
            break;
        default: return;
    }

    currentInput = result.toString();
    expression = "";
    shouldResetScreen = true;
    updateDisplay();
}

// --- Utilities ---

function clearAll() {
    currentInput = "0";
    expression = "";
    mainDisplay.classList.remove('error');
    updateDisplay();
}

function toggleSign() {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

function showError() {
    currentInput = "Error";
    mainDisplay.classList.add('error');
    expression = "";
    updateDisplay();
}

function resetScreen() {
    currentInput = "";
    shouldResetScreen = false;
    mainDisplay.classList.remove('error');
}

function updateDisplay() {
    mainDisplay.innerText = currentInput;
    expressionDisplay.innerText = expression;
    
    // Auto-shrinking font logic
    mainDisplay.classList.remove('small-text', 'v-small-text');
    if (currentInput.length > 8) mainDisplay.classList.add('small-text');
    if (currentInput.length > 12) mainDisplay.classList.add('v-small-text');
}

// --- Keyboard Support ---

window.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '=' || e.key === 'Enter') calculate();
    if (e.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1) || "0";
        updateDisplay();
    }
    if (e.key === 'Escape') clearAll();
    if (['+', '-', '*', '/', '%'].includes(e.key)) appendOperator(e.key);
});
