import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * CustomDropdown - A premium, animated select replacement.
 * @param {Array} options - List of { label, value, icon, iconColor }
 * @param {string} value - Current selected value
 * @param {function} onChange - Callback for value change
 * @param {string} className - Additional wrapper classes
 */
const CustomDropdown = ({ options, value, onChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between w-full px-4 py-2.5 text-xs font-bold
                    bg-gray-100/30 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700
                    text-gray-900 dark:text-white rounded-[14px]
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                    transition-all duration-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50
                    backdrop-blur-sm shadow-sm
                `}
            >
                <div className="flex items-center gap-2">
                    {selectedOption.icon && (
                        <span className={selectedOption.iconColor}>{selectedOption.icon}</span>
                    )}
                    <span className="truncate">{selectedOption.label}</span>
                </div>
                <ChevronDownIcon className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 6, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                        }}
                        className="absolute z-[9999] w-full min-w-[200px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[18px] shadow-2xl shadow-indigo-500/20"
                    >
                        <div className="p-1.5">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        flex items-center gap-3 w-full px-3 py-2 text-[11px] font-bold rounded-[12px]
                                        transition-all duration-200
                                        ${value === option.value
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}
                                    `}
                                >
                                    <div className={`p-1 rounded-lg ${value === option.value ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-transparent'}`}>
                                        {option.icon ? (
                                            <span className={`w-4 h-4 flex items-center justify-center ${value === option.value ? option.iconColor : 'text-gray-400 dark:text-gray-500'}`}>
                                                {React.cloneElement(option.icon, { className: "w-3.5 h-3.5" })}
                                            </span>
                                        ) : (
                                            <div className="w-3.5 h-3.5" />
                                        )}
                                    </div>
                                    <span className="flex-1 text-left">{option.label}</span>
                                    {value === option.value && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDropdown;
