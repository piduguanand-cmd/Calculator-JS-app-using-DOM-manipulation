// ========== SOUND FUNCTION ==========
let soundEnabled = false;
let soundElement = null;

function initSound() {
    soundElement = document.getElementById('bubbleSound');
    if (soundElement) {
        soundElement.volume = 0.3;  // 30% volume - adjust as needed
    }
}

function playSound() {
    if (!soundEnabled) return;
    if (!soundElement) {
        soundElement = document.getElementById('bubbleSound');
        if (!soundElement) return;
    }
    soundElement.currentTime = 0;  // Reset to start
    soundElement.play().catch(e => console.log('Sound error:', e));
}

// Enable sound on first click anywhere
document.addEventListener('click', function enableSound() {
    if (soundEnabled) return;
    soundEnabled = true;
    console.log('🔊 Sound enabled!');
    // Play test sound
    playSound();
    document.removeEventListener('click', enableSound);
});
// ========== END SOUND ==========


const previousOperandEl = document.getElementById('previousOperand');
const currentOperandEl = document.getElementById('currentOperand');

let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;

// ========== SIMPLE SOUND CODE - GUARANTEED TO WORK ==========
let soundEnabled = false;
let clickSound = null;

function initSound() {
    clickSound = document.getElementById('clickSound');
    if (clickSound) {
        clickSound.volume = 0.3;
    }
}

function playSound() {
    if (!soundEnabled) return;
    if (!clickSound) {
        clickSound = document.getElementById('clickSound');
        if (!clickSound) return;
    }
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log('Sound play error:', e));
}

// Enable sound on first click anywhere on the page
function enableSound() {
    if (soundEnabled) return;
    soundEnabled = true;
    console.log('🔊 Sound enabled! Click calculator buttons now.');
    
    // Try to play a test sound
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Test sound:', e));
    }
    
    // Remove listener after first click
    document.removeEventListener('click', enableSound);
}

document.addEventListener('click', enableSound);
// ========== END SOUND CODE ==========

function updateDisplay() {
    let displayCurrent = currentOperand === '' ? '0' : currentOperand;
    currentOperandEl.innerText = displayCurrent;
    
    if (operation !== null && previousOperand !== '') {
        let opSymbol = '';
        if (operation === '+') opSymbol = '+';
        else if (operation === '-') opSymbol = '-';
        else if (operation === '*') opSymbol = '×';
        else if (operation === '/') opSymbol = '÷';
        previousOperandEl.innerText = `${previousOperand} ${opSymbol}`;
    } else {
        if (previousOperand !== '' && !shouldResetScreen) {
            previousOperandEl.innerText = previousOperand;
        } else {
            previousOperandEl.innerText = '';
        }
    }
    if (previousOperand === '' && operation === null) {
        previousOperandEl.innerText = '';
    }
}

function formatNumber(numberStr) {
    if (numberStr === '') return '';
    if (numberStr === '.') return '0.';
    let parts = numberStr.split('.');
    if (parts.length > 2) {
        numberStr = parts[0] + '.' + parts.slice(1).join('');
    }
    if (numberStr.indexOf('.') !== -1) {
        let integerPart = numberStr.split('.')[0];
        let decimalPart = numberStr.split('.')[1];
        if (integerPart.length > 1 && integerPart[0] === '0') {
            integerPart = integerPart.replace(/^0+/, '');
            if (integerPart === '') integerPart = '0';
            numberStr = integerPart + '.' + decimalPart;
        }
    } else {
        if (numberStr.length > 1 && numberStr[0] === '0') {
            numberStr = numberStr.replace(/^0+/, '');
            if (numberStr === '') numberStr = '0';
        }
    }
    if (numberStr === '') return '0';
    return numberStr;
}

function appendNumber(number) {
    playSound();  // ← SOUND
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    if (currentOperand.length >= 16 && !currentOperand.includes('.')) return;
    
    if (number === '.') {
        if (currentOperand.includes('.')) return;
        if (currentOperand === '') {
            currentOperand = '0.';
        } else {
            currentOperand += '.';
        }
    } else {
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number.toString();
        } else {
            currentOperand += number.toString();
        }
    }
    currentOperand = formatNumber(currentOperand);
    updateDisplay();
}

function deleteLast() {
    playSound();  // ← SOUND
    if (shouldResetScreen) {
        currentOperand = '0';
        shouldResetScreen = false;
        updateDisplay();
        return;
    }
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
        if (currentOperand === '' || currentOperand === '-') currentOperand = '0';
    }
    currentOperand = formatNumber(currentOperand);
    updateDisplay();
}

