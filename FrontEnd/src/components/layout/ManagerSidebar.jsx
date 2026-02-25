import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Squares2X2Icon,
    ClipboardDocumentCheckIcon,
    UsersIcon,
    ChartPieIcon,
    UserCircleIcon,
    SparklesIcon,
    ArrowLeftOnRectangleIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';
import { cn } from '../../utils/helpers';

const navigation = [
    { name: 'Dashboard', href: '/manager/dashboard', icon: Squares2X2Icon },
    { name: 'Approvals', href: '/manager/expenses', icon: ClipboardDocumentCheckIcon },
    { name: 'My Team', href: '/manager/team', icon: UsersIcon },
    { name: 'Reports', href: '/manager/reports', icon: ChartPieIcon },
    { name: 'AI Tools', href: '/manager/ai', icon: SparklesIcon },
    { name: 'Profile', href: '/manager/profile', icon: UserCircleIcon },
];

const ManagerSidebar = ({ isOpen, toggleSidebar }) => {
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
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-500" />
                                <div className="relative bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm text-emerald-600 dark:text-emerald-400">
                                    <ShieldCheckIcon className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none italic uppercase">
                                    MANAGER
                                </span>
                                <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-[0.3em] mt-1">
                                    Command Unit
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
                                        ? "text-emerald-600 dark:text-white bg-emerald-500/5 dark:bg-white/5"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 shadow-none"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Active Highlight Marker */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeSideMarkerManager"
                                                className="absolute left-0 w-1.5 h-7 bg-emerald-600 dark:bg-emerald-500 rounded-r-xl z-20"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className={cn(
                                                "p-1 rounded-lg transition-all duration-500",
                                                isActive
                                                    ? "text-emerald-600 dark:text-emerald-400 scale-125"
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

                    {/* Bottom Section: Sign Out */}
                    <div className="p-6 relative z-10 pb-10 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="group relative flex items-center w-full px-5 py-4 rounded-2xl text-xs font-black text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5"
                        >
                            <div className="relative flex items-center gap-4">
                                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                <span className="group-hover:translate-x-1 transition-transform tracking-[0.2em] uppercase">Log Off Terminal</span>
                            </div>
                        </button>
                    </div>

                    {/* Local Subtle Texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-emerald-500/5 z-0" />
                </div>
            </aside>
        </>
    );
};

export default ManagerSidebar;
