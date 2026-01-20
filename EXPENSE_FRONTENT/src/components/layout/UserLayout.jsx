import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import UserSidebar from './UserSidebar';
import ThemeToggle from '../ui/ThemeToggle';

const UserLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
                <span className="font-semibold text-gray-800 dark:text-white">Expensify User</span>
                <ThemeToggle />
            </div>

            <UserSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <main className="lg:pl-64 min-h-screen">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    {/* Desktop Header Actions */}
                    <div className="hidden lg:flex justify-end mb-6">
                        <ThemeToggle />
                    </div>

                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default UserLayout;
