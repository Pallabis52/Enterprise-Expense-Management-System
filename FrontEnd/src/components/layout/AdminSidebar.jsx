import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    BanknotesIcon,
    TagIcon,
    ChartBarIcon,
    UserCircleIcon,
    UsersIcon,
    SparklesIcon,
    ArrowLeftOnRectangleIcon,
    CpuChipIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Teams', href: '/admin/teams', icon: UsersIcon },
    { name: 'Expenses', href: '/admin/expenses', icon: BanknotesIcon },
    { name: 'Vendors', href: '/admin/vendors', icon: CpuChipIcon },
    { name: 'Fraud Flags', href: '/admin/fraud-flags', icon: ExclamationTriangleIcon },
    { name: 'Categories', href: '/admin/categories', icon: TagIcon },
    { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
    { name: 'AI Tools', href: '/admin/ai', icon: SparklesIcon },
    { name: 'Profile', href: '/admin/profile', icon: UserCircleIcon },
];

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
                        className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm lg:hidden"
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
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-4"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-500" />
                                <div className="relative bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-primary-100 dark:border-primary-900/50 shadow-sm text-primary-600 dark:text-white">
                                    <CpuChipIcon className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none italic uppercase">
                                    ADMIN
                                </span>
                                <span className="text-[10px] font-bold text-primary-600 dark:text-indigo-400 uppercase tracking-[0.3em] mt-1">
                                    Core System
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
                                        ? "text-primary-600 dark:text-white bg-primary-500/5 dark:bg-white/5"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 shadow-none"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Active Highlight Marker */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeSideMarkerAdmin"
                                                className="absolute left-0 w-1.5 h-7 bg-primary-600 dark:bg-primary-500 rounded-r-xl z-20"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className={cn(
                                                "p-1 rounded-lg transition-all duration-500",
                                                isActive
                                                    ? "text-primary-600 dark:text-primary-400 scale-125"
                                                    : "bg-transparent text-slate-400 dark:text-slate-500 group-hover:scale-110"
                                            )}>
                                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                            </div>
                                            <span className={cn(
                                                "text-sm font-black tracking-tight transition-all duration-300 whitespace-nowrap",
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

                    {/* Bottom Section: Log Off */}
                    <div className="p-6 relative z-10 pb-10 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="group relative flex items-center w-full px-5 py-4 rounded-2xl text-[11px] font-black text-rose-500 dark:text-rose-400 hover:text-rose-600 transition-all duration-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10"
                        >
                            <div className="relative flex items-center gap-4">
                                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                <span className="group-hover:translate-x-1 transition-transform tracking-widest uppercase">Terminate Session</span>
                            </div>
                        </button>
                    </div>

                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
