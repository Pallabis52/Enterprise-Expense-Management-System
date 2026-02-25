import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWidget from '../ai/ChatWidget';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-white dark:bg-slate-950 transition-colors duration-700 overflow-hidden font-sans">

            {/* Ultra-Premium Sidebar Integration */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Operational Zone */}
            <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-500 overflow-hidden relative">

                {/* Background Atmospheric Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

                {/* Ultra-Premium Navbar Integration */}
                <Navbar onMenuClick={toggleSidebar} />

                {/* Prime Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto relative no-scrollbar">
                    <div className="p-4 sm:p-6 lg:p-10 max-w-[1700px] mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Chat Bot Integration */}
                <ChatWidget />

                {/* Local Subtle Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-slate-500/5 -z-20" />
            </div>
        </div>
    );
};

export default MainLayout;
