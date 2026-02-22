import React, { useState, useId } from 'react';
import { cn } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Input = React.forwardRef(({ className, label, error, icon: Icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = useId();
    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    {...props}
                    type={props.type === "password" ? (showPassword ? "text" : "password") : props.type}
                    className={cn(
                        "block w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:border-primary-500",
                        Icon && "pl-10",
                        props.type === "password" && "pr-10",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                        className
                    )}
                    aria-label={label}
                />
                {props.type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                )}
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 mt-1 ml-1"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
