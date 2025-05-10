import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [history, setHistory] = useState([]);

  // Add calculation to history
  const addToHistory = (expression, result) => {
    const newItem = {
      id: Date.now(),
      expression,
      result,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep only last 10 calculations
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome to calc-world
        </h1>
        <p className="text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
          Your smart calculation companion with memory functions and history tracking
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MainFeature addToHistory={addToHistory} />
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">
              Calculation History
            </h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              >
                <Info size={18} className="text-surface-500 dark:text-surface-300" />
              </motion.button>
              {history.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearHistory}
                  className="text-sm px-3 py-1 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                >
                  Clear
                </motion.button>
              )}
            </div>
          </div>
          
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-3 bg-primary-light/10 dark:bg-primary-dark/20 rounded-xl text-sm text-surface-700 dark:text-surface-200">
                  Your calculation history is stored temporarily in this session. 
                  It will be cleared when you refresh the page.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-hide">
            {history.length === 0 ? (
              <div className="text-center py-8 text-surface-400 dark:text-surface-500">
                <p>No calculations yet</p>
                <p className="text-sm mt-2">Your history will appear here</p>
              </div>
            ) : (
              history.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl border border-surface-200 dark:border-surface-600"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-surface-600 dark:text-surface-300 font-mono">
                        {item.expression}
                      </div>
                      <div className="text-lg font-semibold text-surface-800 dark:text-surface-100 font-mono">
                        = {item.result}
                      </div>
                    </div>
                    <div className="text-xs text-surface-400 dark:text-surface-500">
                      {item.timestamp}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;