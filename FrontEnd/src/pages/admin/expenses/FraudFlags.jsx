import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExclamationTriangleIcon,
    ArrowPathIcon,
    ShieldExclamationIcon,
    MagnifyingGlassIcon,
    UserIcon,
    CalendarIcon,
    NoSymbolIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';
import adminExpenseService from '../../../services/adminExpenseService';
import { formatCurrency } from '../../../utils/helpers';
import PageTransition from '../../../components/layout/PageTransition';
import { cn } from '../../../utils/helpers';
import Badge from '../../../components/ui/Badge';
import { premiumConfirm, premiumSuccess, premiumError } from '../../../utils/premiumAlerts';

const FraudFlags = () => {
    const [flags, setFlags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchFlags = async () => {
        setLoading(true);
        try {
            const data = await adminExpenseService.getFraudFlags();
            setFlags(data);
        } catch (error) {
            console.error('Failed to fetch fraud flags', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlags();
    }, []);

    const handleReject = async (id) => {
        const result = await premiumConfirm(
            'Reject Fraudulent Entry?',
            'This action will permanently reject this expense and notify the user of a compliance violation.',
            'Terminate Entry'
        );

        if (result.isConfirmed) {
            try {
                await adminExpenseService.rejectExpense(id, 'Flagged as fraudulent by automated security engine.');
                premiumSuccess('Terminated', 'The expense has been neutralized.');
                fetchFlags();
            } catch (error) {
                premiumError('Action Failed', error.message);
            }
        }
    };

    const filteredFlags = flags.filter(f =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">

                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Fraud Flags</h1>
                        <p className="text-[11px] text-rose-500 font-black uppercase tracking-[0.4em] flex items-center gap-3">
                            <ShieldExclamationIcon className="w-4 h-4" />
                            Counter-Intelligence Operations
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchFlags}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-colors"
                        >
                            <ArrowPathIcon className={cn("w-6 h-6", loading && "animate-spin")} />
                        </button>
                    </div>
                </div>

                {/* Dashboard Meta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Critical Anomalies', value: flags.length, icon: ExclamationTriangleIcon, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                        { label: 'System Integrity', value: '99.8%', icon: CheckBadgeIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { label: 'Neutralized Today', value: '12', icon: NoSymbolIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-[32px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl">
                            <div className={cn("p-3 rounded-2xl inline-flex mb-4", stat.bg, stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <p className={cn("text-3xl font-black tracking-tighter", stat.color)}>{stat.value}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-[32px] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                    <div className="relative flex items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-4 rounded-[32px]">
                        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 ml-4" />
                        <input
                            type="text"
                            placeholder="Scan for fraudulent patterns..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 dark:text-white px-4 placeholder:text-slate-400 placeholder:uppercase"
                        />
                    </div>
                </div>

                {/* Fraud Matrix */}
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-48 rounded-[40px] bg-white/40 dark:bg-slate-900/40 animate-pulse border border-white/20" />
                            ))
                        ) : filteredFlags.length > 0 ? (
                            filteredFlags.map((flag, idx) => (
                                <motion.div
                                    key={flag.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="relative group p-8 rounded-[40px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/60 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col lg:flex-row lg:items-center gap-8"
                                >
                                    {/* Alert Glow */}
                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-500" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{flag.title}</h3>
                                            <Badge variant="error" className="animate-pulse">URGENT</Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-6">
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="w-4 h-4 text-slate-400" />
                                                <span className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-widest">{flag.user?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4 text-slate-400" />
                                                <span className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-widest">
                                                    {new Date(flag.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-rose-500" />
                                                <span className="text-[11px] font-black uppercase text-rose-500 tracking-widest">Low AI Confidence: {(flag.confidenceScore * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:text-right min-w-[200px]">
                                        <p className="text-3xl font-black text-rose-600 tracking-tighter leading-none">{formatCurrency(flag.amount)}</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Flagged Amount</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleReject(flag.id)}
                                            className="px-8 py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                                        >
                                            Terminate
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-40 text-center space-y-6 bg-white/20 dark:bg-slate-900/20 backdrop-blur-xl rounded-[40px] border border-dashed border-slate-300 dark:border-slate-700">
                                <ShieldExclamationIcon className="w-16 h-16 text-slate-400 mx-auto" />
                                <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">No Disruptions Detected</h3>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageTransition>
    );
};

export default FraudFlags;