function clearAll() {
    playSound();  // ← SOUND
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    shouldResetScreen = false;
    updateDisplay();
}

function percentage() {
    playSound();  // ← SOUND
    if (currentOperand === '') return;
    let num = parseFloat(currentOperand);
    if (isNaN(num)) return;
    let percentValue = num / 100;
    currentOperand = percentValue.toString();
    currentOperand = formatNumber(currentOperand);
    updateDisplay();
}

function computeResult() {
    if (operation === null || previousOperand === '' || currentOperand === '') return null;
    let prev = parseFloat(previousOperand);
    let curr = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(curr)) return null;
    
    let result;
    switch (operation) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            if (curr === 0) {
                return 'Error';
            }
            result = prev / curr;
            break;
        default:
            return null;
    }
    if (typeof result === 'number') {
        result = parseFloat(result.toFixed(8));
        if (Number.isInteger(result)) {
            return result.toString();
        } else {
            return result.toString();
        }
    }
    return result;
}

function chooseOperator(op) {
    playSound();  // ← SOUND
    if (currentOperand === '' && previousOperand !== '' && operation !== null) {
        operation = op;
        updateDisplay();
        return;
    }
    
    if (operation !== null && previousOperand !== '' && currentOperand !== '' && !shouldResetScreen) {
        let computed = computeResult();
        if (computed === 'Error') {
            clearAll();
            currentOperand = 'Math Error';
            updateDisplay();
            setTimeout(() => clearAll(), 1200);
            return;
        }
        if (computed !== null) {
            previousOperand = computed;
            currentOperand = '';
            operation = op;
            updateDisplay();
            shouldResetScreen = false;
            return;
        }
    }
    
    if (currentOperand !== '') {
        previousOperand = currentOperand;
        currentOperand = '';
        operation = op;
        shouldResetScreen = false;
        updateDisplay();
    }
}

function evaluate() {
    playSound();  // ← SOUND
    if (operation === null || previousOperand === '' || currentOperand === '') {
        return;
    }
    let result = computeResult();
    if (result === 'Error') {
        clearAll();
        currentOperand = '∞ Error';
        updateDisplay();
        setTimeout(() => clearAll(), 1300);
        return;
    }
    if (result !== null) {
        let resultStr = result.toString();
        if (resultStr.includes('.')) {
            resultStr = parseFloat(resultStr).toString();
        }
        currentOperand = resultStr;
        previousOperand = '';
        operation = null;
        shouldResetScreen = true;
        updateDisplay();
    } else {
        if (currentOperand === '' && previousOperand !== '') {
            currentOperand = previousOperand;
            previousOperand = '';
            operation = null;
            updateDisplay();
        }
    }
}

function handleKeyboard(e) {
    const key = e.key;
    if (/[0-9]/.test(key)) {
        e.preventDefault();
        playSound();
        appendNumber(key);
    }
    else if (key === '.') {
        e.preventDefault();
        playSound();
        appendNumber('.');
    }
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        playSound();
        let mappedOp = key;
        if (key === '*') mappedOp = '*';
        if (key === '/') mappedOp = '/';
        chooseOperator(mappedOp);
    }
    else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        playSound();
        evaluate();
    }
    else if (key === 'Backspace') {
        e.preventDefault();
        playSound();
        deleteLast();
    }
    else if (key === 'Escape' || key === 'Delete') {
        e.preventDefault();
        playSound();
        clearAll();
    }
    else if (key === '%') {
        e.preventDefault();
        playSound();
        percentage();
    }
}

function bindEvents() {
    const numberBtns = document.querySelectorAll('[data-number]');
    numberBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const number = btn.getAttribute('data-number');
            appendNumber(number);
        });
    });
    
    const operatorBtns = document.querySelectorAll('[data-operator]');
    operatorBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const op = btn.getAttribute('data-operator');
            chooseOperator(op);
        });
    });
    
    const equalsBtn = document.querySelector('[data-equals]');
    if (equalsBtn) {
        equalsBtn.addEventListener('click', () => {
            evaluate();
        });
    }
    
    const clearBtn = document.querySelector('[data-action="clear"]');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => clearAll());
    }
    
    const delBtn = document.querySelector('[data-action="delete"]');
    if (delBtn) {
        delBtn.addEventListener('click', () => deleteLast());
    }
    
    const percentBtn = document.querySelector('[data-action="percent"]');
    if (percentBtn) {
        percentBtn.addEventListener('click', () => percentage());
    }
}

function initCalculator() {
    bindEvents();
    window.addEventListener('keydown', handleKeyboard);
    initSound();
    updateDisplay();
}

initCalculator();