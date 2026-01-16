import React from 'react';
import { cn } from '../../utils/helpers';

const variants = {
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    error: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 border-primary-200 dark:border-primary-800',
};

const Badge = ({ children, variant = 'neutral', className, ...props }) => {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
