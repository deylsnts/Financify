import React from "react";
import { motion } from "framer-motion";

export default function AuthModal({ children, isOpen, onClose, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-xl"
        >
          ×
        </button>

        {/* Modal header */}
        <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>

        {/* Modal children (form content) */}
        {children}
      </motion.div>
    </div>
  );
}
