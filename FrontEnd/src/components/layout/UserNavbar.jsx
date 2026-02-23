import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    BanknotesIcon,
    TagIcon,
    ChartBarIcon,
    UserCircleIcon,
    ArrowLeftOnRectangleIcon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';
import useTheme from '../../hooks/useTheme';
import NotificationBell from '../notifications/NotificationBell';
import SearchVoiceInput from '../ui/SearchVoiceInput';

const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Expenses', href: '/expenses', icon: BanknotesIcon },
    { name: 'Categories', href: '/categories', icon: TagIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
];

const UserNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [navSearch, setNavSearch] = useState('');
    const { user, logout } = useAuthStore();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-40 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                {/* Mobile Menu Button & Brand */}
                <div className="flex items-center gap-4 md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                    </button>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                        Enterprise
                    </span>
                </div>

                {/* Desktop: Left Spacer or Breadcrumbs */}
                <div className="hidden md:flex items-center">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Overview</h2>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Search (Desktop) */}
                    <div className="hidden md:block w-72">
                        <SearchVoiceInput
                            value={navSearch}
                            onChange={setNavSearch}
                            placeholder="Search anything…"
                        />
                    </div>
                    {/* Theme Toggle */}
                    <button onClick={toggleTheme}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                        aria-label="Toggle Theme">
                        {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>
                    {/* Notifications */}
                    <NotificationBell />
                    {/* User Profile */}
                    <div className="flex items-center gap-3 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'User'}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-primary-500/30">
                            {user?.name?.[0] || 'U'}
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-xl">
                        <div className="px-4 py-3 space-y-1">
                            {userNavigation.map(item => (
                                <NavLink key={item.name} to={item.href} onClick={() => setIsOpen(false)}
                                    className={({ isActive }) => cn('flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors',
                                        isActive ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50')}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </NavLink>
                            ))}
                            <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
                            <button onClick={() => { logout(); setIsOpen(false); }}
                                className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default UserNavbar;
