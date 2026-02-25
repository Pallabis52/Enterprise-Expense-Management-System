import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

/**
 * Ultra-Premium DatePicker (Native Engine)
 * Features: Holographic UI, Smooth Transitions, No Dependencies
 */
const DatePicker = ({ value, onChange, placeholder = "Select Date", label, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef(null);

    // Helpers using native Date
    const formatMonth = (date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const formatDatePPP = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('default', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date) => {
        if (!value) return false;
        const d = new Date(value);
        return date.getDate() === d.getDate() &&
            date.getMonth() === d.getMonth() &&
            date.getFullYear() === d.getFullYear();
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateSelect = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        onChange(`${year}-${month}-${day}`);
        setIsOpen(false);
    };

    const changeMonth = (offset) => {
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
        setCurrentMonth(newMonth);
    };

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between px-4 py-4 rounded-t-[2rem] bg-gradient-to-br from-gray-900 to-primary-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
                <div className="relative z-10 flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-0.5">Tactical Timeline</span>
                    <h4 className="text-xl font-black">{formatMonth(currentMonth)}</h4>
                </div>
                <div className="flex gap-2 relative z-10">
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); changeMonth(-1); }}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); changeMonth(1); }}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    const renderCells = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        // Empty cells for first week
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        // Month days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const selected = isSelected(date);
            const today = isToday(date);

            days.push(
                <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                        relative h-10 w-10 flex items-center justify-center cursor-pointer m-0.5 rounded-xl text-xs font-bold transition-all
                        ${selected
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/40'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                    `}
                    onClick={() => handleDateSelect(date)}
                >
                    {i}
                    {today && !selected && (
                        <div className="absolute bottom-1.5 w-1 h-1 bg-primary-500 rounded-full"></div>
                    )}
                </motion.div>
            );
        }

        return <div className="grid grid-cols-7 px-2 pb-2">{days}</div>;
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 px-1">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full h-11 px-4 rounded-[14px] flex items-center justify-between transition-all duration-300
                    bg-white/50 dark:bg-gray-900/50 border border-white/20 dark:border-gray-700/30
                    hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/5
                `}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <CalendarIcon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span className={`text-[10px] font-black uppercase tracking-wider truncate ${value ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                        {value ? formatDatePPP(value) : placeholder}
                    </span>
                </div>
                {value && (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onChange(''); }}
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <XMarkIcon className="w-3 h-3 text-gray-400" />
                    </button>
                )}
            </button>

            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 mt-3 z-[100] w-[320px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden"
                    >
                        {renderHeader()}
                        <div className="p-4">
                            <div className="grid grid-cols-7 mb-2">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <div key={day} className="text-center text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            {renderCells()}

                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 px-2 pb-2">
                                <button
                                    type="button"
                                    onClick={() => handleDateSelect(new Date())}
                                    className="flex-1 py-3 rounded-2xl bg-primary-600/10 hover:bg-primary-600/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Current
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { onChange(''); setIsOpen(false); }}
                                    className="flex-1 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DatePicker;
