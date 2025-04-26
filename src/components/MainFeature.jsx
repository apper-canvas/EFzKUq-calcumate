import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  RotateCcw, 
  Percent, 
  Divide, 
  X, 
  Minus, 
  Plus, 
  Equal, 
  Database,
  Save
} from 'lucide-react';

const MainFeature = ({ addToHistory }) => {
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState(null);
  const [storedValue, setStoredValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [showMemory, setShowMemory] = useState(false);
  
  // Handle digit input
  const handleDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };
  
  // Handle decimal point
  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };
  
  // Handle operations
  const handleOperation = (nextOperation) => {
    const inputValue = parseFloat(display);
    
    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (operation) {
      const result = calculate(storedValue, inputValue, operation);
      setStoredValue(result);
      setDisplay(String(result));
      
      // Add to history when chaining operations
      if (currentValue !== null) {
        const expression = `${storedValue} ${getOperationSymbol(operation)} ${inputValue}`;
        addToHistory(expression, result);
      }
    }
    
    setWaitingForOperand(true);
    setOperation(nextOperation);
    setCurrentValue(inputValue);
  };
  
  // Handle equals
  const handleEquals = () => {
    if (operation && storedValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(storedValue, inputValue, operation);
      
      // Create expression for history
      const expression = `${storedValue} ${getOperationSymbol(operation)} ${inputValue}`;
      
      // Update calculator state
      setDisplay(String(result));
      setStoredValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      setCurrentValue(result);
      
      // Add to history
      addToHistory(expression, result);
    }
  };
  
  // Calculate result based on operation
  const calculate = (a, b, operation) => {
    switch (operation) {
      case 'add': return a + b;
      case 'subtract': return a - b;
      case 'multiply': return a * b;
      case 'divide': return b !== 0 ? a / b : 'Error';
      case 'percent': return (a * b) / 100;
      default: return b;
    }
  };
  
  // Get operation symbol for display
  const getOperationSymbol = (op) => {
    switch (op) {
      case 'add': return '+';
      case 'subtract': return '-';
      case 'multiply': return '×';
      case 'divide': return '÷';
      case 'percent': return '%';
      default: return '';
    }
  };
  
  // Clear calculator
  const handleClear = () => {
    setDisplay('0');
    setCurrentValue(null);
    setStoredValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };
  
  // Clear entry
  const handleClearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };
  
  // Memory functions
  const handleMemoryAdd = () => {
    setMemory(memory + parseFloat(display));
    setWaitingForOperand(true);
    setShowMemory(true);
    setTimeout(() => setShowMemory(false), 2000);
  };
  
  const handleMemorySubtract = () => {
    setMemory(memory - parseFloat(display));
    setWaitingForOperand(true);
    setShowMemory(true);
    setTimeout(() => setShowMemory(false), 2000);
  };
  
  const handleMemoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(false);
  };
  
  const handleMemoryClear = () => {
    setMemory(0);
    setShowMemory(true);
    setTimeout(() => setShowMemory(false), 2000);
  };
  
  // Format display value
  const formatDisplay = (value) => {
    if (value === 'Error') return 'Error';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    // Handle large numbers
    if (Math.abs(numValue) >= 1e10) {
      return numValue.toExponential(5);
    }
    
    // Format with commas for thousands
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return parts.join('.');
  };
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(parseInt(e.key, 10));
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperation('add');
      } else if (e.key === '-') {
        handleOperation('subtract');
      } else if (e.key === '*') {
        handleOperation('multiply');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperation('divide');
      } else if (e.key === '%') {
        handleOperation('percent');
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Backspace') {
        if (display !== '0' && !waitingForOperand) {
          setDisplay(display.length === 1 ? '0' : display.slice(0, -1));
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, waitingForOperand, storedValue, operation]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-surface-800 rounded-2xl shadow-card overflow-hidden"
    >
      {/* Calculator display */}
      <div className="relative p-6 bg-gradient-to-r from-primary-dark/10 to-primary-light/10 dark:from-primary-dark/20 dark:to-primary-light/20">
        <AnimatePresence>
          {showMemory && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-2 right-6 bg-surface-800/90 dark:bg-surface-900/90 text-white px-3 py-1 rounded-lg text-sm"
            >
              Memory: {memory}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="text-right mb-2">
          <span className="text-sm text-surface-500 dark:text-surface-400 font-mono">
            {operation && `${storedValue} ${getOperationSymbol(operation)}`}
          </span>
        </div>
        
        <div className="calculator-display text-right text-4xl font-semibold text-surface-800 dark:text-surface-100 font-mono overflow-x-auto whitespace-nowrap scrollbar-hide">
          {formatDisplay(display)}
        </div>
      </div>
      
      {/* Memory buttons */}
      <div className="grid grid-cols-4 gap-3 p-4 bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleMemoryClear}
          className="special-btn"
        >
          MC
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleMemoryRecall}
          className="special-btn"
        >
          MR
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleMemoryAdd}
          className="special-btn"
        >
          M+
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleMemorySubtract}
          className="special-btn"
        >
          M-
        </motion.button>
      </div>
      
      {/* Calculator keypad */}
      <div className="grid grid-cols-4 gap-3 p-4 bg-surface-50 dark:bg-surface-900">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
          className="clear-btn"
        >
          <Trash2 size={20} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleClearEntry}
          className="clear-btn"
        >
          <RotateCcw size={20} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOperation('percent')}
          className="operation-btn"
        >
          <Percent size={20} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOperation('divide')}
          className="operation-btn"
        >
          <Divide size={20} />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDigit(7)}
          className="digit-btn"
        >
          7
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDigit(8)}
          className="digit-btn"
        >
          8
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDigit(9)}
          className="digit-btn"
        >
          9
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOperation('multiply')}
          className="operation-btn"
        >
          <X size={20} />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDigit(4)}
          className="digit-btn"
        >
          4
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDigit(5)}
          className="digit-btn"
        >
          5
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDigit(6)}
          className="digit-btn"
        >
          6
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOperation('subtract')}
          className="operation-btn"
        >
          <Minus size={20} />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDigit(1)}
          className="digit-btn"
        >
          1
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDigit(2)}
          className="digit-btn"
        >
          2
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDigit(3)}
          className="digit-btn"
        >
          3
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOperation('add')}
          className="operation-btn"
        >
          <Plus size={20} />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDigit(0)}
          className="digit-btn col-span-2"
        >
          0
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDecimal}
          className="digit-btn"
        >
          .
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleEquals}
          className="equals-btn"
        >
          <Equal size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MainFeature;