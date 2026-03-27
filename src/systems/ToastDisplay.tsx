import React from 'react';
import { useToastStore } from './toastManager';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-bright-lime" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-gold" />,
};

export const ToastDisplay: React.FC = () => {
  const { toasts, removeToast, confirmAction, clearConfirm } = useToastStore();

  return (
    <>
      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="bg-white border border-cool-gray-light shadow-lg rounded-lg p-4 flex items-start gap-3 w-80 pointer-events-auto"
            >
              <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-forest-black">{toast.title}</h4>
                {toast.message && <p className="text-xs text-cool-gray mt-1">{toast.message}</p>}
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-cool-gray hover:text-forest-black">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {confirmAction.isDestructive ? (
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Info className="w-5 h-5" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-forest-black">{confirmAction.title}</h3>
                </div>
                <p className="text-cool-gray text-sm mb-6">{confirmAction.message}</p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={clearConfirm}
                    className="px-4 py-2 rounded-md text-sm font-medium text-forest-black bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {confirmAction.cancelText}
                  </button>
                  <button
                    onClick={() => {
                      confirmAction.onConfirm();
                      clearConfirm();
                    }}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium text-white transition-colors",
                      confirmAction.isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-forest-black hover:bg-forest-dark"
                    )}
                  >
                    {confirmAction.confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
