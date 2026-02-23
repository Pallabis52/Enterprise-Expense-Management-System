import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    BanknotesIcon,
    TagIcon,
    ChartBarIcon,
    UserCircleIcon,
    UsersIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';

// Fallback Icons Helper
const IconWrapper = ({ icon: Icon, fallback, className }) => {
    if (Icon) return <Icon className={className} />;
    return fallback;
};

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Teams', href: '/admin/teams', icon: UsersIcon },
    { name: 'Expenses', href: '/admin/expenses', icon: BanknotesIcon },
    { name: 'Categories', href: '/admin/categories', icon: TagIcon },
    { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
    { name: 'AI Tools', href: '/admin/ai', icon: SparklesIcon },
    { name: 'Chatbot', href: '/admin/chatbot', icon: ChatBubbleLeftRightIcon },
    { name: 'Profile', href: '/admin/profile', icon: UserCircleIcon },
];

const AdminSidebar = () => {
    const logout = useAuthStore(state => state.logout);

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed inset-y-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30">
            <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                    Expense Admin
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
                                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <IconWrapper
                                    icon={item.icon}
                                    className={cn("mr-3 h-6 w-6 flex-shrink-0 transition-colors", isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400 group-hover:text-gray-500")}
                                    fallback={<span className="mr-3 w-6 h-6 bg-gray-200 rounded-full" />}
                                />
                                {item.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSidebar"
                                        className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"
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
                    <IconWrapper icon={ArrowLeftOnRectangleIcon} className="mr-3 h-6 w-6" fallback={<span className="mr-3 w-6 h-6 bg-red-200" />} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
