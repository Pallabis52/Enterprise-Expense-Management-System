import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

/**
 * CustomDropdown - A premium, HUD-style, animated select replacement.
 * Optimized for Enterprise "Mission Control" aesthetic.
 * 
 * @param {Array} options - List of { label, value, icon, iconColor, description }
 * @param {string} value - Current selected value
 * @param {function} onChange - Callback for value change
 * @param {string} label - Optional field label
 * @param {string} className - Additional wrapper classes
 * @param {boolean} error - Error state
 */
const CustomDropdown = ({ options = [], value, onChange, label, className = "", error = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0] || { label: 'Select...', value: '' };

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
        <div className={`relative flex flex-col gap-1.5 ${className}`} ref={dropdownRef}>
            {label && (
                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] px-1">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative group flex items-center justify-between w-full px-5 h-12 text-sm font-bold
                    bg-white dark:bg-[#05070a]/40 border rounded-2xl backdrop-blur-xl transition-all duration-500
                    ${isOpen
                        ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-[0_0_20px_rgba(79,70,229,0.1)]'
                        : error
                            ? 'border-red-500/50 dark:border-red-500/30'
                            : 'border-gray-200 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-500/30'}
                    text-gray-900 dark:text-white outline-none
                `}
            >
                {/* Background Subtle Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-2xl pointer-events-none" />

                <div className="flex items-center gap-3 relative z-10">
                    {selectedOption.icon && (
                        <div className={`p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 ${selectedOption.iconColor || 'text-indigo-500'}`}>
                            {React.cloneElement(selectedOption.icon, { className: "w-4 h-4" })}
                        </div>
                    )}
                    <span className="truncate tracking-tight uppercase italic">{selectedOption.label}</span>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isOpen ? 'bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.8)]' : 'bg-white/10'}`} />
                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 dark:text-white/20 transition-transform duration-700 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute top-full left-0 z-[100] w-full min-w-[240px] mt-2 overflow-hidden bg-white/90 dark:bg-[#0a0c10]/95 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        {/* Interactive Scanline Effect */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/30 animate-scanline" />

                        <div className="p-2 max-h-[320px] overflow-y-auto custom-scrollbar">
                            {options.map((option, idx) => {
                                const isSelected = value === option.value;
                                return (
                                    <motion.button
                                        key={option.value}
                                        type="button"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            group flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-300
                                            relative overflow-hidden
                                            ${isSelected
                                                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                : 'text-gray-600 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:text-gray-900 dark:hover:text-white'}
                                        `}
                                    >
                                        <div className={`
                                            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500
                                            ${isSelected
                                                ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                                                : 'bg-gray-100 dark:bg-white/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'}
                                        `}>
                                            {option.icon ? (
                                                React.cloneElement(option.icon, { className: "w-4 h-4" })
                                            ) : (
                                                <span className="text-[10px] font-black">{option.label.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-start min-w-0">
                                            <span className="text-xs font-black tracking-tight uppercase italic truncate">{option.label}</span>
                                            {option.description && (
                                                <span className="text-[9px] font-bold opacity-50 truncate uppercase tracking-tighter">{option.description}</span>
                                            )}
                                        </div>

                                        {isSelected && (
                                            <motion.div
                                                layoutId="selected-indicator"
                                                className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white shadow-lg"
                                            >
                                                <CheckIcon className="w-3 h-3 stroke-[3]" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDropdown;
