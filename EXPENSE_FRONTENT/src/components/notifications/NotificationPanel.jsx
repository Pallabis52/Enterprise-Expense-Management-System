import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationItem from './NotificationItem';
import useNotificationStore from '../../store/notificationStore';
import Button from '../ui/Button';

const NotificationPanel = ({ isOpen, onClose, anchorRef }) => {
    const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
    const panelRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target) &&
                anchorRef.current && !anchorRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchorRef]);

    const handleItemClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 origin-top-right"
                    style={{ top: '100%' }}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {notifications.some(n => !n.read) && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(note => (
                                <NotificationItem
                                    key={note.id}
                                    notification={note}
                                    onClick={handleItemClick}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-2 border-t border-gray-100 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-800">
                            {/* Potentially 'See all' link to a dedicated page */}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationPanel;
