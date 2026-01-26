import React, { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationPanel from './NotificationPanel';
import useNotificationStore from '../../store/notificationStore';
import useAuthStore from '../../store/authStore';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const bellRef = useRef(null);
    const { unreadCount, fetchNotifications, connectWebSocket, disconnectWebSocket } = useNotificationStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            fetchNotifications();
            connectWebSocket();
        }
        return () => {
            disconnectWebSocket();
        }
    }, [user]);

    return (
        <div className="relative">
            <button
                ref={bellRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors relative"
            >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                )}
            </button>

            <NotificationPanel
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                anchorRef={bellRef}
            />
        </div>
    );
};

export default NotificationBell;
