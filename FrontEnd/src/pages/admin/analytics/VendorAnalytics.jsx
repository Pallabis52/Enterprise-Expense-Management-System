import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CpuChipIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    ChartBarIcon,
    CheckCircleIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import adminExpenseService from '../../../services/adminExpenseService';
import { formatCurrency } from '../../../utils/helpers';
import PageTransition from '../../../components/layout/PageTransition';
import { cn } from '../../../utils/helpers';
import Badge from '../../../components/ui/Badge';

const VendorAnalytics = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const data = await adminExpenseService.getVendors();
            setVendors(data);
        } catch (error) {
            console.error('Failed to fetch vendors', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(v =>
        v.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">

                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Vendors</h1>
                        <p className="text-[11px] text-blue-500 font-black uppercase tracking-[0.4em] flex items-center gap-3">
                            <CpuChipIcon className="w-4 h-4" />
                            Supply Chain Intelligence
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <button
                                onClick={fetchVendors}
                                className="relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
                            >
                                <ArrowPathIcon className={cn("w-6 h-6", loading && "animate-spin")} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search & Intelligence Bar */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[32px] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                    <div className="relative flex items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-4 rounded-[32px] shadow-2xl">
                        <div className="flex-1 flex items-center gap-4 px-4">
                            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Intercept vendor signatures..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:uppercase placeholder:tracking-[0.2em]"
                            />
                        </div>
                        <div className="hidden md:flex items-center gap-8 px-8 border-l border-slate-200 dark:border-white/10">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active nodes</p>
                                <p className="text-xl font-black text-blue-600 dark:text-blue-400 tabular-nums">{vendors.length}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Suspicious</p>
                                <p className="text-xl font-black text-rose-500 tabular-nums">{vendors.filter(v => v.suspicious).length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-80 rounded-[40px] bg-white/40 dark:bg-slate-900/40 animate-pulse border border-white/20" />
                            ))
                        ) : filteredVendors.length > 0 ? (
                            filteredVendors.map((vendor, idx) => (
                                <motion.div
                                    key={vendor.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={cn(
                                        "relative group p-8 rounded-[40px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/60 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden",
                                        vendor.suspicious && "ring-2 ring-rose-500/50 bg-rose-500/5"
                                    )}
                                >
                                    {/* Glass Decor */}
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/5 blur-[80px] rounded-full" />
                                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full" />

                                    <div className="relative space-y-8">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none group-hover:text-blue-500 transition-colors">
                                                    {vendor.vendorName}
                                                </h3>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Vendor ID: {vendor.id}</p>
                                            </div>
                                            {vendor.suspicious ? (
                                                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 shadow-lg shadow-rose-500/10 animate-pulse">
                                                    <ExclamationTriangleIcon className="w-5 h-5" />
                                                </div>
                                            ) : (
                                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/10">
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                    <ChartBarIcon className="w-3 h-3" /> Volume
                                                </div>
                                                <p className="text-xl font-black text-slate-900 dark:text-white">{vendor.transactionCount}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                    <BanknotesIcon className="w-3 h-3" /> Average
                                                </div>
                                                <p className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(vendor.averageAmount)}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Exposure</p>
                                                <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                                                    {formatCurrency(vendor.totalAmount)}
                                                </p>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '70%' }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                                />
                                            </div>
                                        </div>

                                        {vendor.suspicious && (
                                            <div className="pt-4 border-t border-rose-500/20">
                                                <div className="flex items-center gap-2 text-rose-500">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Anomaly Detected</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-2 italic">
                                                    Frequent high-value transactions flagged by Audit Engine.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-40 text-center space-y-6 bg-white/20 dark:bg-slate-900/20 backdrop-blur-xl rounded-[40px] border border-dashed border-slate-300 dark:border-slate-700">
                                <div className="inline-flex p-6 rounded-full bg-slate-100 dark:bg-slate-800/50">
                                    <MagnifyingGlassIcon className="w-12 h-12 text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">No Intel Found</h3>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageTransition>
    );
};

export default VendorAnalytics;
