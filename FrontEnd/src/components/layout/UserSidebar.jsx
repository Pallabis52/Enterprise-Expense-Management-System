import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    BanknotesIcon,
    ChartBarIcon,
    UserIcon,
    SparklesIcon,
    ArrowLeftOnRectangleIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';
import { cn } from '../../utils/helpers';

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
        { name: 'AI Tools', href: '/user/ai', icon: SparklesIcon },
        { name: 'Profile', href: '/user/profile', icon: UserIcon },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform lg:translate-x-0 border-r border-gray-100 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col overflow-hidden relative">

                    {/* Branding Section */}
                    <div className="relative z-10 px-8 py-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl blur opacity-25" />
                                <div className="relative bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                                    <Squares2X2Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                                    EXPENSIFY
                                </span>
                                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.3em] mt-1">
                                    User Platform
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar relative z-10 pt-4">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) => cn(
                                    "relative flex items-center px-4 py-4 rounded-2xl transition-all duration-300 group overflow-hidden",
                                    isActive
                                        ? "text-indigo-600 dark:text-white bg-indigo-500/5 dark:bg-white/5 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 shadow-none"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Active Highlight Marker */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeSideMarker"
                                                className="absolute left-0 w-1.5 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-r-full z-20"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className={cn(
                                                "p-2 rounded-xl transition-all duration-500",
                                                isActive
                                                    ? "text-indigo-600 dark:text-indigo-400 scale-110"
                                                    : "bg-transparent text-slate-400 dark:text-slate-500 group-hover:scale-110"
                                            )}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <span className={cn(
                                                "text-sm font-black tracking-tight transition-all duration-300",
                                                isActive ? "translate-x-1" : "group-hover:translate-x-1"
                                            )}>
                                                {item.name}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Bottom Section: Sign Out */}
                    <div className="p-6 relative z-10 pb-8 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="group relative flex items-center w-full px-5 py-4 rounded-2xl text-sm font-black text-rose-500 dark:text-rose-400 hover:text-rose-600 transition-all duration-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 overflow-hidden"
                        >
                            <div className="relative flex items-center gap-4">
                                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                <span className="group-hover:translate-x-1 transition-transform tracking-widest uppercase text-[11px]">Sign Out</span>
                            </div>
                        </button>
                    </div>

                    {/* Local Subtle Texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-slate-500/5 z-0" />
                </div>
            </aside>
        </>
    );
};

export default UserSidebar;
