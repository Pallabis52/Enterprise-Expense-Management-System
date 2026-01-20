import React from 'react';
import { InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon, BellIcon } from '@heroicons/react/24/outline';


const NotificationItem = ({ notification, onClick }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'WARNING': return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />;
            case 'SUCCESS': return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
            case 'ACTION': return <BellIcon className="w-5 h-5 text-blue-500" />;
            default: return <InformationCircleIcon className="w-5 h-5 text-gray-400" />;
        }
    };

    const timeAgo = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000); // seconds
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return d.toLocaleDateString();
    };

    return (
        <div
            onClick={() => onClick(notification)}
            className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                }`}
        >
            <div className="flex gap-3">
                <div className="mt-1 flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                        {notification.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        {notification.createdAt ? timeAgo(notification.createdAt) : ''}
                    </p>
                </div>
                {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;
