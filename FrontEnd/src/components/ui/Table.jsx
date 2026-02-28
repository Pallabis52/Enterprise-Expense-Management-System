import React from 'react';
import { ChevronUpIcon, ChevronDownIcon, ArrowsUpDownIcon } from '@heroicons/react/20/solid';
import { cn } from '../../utils/helpers';
import Skeleton from './Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Table - Ultra-Premium Edition
 * Features:
 * - Glassmorphic container with backdrop blur
 * - Framer Motion row transitions and hover states
 * - Refined typography and minimalistic sorting icons
 * - Subtle gradient accents
 */
const Table = ({
    columns,
    data,
    isLoading = false,
    loading = false, // Support both naming conventions
    onSort,
    sortConfig,
    onRowClick,
    rowClassName,
    emptyMessage = "No data found."
}) => {
    const activeLoading = isLoading || loading;
    return (
        <div className="relative overflow-hidden rounded-[24px] bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-2xl shadow-indigo-500/5">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead className="sticky top-0 z-10 bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border-b border-white/10 dark:border-gray-800">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className={cn(
                                        "px-6 py-5 first:pl-8 last:pr-8",
                                        column.sortable && "cursor-pointer hover:bg-white/5 dark:hover:bg-gray-800/20 transition-all duration-300 select-none",
                                        column.className
                                    )}
                                    onClick={() => column.sortable && onSort && onSort(column.key)}
                                >
                                    <div className="flex items-center gap-2 group/header">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 group-hover/header:text-indigo-500 dark:group-hover/header:text-indigo-400 transition-colors">
                                            {column.title}
                                        </span>
                                        {column.sortable && (
                                            <span className="flex-shrink-0">
                                                {sortConfig?.key === column.key ? (
                                                    sortConfig.direction === 'asc' ? (
                                                        <ChevronUpIcon className="h-3.5 w-3.5 text-indigo-500 animate-bounce" />
                                                    ) : (
                                                        <ChevronDownIcon className="h-3.5 w-3.5 text-indigo-500 animate-bounce" />
                                                    )
                                                ) : (
                                                    <ArrowsUpDownIcon className="h-3 w-3 text-gray-300 dark:text-gray-600 opacity-0 group-hover/header:opacity-100 transition-opacity" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="relative">
                        <AnimatePresence mode='popLayout'>
                            {activeLoading ? (
                                // Loading Skeletons with shimmer
                                Array.from({ length: 6 }).map((_, idx) => (
                                    <tr key={`skeleton-${idx}`}>
                                        {columns.map((col, colIdx) => (
                                            <td key={`skeleton-td-${colIdx}`} className="px-6 py-5 first:pl-8 last:pr-8">
                                                <Skeleton className="h-4 w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : data && data.length > 0 ? (
                                data.map((row, rowIdx) => (
                                    <motion.tr
                                        key={row.id || rowIdx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: rowIdx * 0.05,
                                            ease: [0.23, 1, 0.32, 1]
                                        }}
                                        onClick={() => onRowClick && onRowClick(row)}
                                        className={cn(
                                            "group relative transition-all duration-300 border-b border-gray-100/50 dark:border-gray-800/50 last:border-none",
                                            onRowClick
                                                ? "cursor-pointer hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10"
                                                : "hover:bg-gray-50/30 dark:hover:bg-gray-800/30",
                                            rowClassName && rowClassName(row)
                                        )}
                                    >
                                        {columns.map((column, colIdx) => (
                                            <td
                                                key={column.key}
                                                className={cn(
                                                    "px-6 py-5 first:pl-8 last:pr-8 text-gray-600 dark:text-gray-300 font-medium transition-colors group-hover:text-gray-900 dark:group-hover:text-white",
                                                    column.cellClassName
                                                )}
                                            >
                                                <div className="relative z-10">
                                                    {column.render ? column.render(row) : row[column.key]}
                                                </div>
                                                {/* Subtle Left Border Accent on Hover - Moved inside first TD for DOM valid nesting */}
                                                {colIdx === 0 && (
                                                    <div className="absolute inset-y-0 left-0 w-[3px] bg-indigo-500 scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 transition-all duration-300 rounded-r-full" />
                                                )}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-20 text-center">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center gap-3"
                                        >
                                            <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                                <ArrowsUpDownIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide italic">
                                                {emptyMessage}
                                            </p>
                                        </motion.div>
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Custom Bottom Lighting Effect */}
            <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-[1px]" />
        </div>
    );
};

export default Table;
