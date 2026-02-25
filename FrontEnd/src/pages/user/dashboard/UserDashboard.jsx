import React, { useEffect, useMemo } from 'react';
import {
    BanknotesIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ArrowUpRightIcon,
    PresentationChartBarIcon,
    CreditCardIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import useUserExpenseStore from '../../../store/userExpenseStore';
import useAuthStore from '../../../store/authStore';
import Card3D from '../../../components/ui/Card3D';
import PageTransition from '../../../components/layout/PageTransition';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';

const StatCard = ({ title, value, icon: Icon, color, delay, subtext }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
        <Card3D className="group relative p-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl border border-white/50 dark:border-gray-700/50 shadow-2xl shadow-indigo-500/5 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150" />

            <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white">
                        {value}
                    </p>
                    {subtext && <p className="text-[10px] text-gray-400 font-medium">{subtext}</p>}
                </div>
                <div className={`p-4 rounded-[18px] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${color} shadow-lg shadow-indigo-500/10`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* Micro Sparkline Indicator */}
            <div className="mt-4 pt-4 border-t border-gray-100/50 dark:border-gray-700/50 flex items-center gap-2">
                <div className="flex gap-1">
                    {[0.6, 0.4, 0.8, 0.5, 0.9, 0.6, 0.7].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 4 }}
                            animate={{ height: h * 12 }}
                            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 + i * 0.2 }}
                            className="w-1 bg-indigo-500/30 dark:bg-indigo-400/30 rounded-full"
                        />
                    ))}
                </div>
                <span className="text-[9px] font-bold text-indigo-500/60 dark:text-indigo-400/60 uppercase tracking-widest">Active Analysis</span>
            </div>
        </Card3D>
    </motion.div>
);

const UserDashboard = () => {
    const { user } = useAuthStore();
    const { stats, expenses, fetchMyStats, fetchMyExpenses, isLoading } = useUserExpenseStore();

    useEffect(() => {
        fetchMyStats();
        fetchMyExpenses(1); // Get recent activity
    }, []);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const columns = [
        {
            title: 'Expense',
            key: 'title',
            render: row => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white">{row.title}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{row.category}</span>
                </div>
            )
        },
        {
            title: 'Amount',
            key: 'amount',
            render: row => <span className="font-black text-gray-900 dark:text-white">₹{row.amount.toLocaleString()}</span>
        },
        {
            title: 'Status',
            key: 'status',
            render: row => {
                const variant = row.status === 'APPROVED' ? 'success' : row.status === 'REJECTED' ? 'error' : 'warning';
                return <Badge variant={variant}>{row.status}</Badge>;
            }
        },
        {
            title: 'Date',
            key: 'date',
            render: row => <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">{new Date(row.date).toLocaleDateString()}</span>
        }
    ];

    return (
        <PageTransition>
            <div className="space-y-10 pb-20">
                {/* ── Immersive Hero Header ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="relative p-10 rounded-[40px] overflow-hidden group shadow-2xl shadow-indigo-500/10"
                >
                    {/* Living Mesh Gradient Background */}
                    <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-700" />
                    <div className="absolute inset-0 opacity-40 dark:opacity-60 overflow-hidden">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, 50, 0],
                                rotate: [0, 5, 0]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_30%_50%,#818cf8_0,transparent_25%),radial-gradient(circle_at_70%_50%,#c084fc_0,transparent_25%)] blur-[100px]"
                        />
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 dark:bg-black/10 backdrop-blur-[2px]" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/10 border border-white dark:border-white/20 shadow-sm"
                            >
                                <span className="flex w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">System Ready</span>
                            </motion.div>

                            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                                {greeting}, <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                    {user?.name || "Member"}
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-lg">
                                Your expense ecosystem is updated. You have <span className="text-indigo-500 font-bold">{stats?.pendingCount || 0} items</span> awaiting review.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <div className="relative p-1 bg-white/50 dark:bg-white/10 rounded-[32px] border border-white dark:border-white/20 shadow-2xl backdrop-blur-xl">
                                <div className="p-8 bg-white dark:bg-gray-800 rounded-[28px] text-center shadow-inner">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total Allocated</p>
                                    <p className="text-4xl font-black text-gray-900 dark:text-white">
                                        {formatCurrency(stats?.totalSpent)}
                                    </p>
                                    <div className="mt-4 flex flex-col gap-1 items-center">
                                        <div className="w-32 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '65%' }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                            />
                                        </div>
                                        <span className="text-[9px] font-bold text-indigo-500 uppercase">65% of monthly target</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Reimbursements"
                        value={formatCurrency(stats?.totalSpent)}
                        icon={BanknotesIcon}
                        color="bg-indigo-500"
                        subtext="Total life-time spend"
                        delay={0.1}
                    />
                    <StatCard
                        title="Active Review"
                        value={stats?.pendingCount || 0}
                        icon={ClockIcon}
                        color="bg-amber-500"
                        subtext="Awaiting manager approval"
                        delay={0.2}
                    />
                    <StatCard
                        title="Confirmed"
                        value={stats?.approvedCount || 0}
                        icon={CheckCircleIcon}
                        color="bg-emerald-500"
                        subtext="Successfully reimbursed"
                        delay={0.3}
                    />
                    <StatCard
                        title="Flagged"
                        value={stats?.rejectedCount || 0}
                        icon={XCircleIcon}
                        color="bg-rose-500"
                        subtext="Requires clarification"
                        delay={0.4}
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* ── Recent Activity ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="xl:col-span-2 space-y-4"
                    >
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                                    <PresentationChartBarIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Recent Logistics</h2>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Chronological stream of claims</p>
                                </div>
                            </div>
                            <a href="/user/expenses" className="group flex items-center gap-1.5 text-[11px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                                View Intelligence
                                <ArrowUpRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </div>

                        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-[32px] border border-white dark:border-gray-700 shadow-2xl shadow-indigo-500/5 overflow-hidden">
                            <Table
                                columns={columns}
                                data={expenses.slice(0, 5)}
                                isLoading={isLoading}
                                emptyMessage="No recent activity detected."
                            />
                        </div>
                    </motion.div>

                    {/* ── Quick Actions ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 px-2">
                            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                                <RocketLaunchIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Quick Access</h2>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Neural shortcuts</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: 'New Submission', desc: 'Create a claim entry', icon: CreditCardIcon, color: 'indigo', href: '/user/expenses' },
                                { title: 'Financial Reports', desc: 'Download breakdown', icon: PresentationChartBarIcon, color: 'purple', href: '/user/reports' }
                            ].map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.href}
                                    className="group p-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-[32px] border border-white/50 dark:border-gray-700/50 shadow-xl shadow-indigo-500/5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/60 dark:hover:bg-gray-800/60"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-2xl bg-${item.color}-500 text-white shadow-lg shadow-${item.color}-500/20 group-hover:rotate-6 transition-transform`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">{item.title}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.desc}</p>
                                        </div>
                                        <div className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                            <ArrowUpRightIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default UserDashboard;
