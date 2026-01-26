import React from 'react';
import { cn } from '../../utils/helpers';
import { motion } from 'framer-motion';

const Loader = ({ className, size = 'md', color = 'primary' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    const colorClasses = {
        primary: 'border-primary-600 border-t-transparent',
        white: 'border-white border-t-transparent',
        current: 'border-current border-t-transparent',
    };

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={cn(
                'rounded-full',
                sizeClasses[size],
                colorClasses[color],
                className
            )}
        />
    );
};

export default Loader;
