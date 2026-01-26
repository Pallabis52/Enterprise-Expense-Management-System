import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Need to make sure heroicons is installed or use an SVG
import { cn } from '../../utils/helpers';
// Using a simple SVG for close icon to avoid dependency issues if heroicons isn't there
const CloseIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Modal = ({ isOpen, onClose, title, children, className }) => {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={cn(
                            "relative w-full max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all dark:bg-gray-800",
                            className
                        )}
                    >
                        <div className="flex items-center justify-between mb-4">
                            {title && (
                                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                    {title}
                                </h3>
                            )}
                            <button
                                type="button"
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                                onClick={onClose}
                            >
                                <CloseIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
