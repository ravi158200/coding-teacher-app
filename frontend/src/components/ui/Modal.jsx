import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-xl" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`w-full ${maxWidth} bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl relative pointer-events-auto border border-white/20 dark:border-white/10`}
            >
              <div className="flex justify-between items-center mb-6">
                {title && <h3 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100">{title}</h3>}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="relative z-10">
                {children}
              </div>
              {/* Subtle mesh background element inside modal */}
              <div className="absolute top-0 right-0 -z-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
