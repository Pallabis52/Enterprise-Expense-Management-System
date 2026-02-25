import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCircleIcon,
    BellIcon,
    MoonIcon,
    LockClosedIcon,
    ShieldCheckIcon,
    ArrowPathIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';
import PageTransition from '../../../components/layout/PageTransition';
import useAuthStore from '../../../store/authStore';
import Input from '../../../components/ui/Input';
import Toggle from '../../../components/ui/Toggle';
import Button from '../../../components/ui/Button';

const ManagerProfile = () => {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <PageTransition>
            <div className="max-w-5xl mx-auto space-y-12 pb-20 px-4 sm:px-6">

                {/* ── Header Section ── */}
                <div className="relative">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter"
                    >
                        Management Hub
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest text-xs mt-2 flex items-center gap-2"
                    >
                        <ShieldCheckIcon className="w-4 h-4" />
                        Executive Level Control
                    </motion.p>
                </div>

                {/* ── Profile Identity Canvas ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 rounded-[40px] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 border border-white/40 dark:border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-10 overflow-hidden">

                        {/* Avatar Hub */}
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-2 bg-gradient-to-tr from-emerald-500 via-indigo-500 to-purple-500 rounded-full blur-md opacity-30"
                            />
                            <div className="relative w-32 h-32 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-xl">
                                <div className="w-full h-full rounded-full bg-slate-900 dark:bg-emerald-950 flex items-center justify-center text-4xl font-black text-white border-4 border-white/20 dark:border-slate-800">
                                    {user?.name?.[0] || 'M'}
                                </div>
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-4 flex-1">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                                {user?.name || 'Executive Manager'}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center md:justify-start gap-2">
                                <EnvelopeIcon className="w-5 h-5 opacity-50 text-indigo-500" />
                                {user?.email || 'executive@organization.com'}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                                <div className="px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    {user?.role || 'MANAGER'} AUTHORITY
                                </div>
                                <div className="px-5 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <ArrowPathIcon className="w-4 h-4" />
                                    ACTIVE SESSION
                                </div>
                            </div>
                        </div>

                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Security Settings - Glass Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 border border-white/60 dark:border-white/10 shadow-xl space-y-8"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                                <LockClosedIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Secure Terminal</h3>
                                <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-black tracking-widest">Update access credentials</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2 px-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Protocol Key</label>
                                <Input type="password" placeholder="••••••••" className="bg-white/50 dark:bg-slate-950/50 rounded-2xl border-white/20" />
                            </div>
                            <div className="space-y-2 px-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Protocol Key</label>
                                <Input type="password" placeholder="••••••••" className="bg-white/50 dark:bg-slate-950/50 rounded-2xl border-white/20" />
                            </div>
                            <Button className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-indigo-600 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/10 transition-transform active:scale-95">
                                Overwrite Credentials
                            </Button>
                        </div>
                    </motion.div>

                    {/* Preferences - Glass Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 border border-white/60 dark:border-white/10 shadow-xl space-y-10"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20">
                                <BellIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Interface Matrix</h3>
                                <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-black tracking-widest">Telemetry & Appearance</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between p-6 bg-white/40 dark:bg-slate-800/30 rounded-3xl border border-white/60 dark:border-white/5 transition-all hover:border-indigo-500/30">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl bg-indigo-500/10 text-indigo-500 ${notifications ? 'animate-pulse' : ''}`}>
                                        <BellIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">Email Analytics</p>
                                        <p className="text-[10px] text-slate-500 font-bold">Real-time update streams</p>
                                    </div>
                                </div>
                                <Toggle checked={notifications} onChange={setNotifications} />
                            </div>

                            <div className="flex items-center justify-between p-6 bg-white/40 dark:bg-slate-800/30 rounded-3xl border border-white/60 dark:border-white/5 transition-all hover:border-indigo-500/30">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                                        <MoonIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">Dark Mode</p>
                                        <p className="text-[10px] text-slate-500 font-bold">Override system theme</p>
                                    </div>
                                </div>
                                <Toggle checked={darkMode} onChange={setDarkMode} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ManagerProfile;
