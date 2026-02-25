import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCircleIcon,
    ShieldCheckIcon,
    BellIcon,
    ComputerDesktopIcon,
    ShieldExclamationIcon,
    ArrowPathIcon,
    EnvelopeIcon,
    KeyIcon
} from '@heroicons/react/24/outline';
import PageTransition from '../../../components/layout/PageTransition';

const AdminProfile = () => {
    // Mock User Data
    const user = {
        name: "Administrator Principal",
        email: "root@enterprise-grid.com",
        role: "System Architect",
        lastLogin: "2026-02-25 02:30 AM"
    };

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        reports: true
    });

    const [privacy, setPrivacy] = useState({
        twoFactor: true,
        sessionTimeout: false
    });

    return (
        <PageTransition>
            <div className="max-w-6xl mx-auto space-y-12 pb-24 px-4 sm:px-6">

                {/* ── Admin Command Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none"
                        >
                            System Authority
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-primary-600 dark:text-primary-400 font-black uppercase tracking-[0.3em] text-[10px] mt-4 flex items-center gap-2"
                        >
                            <ShieldExclamationIcon className="w-4 h-4 text-rose-500 animate-pulse" />
                            ROOT ACCESS GRANTED • KERNEL LEVEL 9
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Button variant="primary" className="rounded-2xl px-8 py-4 shadow-2xl shadow-primary-500/20 group/edit transition-all duration-500 hover:scale-105">
                            <div className="flex items-center gap-3">
                                <ArrowPathIcon className="w-5 h-5 group-hover/edit:rotate-180 transition-transform duration-700" />
                                <span className="text-xs font-black uppercase tracking-widest">Optimize Protocols</span>
                            </div>
                        </Button>
                    </motion.div>
                </div>

                {/* ── Profile Identity Canvas ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group"
                >
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-500 via-indigo-600 to-rose-500 rounded-[48px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-[40px] rounded-[48px] p-10 md:p-14 border border-white/40 dark:border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-12 overflow-hidden">

                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                                transition={{ duration: 15, repeat: Infinity }}
                                className="absolute -right-20 -top-20 w-80 h-80 bg-primary-500/20 blur-[80px] rounded-full"
                            />
                        </div>

                        {/* Avatar Core */}
                        <div className="relative group/core">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-3 bg-gradient-to-tr from-primary-600 via-white/0 to-rose-600 rounded-full blur-sm opacity-50"
                            />
                            <div className="relative w-40 h-40 rounded-full overflow-hidden p-1.5 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-3xl shadow-2xl">
                                <div className="w-full h-full rounded-full bg-slate-900 dark:bg-primary-950 flex items-center justify-center text-primary-500 dark:text-primary-400 border-4 border-white/20 dark:border-slate-800">
                                    <UserCircleIcon className="w-24 h-24" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-5 flex-1 relative z-10">
                            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                                {user.name}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-xl flex items-center justify-center md:justify-start gap-3">
                                <EnvelopeIcon className="w-6 h-6 text-primary-500 opacity-60" />
                                {user.email}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-5 pt-4">
                                <div className="px-6 py-2.5 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-lg shadow-primary-500/5">
                                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-ping" />
                                    {user.role} IDENTIFIED
                                </div>
                                <div className="px-6 py-2.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                    <ArrowPathIcon className="w-4 h-4" />
                                    LAST SYNC: {user.lastLogin}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Security Vector Section */}
                    <div className="space-y-8">
                        <SectionTitle icon={ShieldCheckIcon} title="Security Matrix" subtitle="Manage cryptographic access" />

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-10 border border-white/60 dark:border-white/10 shadow-xl space-y-10"
                        >
                            <div className="flex items-center justify-between p-8 bg-primary-500/5 dark:bg-primary-500/10 rounded-[32px] border border-primary-500/20 group hover:border-primary-500 transition-all duration-500">
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-lg">Multi-Layer 2FA</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">High security encryption active</p>
                                </div>
                                <Toggle checked={privacy.twoFactor} onChange={(v) => setPrivacy({ ...privacy, twoFactor: v })} />
                            </div>

                            <div className="pt-10 border-t border-slate-100 dark:border-white/5 space-y-8">
                                <div className="flex items-center gap-3">
                                    <KeyIcon className="w-5 h-5 text-primary-500" />
                                    <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">Credentials Hub</h4>
                                </div>
                                <div className="space-y-5">
                                    <Input type="password" placeholder="Existing Master Key" className="rounded-2xl h-14 bg-white/40 dark:bg-slate-950/40 border-white/40 dark:border-white/10 lg:text-sm" />
                                    <Input type="password" placeholder="New Neural Key" className="rounded-2xl h-14 bg-white/40 dark:bg-slate-950/40 border-white/40 dark:border-white/10 lg:text-sm" />
                                    <Button className="w-full py-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-primary-600 dark:to-indigo-600 font-black uppercase tracking-widest text-xs shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                                        Update Master protocols
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Preferences & UI Vector Section */}
                    <div className="space-y-8">
                        <SectionTitle icon={BellIcon} title="Telemetry Matrix" subtitle="Neural interface configuration" />

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-10 border border-white/60 dark:border-white/10 shadow-xl space-y-10"
                        >
                            <div className="space-y-6">
                                {[
                                    { id: 'email', label: 'Email Telemetry', active: notifications.email },
                                    { id: 'push', label: 'Push Feedback', active: notifications.push },
                                    { id: 'reports', label: 'Weekly Diagnostics', active: notifications.reports }
                                ].map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-6 bg-white/30 dark:bg-slate-800/20 rounded-[28px] border border-white/60 dark:border-white/5 transition-all hover:bg-white/50 dark:hover:bg-slate-800/40">
                                        <span className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight text-xs">{item.label}</span>
                                        <Toggle checked={item.active} onChange={(v) => setNotifications({ ...notifications, [item.id]: v })} />
                                    </div>
                                ))}
                            </div>

                            <div className="pt-10 border-t border-slate-100 dark:border-white/5 space-y-8">
                                <div className="flex items-center gap-3">
                                    <ComputerDesktopIcon className="w-5 h-5 text-primary-500" />
                                    <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">Interface Aesthetics</h4>
                                </div>
                                <div className="flex items-center justify-between p-8 bg-slate-900 dark:bg-indigo-600/10 rounded-[32px] border border-white/10">
                                    <div>
                                        <p className="font-black text-white uppercase tracking-tight text-base">Dimensional Shift</p>
                                        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mt-1">Activate dark environment</p>
                                    </div>
                                    <Toggle checked={document.documentElement.classList.contains('dark')} onChange={() => document.documentElement.classList.toggle('dark')} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-5 px-4 group">
        <div className="p-4 rounded-2xl bg-primary-500/10 text-primary-500 border border-primary-500/20 shadow-xl shadow-primary-500/5 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{title}</h3>
            <p className="text-[10px] text-primary-500 dark:text-primary-400 font-black uppercase tracking-[0.25em] mt-0.5 opacity-70">{subtitle}</p>
        </div>
    </div>
);

export default AdminProfile;
