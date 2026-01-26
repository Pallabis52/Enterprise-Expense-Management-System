import React from 'react';
import { cn } from '../../utils/helpers';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-700', className)}
            {...props}
        />
    );
};

export default Skeleton;
