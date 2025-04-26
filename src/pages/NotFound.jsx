import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-dark dark:text-primary-light">404</h1>
          <div className="h-2 w-24 bg-accent mx-auto my-6 rounded-full"></div>
          <h2 className="text-2xl font-semibold mb-4 text-surface-800 dark:text-surface-100">
            Page Not Found
          </h2>
          <p className="text-surface-600 dark:text-surface-300 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors shadow-soft"
          >
            <ArrowLeft size={18} />
            <span>Back to Calculator</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;