import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Squares2X2Icon,
    ClipboardDocumentCheckIcon,
    UsersIcon,
    ChartPieIcon,
    UserCircleIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';

const navigation = [
    { name: 'Dashboard', href: '/manager/dashboard', icon: Squares2X2Icon },
    { name: 'Approvals', href: '/manager/expenses', icon: ClipboardDocumentCheckIcon },
    { name: 'My Team', href: '/manager/team', icon: UsersIcon },
    { name: 'Reports', href: '/manager/reports', icon: ChartPieIcon },
    { name: 'AI Tools', href: '/manager/ai', icon: SparklesIcon },
    { name: 'Profile', href: '/manager/profile', icon: UserCircleIcon },
];

const ManagerSidebar = () => {
    const logout = useAuthStore(state => state.logout);

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed inset-y-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30">
            <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                    Team Manager
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group',
                                isActive
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn("mr-3 h-6 w-6 flex-shrink-0 transition-colors", isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 group-hover:text-gray-500")} />
                                {item.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeManagerSidebar"
                                        className="absolute left-0 w-1 h-8 bg-emerald-600 rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={logout}
                    className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                >
                    <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default ManagerSidebar;
