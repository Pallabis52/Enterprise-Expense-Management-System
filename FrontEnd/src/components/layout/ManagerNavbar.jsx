import React from 'react';
import { motion } from 'framer-motion';
import {
    Bars3Icon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';
import useTheme from '../../hooks/useTheme';
import NotificationBell from '../notifications/NotificationBell';
import UnifiedSearchBar from '../ui/UnifiedSearchBar';
import { useNavigate } from 'react-router-dom';
import useManagerExpenseStore from '../../store/managerExpenseStore';
import useAdminExpenseStore from '../../store/adminExpenseStore';

const ManagerNavbar = ({ onMenuClick }) => {
    const { user } = useAuthStore();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { setExpenses: setManagerExpenses } = useManagerExpenseStore();
    const { setExpenses: setAdminExpenses } = useAdminExpenseStore();

    const handleSearchResults = (results, mode, query) => {
        if (user?.role === 'ADMIN') {
            setAdminExpenses(results);
            navigate('/admin/expenses');
        } else {
            setManagerExpenses(results);
            navigate('/manager/expenses');
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-3xl border-b border-gray-100 dark:border-white/5 transition-all duration-500">
            <div className="max-w-[1700px] mx-auto flex items-center justify-between px-6 lg:px-10 h-20">

                {/* Left Side: Page Context & Mobile Menu */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-3 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    <div className="hidden sm:flex flex-col">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Navigation</span>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Control Overview</h2>
                    </div>
                </div>

                {/* Center / Right: Search Bar Integration */}
                <div className="hidden md:block flex-1 max-w-2xl px-12">
                    <UnifiedSearchBar onResults={handleSearchResults} />
                </div>

                {/* Right Side: Global Actions & Profile */}
                <div className="flex items-center gap-4">

                    {/* Theme Engine */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className="p-3 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 rounded-2xl transition-all shadow-sm group relative"
                    >
                        {theme === 'dark' ? <SunIcon className="w-5 h-5 group-hover:rotate-45 transition-transform" /> : <MoonIcon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />}
                        <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>

                    {/* Notification Engine */}
                    <div className="p-1">
                        <NotificationBell />
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block" />

                    {/* Authenticated Identity */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 pl-2 group cursor-pointer"
                        onClick={() => navigate('/manager/profile')}
                    >
                        <div className="hidden lg:block text-right">
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-0.5 group-hover:text-emerald-500 transition-colors">
                                {user?.name || 'Manager'}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 dark:text-emerald-500/60 uppercase tracking-[0.2em]">
                                {user?.role || 'Operations'}
                            </p>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-full blur opacity-20 group-hover:opacity-60 transition-all duration-700" />
                            <div className="relative w-11 h-11 rounded-full bg-slate-900 dark:bg-emerald-500 flex items-center justify-center text-white font-black text-sm border-2 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.[0] || 'M'}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </header>
    );
};

export default ManagerNavbar;
