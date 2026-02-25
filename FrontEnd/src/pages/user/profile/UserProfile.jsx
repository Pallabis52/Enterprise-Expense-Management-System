import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    CameraIcon,
    PencilSquareIcon,
    KeyIcon,
    BellAlertIcon,
    ShieldExclamationIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../../store/authStore';
import userService from '../../../services/userService';
import Card3D from '../../../components/ui/Card3D';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { premiumSuccess, premiumError } from '../../../utils/premiumAlerts';
import PageTransition from '../../../components/layout/PageTransition';
import { cn } from '../../../utils/helpers';

const UserProfile = () => {
    const { user, login } = useAuthStore();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('identity'); // identity, security, notifications

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await userService.getProfile();
                setFormData(prev => ({ ...prev, name: data.name, email: data.email }));
            } catch (err) {
                console.error("Profile sync failed", err);
            }
        };
        loadProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updated = await userService.updateProfile({ name: formData.name });
            // Sync with store if necessary - assuming login updates the store user
            // If the service returns the updated user, we can refresh the store state
            premiumSuccess('Identity Updated', 'Your profile has been successfully synchronized.');
            setIsEditing(false);
        } catch (err) {
            premiumError('Error', 'Failed to update identity');
        } finally {
            setIsLoading(false);
        }
    };

    const SectionHeader = ({ title, subtitle, icon: Icon }) => (
        <div className="flex items-center gap-5 mb-8 group/header transition-all duration-500">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-500 dark:text-indigo-400 shadow-xl shadow-indigo-500/5 group-hover/header:scale-110 transition-transform duration-500 border border-white/20 dark:border-white/5 backdrop-blur-md">
                <Icon className="w-7 h-7" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">{title}</h3>
                <p className="text-[11px] text-indigo-500/70 dark:text-indigo-400 font-black uppercase tracking-[0.25em] mt-0.5">{subtitle}</p>
            </div>
        </div>
    );

    return (
        <PageTransition>
            <div className="space-y-12 pb-24 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Identity Canvas (Hero) ── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative p-10 md:p-14 rounded-[56px] overflow-hidden group shadow-[0_32px_80px_-20px_rgba(79,70,229,0.15)] border border-white/40 dark:border-white/10"
                >
                    {/* Ultra-Premium Glass Background */}
                    <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[40px]" />

                    {/* Animated Gradient Orbs */}
                    <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, 50, 0],
                                y: [0, -30, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/30 blur-[130px] rounded-full"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                x: [0, -40, 0],
                                y: [0, 40, 0]
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/30 blur-[130px] rounded-full"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        {/* Avatar Hub with Premium Border */}
                        <div className="relative group/avatar">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-30 group-hover/avatar:opacity-80 transition duration-700"
                            />
                            <div className="relative w-40 h-40 rounded-full overflow-hidden p-1 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-2xl">
                                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white text-6xl font-black border-4 border-white/20 dark:border-slate-800">
                                    {user?.avatar ? (
                                        <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                                            {formData.name?.[0]?.toUpperCase() || 'U'}
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-all duration-500 cursor-pointer">
                                        <CameraIcon className="w-10 h-10 text-white translate-y-4 group-hover/avatar:translate-y-0 transition-all duration-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-4 flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-[0.25em] mb-2 shadow-sm"
                            >
                                <ShieldCheckIcon className="w-3.5 h-3.5 mr-2" />
                                Verified Profile
                            </motion.div>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-white dark:to-indigo-200">
                                {formData.name || 'Anonymous User'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight text-xl flex items-center justify-center md:justify-start gap-2">
                                <EnvelopeIcon className="w-5 h-5 opacity-50" />
                                {formData.email}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-5 pt-6">
                                <div className="px-6 py-2.5 rounded-2xl bg-white/40 dark:bg-indigo-500/10 border border-white dark:border-indigo-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex items-center gap-3 group/chip transition-all duration-300 hover:bg-white/60 dark:hover:bg-indigo-500/20">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{user?.role || 'User'} Authority</span>
                                </div>
                                <div className="px-6 py-2.5 rounded-2xl bg-white/40 dark:bg-indigo-500/10 border border-white dark:border-indigo-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex items-center gap-3 transition-all duration-300 hover:bg-white/60 dark:hover:bg-indigo-500/20">
                                    <ArrowPathIcon className="w-4 h-4 text-indigo-500" />
                                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Active Status</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 md:mt-0">
                            <Button
                                onClick={() => setIsEditing(!isEditing)}
                                variant={isEditing ? 'secondary' : 'primary'}
                                className="px-10 py-5 rounded-[24px] shadow-2xl shadow-indigo-500/20 group/btn transition-all duration-500 hover:scale-105 active:scale-95"
                            >
                                <div className="flex items-center gap-3">
                                    {isEditing ? (
                                        <span className="font-black uppercase tracking-widest text-xs">Discard Changes</span>
                                    ) : (
                                        <>
                                            <PencilSquareIcon className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-500" />
                                            <span className="font-black uppercase tracking-widest text-xs">Customize Profile</span>
                                        </>
                                    )}
                                </div>
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* ── Operational Control Hub ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Sidebar Nav with Glass Effects */}
                    <div className="lg:col-span-3 space-y-3">
                        {[
                            { id: 'identity', label: 'Identity', icon: UserIcon },
                            { id: 'security', label: 'Security', icon: KeyIcon },
                            { id: 'notifications', label: 'Alerts', icon: BellAlertIcon },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-5 px-7 py-5 rounded-[24px] transition-all duration-500 group relative overflow-hidden",
                                    activeTab === tab.id
                                        ? "bg-indigo-600 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)]"
                                        : "bg-white/30 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/5"
                                )}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"
                                    />
                                )}
                                <tab.icon className={cn("w-6 h-6 transition-all duration-500 relative z-10", activeTab === tab.id ? "text-white scale-110" : "text-indigo-500/60 group-hover:scale-110")} />
                                <span className="text-xs font-black uppercase tracking-[0.2em] relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Matrix with Premium Glass Cards */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Card3D className="p-10 md:p-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[40px] border border-white/60 dark:border-white/10 rounded-[48px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)]">
                                    {activeTab === 'identity' && (
                                        <div className="space-y-10">
                                            <SectionHeader
                                                title="Personnel Credentials"
                                                subtitle="Manage your system identification"
                                                icon={UserIcon}
                                            />
                                            <form onSubmit={handleUpdateProfile} className="space-y-10">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div className="space-y-3">
                                                        <label className="text-[11px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.15em] px-2 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                            Public Designation
                                                        </label>
                                                        <Input
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            disabled={!isEditing}
                                                            placeholder="Full Name"
                                                            className="bg-white/40 dark:bg-slate-950/40 rounded-2xl border-white/40 dark:border-white/10 px-6 py-4 transition-all duration-300 focus:ring-4 focus:ring-indigo-500/10"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] px-2 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                            Secure Alias (Locked)
                                                        </label>
                                                        <Input
                                                            name="email"
                                                            value={formData.email}
                                                            disabled
                                                            className="bg-slate-100/50 dark:bg-slate-800/30 cursor-not-allowed rounded-2xl border-white/20 px-6 py-4 opacity-70 grayscale"
                                                        />
                                                    </div>
                                                </div>

                                                {isEditing && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="flex justify-end pt-6"
                                                    >
                                                        <Button
                                                            type="submit"
                                                            isLoading={isLoading}
                                                            className="px-12 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-600/20 transition-all duration-500"
                                                        >
                                                            Update Matrix Data
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </form>
                                        </div>
                                    )}

                                    {activeTab === 'security' && (
                                        <div className="space-y-12">
                                            <SectionHeader
                                                title="Cyber Defense Settings"
                                                subtitle="Configuration for access protocols"
                                                icon={ShieldCheckIcon}
                                            />

                                            <div className="relative group/security">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[32px] blur opacity-50 transition duration-1000 group-hover:opacity-100" />
                                                <div className="relative flex flex-col md:flex-row items-center justify-between p-8 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] gap-6">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                                                            <ShieldCheckIcon className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Biometric & 2FA Layer</h4>
                                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mt-1">Multi-factor encryption operational</p>
                                                        </div>
                                                    </div>
                                                    <div className="px-6 py-2.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-emerald-500/30 animate-pulse">
                                                        Active Secure
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-10 border-t border-slate-200 dark:border-white/5 space-y-10">
                                                <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                    Re-Authenticate Protocols
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Current Key</label>
                                                        <Input type="password" placeholder="••••••••" className="rounded-2xl bg-white/40 dark:bg-slate-950/40 border-white/40 dark:border-white/10" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">New Protocol Key</label>
                                                        <Input type="password" placeholder="••••••••" className="rounded-2xl bg-white/40 dark:bg-slate-950/40 border-white/40 dark:border-white/10" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <Button className="px-10 py-4 rounded-2xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all duration-500">
                                                        Overwrite Protocols
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'notifications' && (
                                        <div className="space-y-10">
                                            <SectionHeader
                                                title="Neural Alert Matrix"
                                                subtitle="Real-time system telemetry nodes"
                                                icon={BellAlertIcon}
                                            />

                                            <div className="grid gap-6">
                                                {[
                                                    { id: 'n1', label: 'Financial Approvals', desc: 'Alert when reimbursement status changes', default: true, color: 'indigo' },
                                                    { id: 'n2', label: 'Policy Variations', desc: 'Telemetry on regulatory budget adjustments', default: false, color: 'purple' },
                                                    { id: 'n3', label: 'Security Breaches', desc: 'Critical alerts on unauthorized session attempts', default: true, color: 'rose' },
                                                ].map(item => (
                                                    <motion.div
                                                        key={item.id}
                                                        whileHover={{ scale: 1.01, x: 5 }}
                                                        className="flex items-center justify-between p-8 bg-white/30 dark:bg-slate-800/20 rounded-[32px] border border-white/60 dark:border-white/5 group hover:border-indigo-500/40 transition-all duration-500 backdrop-blur-md"
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <div className={cn(
                                                                "w-4 h-4 rounded-full transition-all duration-500",
                                                                item.default
                                                                    ? `bg-${item.color}-500 shadow-[0_0_20px_rgba(79,70,229,0.5)] scale-110`
                                                                    : "bg-slate-200 dark:bg-slate-700"
                                                            )} />
                                                            <div>
                                                                <h5 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight group-hover:text-indigo-500 transition-colors duration-500">{item.label}</h5>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                        <div className={cn(
                                                            "relative w-14 h-7 rounded-full cursor-pointer p-1 transition-all duration-500",
                                                            item.default ? "bg-indigo-600/20" : "bg-slate-200 dark:bg-slate-800"
                                                        )}>
                                                            <motion.div
                                                                animate={{ x: item.default ? 28 : 0 }}
                                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                className={cn(
                                                                    "w-5 h-5 rounded-full shadow-lg transition-all duration-500",
                                                                    item.default ? "bg-indigo-500 shadow-indigo-500/40" : "bg-white dark:bg-slate-600"
                                                                )}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card3D>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── System Termination Vector (Footer) ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative group/footer"
                >
                    <div className="absolute inset-0 bg-rose-500/5 blur-[80px] rounded-full opacity-50 group-hover/footer:opacity-80 transition duration-1000" />
                    <div className="relative p-10 md:p-12 rounded-[48px] bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl border border-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
                        <div className="absolute -left-10 -top-10 w-40 h-40 bg-rose-500/10 blur-[60px] rounded-full pointer-events-none" />
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="p-5 rounded-2xl bg-rose-500/10 text-rose-500 shadow-xl shadow-rose-500/5 animate-pulse">
                                <ShieldExclamationIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-rose-500 uppercase tracking-tighter leading-none">Decommission Entity</h4>
                                <p className="text-[11px] text-rose-500/60 font-black uppercase tracking-[0.3em] mt-3">Final removal from the operational grid</p>
                            </div>
                        </div>
                        <Button
                            variant="danger"
                            className="px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.25em] shadow-[0_20px_40px_-10px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 transition-all duration-500 relative z-10"
                        >
                            Execute Termination
                        </Button>
                    </div>
                </motion.div>

            </div>
        </PageTransition>
    );
};

export default UserProfile;
