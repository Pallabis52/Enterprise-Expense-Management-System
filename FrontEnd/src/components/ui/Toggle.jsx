import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const Toggle = ({ checked, onChange, label, disabled = false, className }) => {
    return (
        <div className={cn('flex items-center', className)}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={cn(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
                    checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <span className="sr-only">Use setting</span>
                <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                    className={cn(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        checked ? 'translate-x-5' : 'translate-x-0'
                    )}
                />
            </button>
            {label && (
                <span
                    className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                    onClick={() => !disabled && onChange(!checked)}
                >
                    {label}
                </span>
            )}
        </div>
    );
};

export default Toggle;
