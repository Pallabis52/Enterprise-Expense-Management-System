import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import Loader from './Loader';

const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30',
    secondary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/30',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
};

const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    ...props
}, ref) => {
    return (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && (
                <span className="mr-2">
                    <Loader size="sm" color="current" />
                </span>
            )}
            {children}
        </motion.button>
    );
});

Button.displayName = 'Button';

export default Button;
