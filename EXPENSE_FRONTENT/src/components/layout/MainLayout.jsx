import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Sidebar />

            <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
                <Navbar />

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
