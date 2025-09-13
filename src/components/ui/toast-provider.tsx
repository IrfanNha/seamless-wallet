'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, description?: string, duration?: number) => void;
  error: (title: string, description?: string, duration?: number) => void;
  warning: (title: string, description?: string, duration?: number) => void;
  info: (title: string, description?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'success', title, description, duration });
  }, [addToast]);

  const error = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'error', title, description, duration });
  }, [addToast]);

  const warning = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'warning', title, description, duration });
  }, [addToast]);

  const info = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'info', title, description, duration });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info,
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{
  toasts: Toast[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{
  toast: Toast;
  onRemove: () => void;
}> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getColorClasses = () => {
    switch (toast.type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`
        relative p-4 rounded-lg border shadow-lg backdrop-blur-sm
        ${getColorClasses()}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {toast.title}
          </h4>
          {toast.description && (
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {toast.description}
            </p>
          )}
        </div>

        <button
          onClick={onRemove}
          className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </motion.div>
  );
};

// Export simple toast function for backward compatibility
export const toast = {
  success: (title: string, options?: { description?: string; duration?: number }) => {
    // This will work after ToastProvider is mounted
    const event = new CustomEvent('toast', {
      detail: { type: 'success', title, ...options }
    });
    window.dispatchEvent(event);
  },
  error: (title: string, options?: { description?: string; duration?: number }) => {
    const event = new CustomEvent('toast', {
      detail: { type: 'error', title, ...options }
    });
    window.dispatchEvent(event);
  },
};