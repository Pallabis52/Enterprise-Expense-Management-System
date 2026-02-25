import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useManagerExpenseStore from '../../../store/managerExpenseStore';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import {
    FunnelIcon,
    ExclamationTriangleIcon,
    BanknotesIcon,
    Squares2X2Icon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowRightCircleIcon,
    EyeIcon,
    ArrowPathIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    MagnifyingGlassIcon,
    CircleStackIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../../utils/helpers';
import VoiceButton from '../../../components/ui/VoiceButton';
import userService from '../../../services/userService';
import SmartApprovalBadge from '../../../components/ai/SmartApprovalBadge';
import UnifiedSearchBar from '../../../components/ui/UnifiedSearchBar';
import ExpenseApprovalDrawer from './ExpenseApprovalDrawer';
import { cn } from '../../../utils/helpers';
import PageTransition from '../../../components/layout/PageTransition';

const statusConfig = {
    'APPROVED': { variant: 'success', icon: CheckCircleIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    'PENDING': { variant: 'warning', icon: ClockIcon, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    'REJECTED': { variant: 'error', icon: XCircleIcon, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    'FORWARDED_TO_ADMIN': { variant: 'info', icon: ArrowRightCircleIcon, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
};

const ManagerExpenseList = () => {
    const STATUS_OPTIONS = useMemo(() => [
        { label: 'All Operations', value: '', icon: <Squares2X2Icon />, iconColor: 'text-slate-500' },
        { label: 'Pending Audit', value: 'PENDING', icon: <ClockIcon />, iconColor: 'text-amber-500' },
        { label: 'Verified', value: 'APPROVED', icon: <CheckCircleIcon />, iconColor: 'text-emerald-500' },
        { label: 'Flagged/Rejected', value: 'REJECTED', icon: <XCircleIcon />, iconColor: 'text-rose-500' },
        { label: 'Escalated', value: 'FORWARDED_TO_ADMIN', icon: <ArrowRightCircleIcon />, iconColor: 'text-indigo-500' },
    ], []);

    const {
        expenses,
        loading,
        pagination,
        dashboard,
        fetchExpenses,
        fetchDashboard,
        setCurrentExpense,
        setExpenses,
    } = useManagerExpenseStore();

    const [status, setStatus] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        fetchExpenses({ status: status || undefined, page: 1 });
        fetchDashboard();
    }, [status]);

    const handleSearchResults = (results) => {
        setExpenses(results);
    };

    const handleRowClick = expense => {
        setCurrentExpense(expense);
        setDrawerOpen(true);
    };

    const handlePageChange = page => fetchExpenses({ status: status || undefined, page });

    const handleViewReceipt = async (e, id) => {
        e.stopPropagation();
        try {
            const url = await userService.viewReceipt(id);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Failed to view receipt', error);
        }
    };

    const budgetExceeded = dashboard?.budget?.exceeded;

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 sm:px-6">

                {/* ── Budget Disruption Alert ── */}
                <AnimatePresence>
                    {budgetExceeded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-rose-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                                <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-[32px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-rose-500/30 text-rose-600 dark:text-rose-400">
                                    <div className="p-4 rounded-2xl bg-rose-500/10 shadow-lg shadow-rose-500/5 animate-pulse">
                                        <ExclamationTriangleIcon className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="text-lg font-black uppercase tracking-tighter">Budget Protocol Violation</h4>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                                            Squad has utilized {formatCurrency(dashboard?.budget?.spent)} of {formatCurrency(dashboard?.budget?.budget)} allocation.
                                            Global Admin intervention required for further asset distribution.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Tactical Header & Search ── */}
                <div className="relative pt-8">
                    <div className="flex flex-col xl:flex-row items-center gap-8 justify-between">
                        <div className="space-y-4 text-center xl:text-left">
                            <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Command Center</h1>
                            <p className="text-[11px] text-emerald-500 font-black uppercase tracking-[0.4em] mt-4 flex items-center justify-center xl:justify-start gap-3">
                                <ShieldCheckIcon className="w-4 h-4" />
                                Operational Vigilance Interface
                            </p>
                        </div>

                        <div className="flex items-center gap-6">
                            <VoiceButton
                                role="MANAGER"
                                onResult={(r) => {
                                    if (r.intent === 'APPROVE_EXPENSE' || r.intent === 'REJECT_EXPENSE') {
                                        fetchExpenses({ status: status || undefined, page: 1 });
                                        fetchDashboard();
                                    }
                                }}
                            />
                            <div className="px-6 py-4 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-white/10 flex items-center gap-4 shadow-xl">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-none">Security Active</span>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                        <div className="relative z-[30] flex flex-col lg:flex-row items-center gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[40px] p-4 rounded-[40px] border border-white/60 dark:border-white/10 shadow-2xl">

                            {/* Status Orbital Filter */}
                            <div className="flex items-center gap-6 pl-4 border-r border-slate-200 dark:border-slate-800 pr-8">
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] pl-1">Audit Protocol</span>
                                    <div className="min-w-[180px] relative">
                                        <CustomDropdown
                                            options={STATUS_OPTIONS}
                                            value={status}
                                            onChange={setStatus}
                                            className="relative z-[100]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] pl-1">Registry</span>
                                    <div className="flex items-center gap-3">
                                        <div className="px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-black">
                                            {expenses?.length || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Neural Search */}
                            <div className="flex-1 w-full lg:w-auto">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] pl-3 mb-2 block">Manager Intelligence Hub</span>
                                <UnifiedSearchBar
                                    onResults={handleSearchResults}
                                    placeholder="Trace employee, entity ID, or pattern..."
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── Operational Matrix Bar ── */}
                <AnimatePresence>
                    {dashboard && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6"
                        >
                            {[
                                { label: 'Pending Audit', value: dashboard.pendingCount, icon: ClockIcon, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                { label: 'Escalated', value: dashboard.forwardedCount, icon: ArrowRightCircleIcon, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                                { label: 'Flagged Assets', value: dashboard.flaggedCount, icon: ExclamationTriangleIcon, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                                { label: 'Total Volume', value: formatCurrency(dashboard.monthlySpend), icon: BanknotesIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    whileHover={{ scale: 1.02 }}
                                    className="relative group p-6 rounded-[32px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl overflow-hidden"
                                >
                                    <div className={cn("inline-flex p-3 rounded-2xl mb-4 shadow-lg shadow-black/5", stat.bg, stat.color)}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <p className={cn("text-2xl font-black tracking-tighter", stat.color)}>{stat.value}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                                    <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-slate-500/5 blur-2xl rounded-full" />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Registry Modules (List) ── */}
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="py-32 flex flex-col items-center gap-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
                                />
                                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500 animate-pulse">Initializing Data Stream...</span>
                            </div>
                        ) : expenses && expenses.length > 0 ? (
                            expenses.map((row, idx) => {
                                const cfg = statusConfig[row.status] || { icon: Squares2X2Icon, color: 'text-slate-500', bg: 'bg-slate-500/10' };
                                return (
                                    <motion.div
                                        layout
                                        key={row.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => handleRowClick(row)}
                                        className={cn(
                                            "relative group p-6 md:p-8 rounded-[40px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/60 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden",
                                            row.isDuplicate && "border-l-8 border-amber-500"
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        <div className="relative flex flex-col md:flex-row md:items-center gap-10">
                                            {/* Identity Slot */}
                                            <div className="flex items-center gap-6 min-w-[240px]">
                                                <div className="relative">
                                                    <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                                                    <div className="relative w-16 h-16 rounded-2xl bg-slate-900 dark:bg-emerald-950 flex items-center justify-center text-2xl font-black text-white border border-white/20">
                                                        {row.user?.name?.[0] || 'E'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{row.user?.name || 'Unknown User'}</h4>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{row.user?.email}</p>
                                                </div>
                                            </div>

                                            {/* Entity Data Slot */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center flex-wrap gap-4">
                                                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter leading-tight">{row.title}</h3>
                                                    {row.isDuplicate && (
                                                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest border border-amber-500/20 flex items-center gap-2">
                                                            <ExclamationTriangleIcon className="w-3 h-3" /> Duplicate Collision
                                                        </span>
                                                    )}
                                                    {row.status === 'PENDING' && <SmartApprovalBadge expenseId={row.id} />}
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                                        <CircleStackIcon className="w-3 h-3 text-slate-400" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{row.category}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <ClockIcon className="w-3 h-3 text-slate-400" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Monetary Value slot */}
                                            <div className="md:text-right min-w-[150px]">
                                                <p className={cn(
                                                    "text-3xl font-black tracking-tighter leading-none",
                                                    row.amount > 50_000 ? "text-rose-600" : row.amount > 10_000 ? "text-amber-500" : "text-emerald-500"
                                                )}>
                                                    {formatCurrency(row.amount)}
                                                </p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Asset Value</p>
                                            </div>

                                            {/* Status Slot */}
                                            <div className="flex items-center gap-6">
                                                <div className={cn("px-5 py-3 rounded-2xl flex items-center gap-3 border shadow-sm", cfg.bg, cfg.color, "border-current/10")}>
                                                    <cfg.icon className="w-5 h-5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{row.status}</span>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    className="p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                    onClick={() => handleRowClick(row)}
                                                    title="View Matrix Details"
                                                >
                                                    <EyeIcon className="w-6 h-6 text-indigo-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="py-40 text-center space-y-6 bg-white/20 dark:bg-slate-900/20 backdrop-blur-xl rounded-[40px] border border-dashed border-slate-300 dark:border-slate-700">
                                <div className="inline-flex p-6 rounded-full bg-slate-100 dark:bg-slate-800/50">
                                    <MagnifyingGlassIcon className="w-12 h-12 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">No Entities Matches Matrix</h3>
                                    <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest mt-2">Adjust filter protocols for broader scan</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Orbital Pagination ── */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-between items-center py-10 px-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[40px] border border-white/60 dark:border-white/10">
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                            Matrix Sector <span className="text-emerald-500">{pagination.page}</span> / <span className="text-slate-400">{pagination.totalPages}</span>
                        </p>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 active:scale-95 transition-all"
                                disabled={pagination.page <= 1}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                Previous Sector
                            </Button>
                            <Button
                                className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                Next Sector
                            </Button>
                        </div>
                    </div>
                )}

                {/* ── Inspection Drawer ── */}
                <ExpenseApprovalDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
            </div>
        </PageTransition>
    );
};

export default ManagerExpenseList;
