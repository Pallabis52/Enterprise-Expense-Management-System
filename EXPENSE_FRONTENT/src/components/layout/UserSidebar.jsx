import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    BanknotesIcon,
    ChartBarIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';

const UserSidebar = ({ isOpen, toggleSidebar }) => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/user/dashboard', icon: HomeIcon },
        { name: 'My Expenses', href: '/user/expenses', icon: BanknotesIcon },
        { name: 'Reports', href: '/user/reports', icon: ChartBarIcon },
        { name: 'Profile', href: '/user/profile', icon: UserIcon },
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                        Expensify User
                    </span>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default UserSidebar;
