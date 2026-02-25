import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardDocumentCheckIcon,
    CheckCircleIcon,
    XCircleIcon,
    CurrencyDollarIcon,
    ArrowUpRightIcon,
    UsersIcon,
    PlusIcon,
    ShieldCheckIcon,
    SparklesIcon,
    ArrowRightIcon,
    CalendarIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import useTeamStore from '../../../store/teamStore';
import useAuthStore from '../../../store/authStore';
import usePolicyStore from '../../../store/policyStore';
import { formatCurrency, cn } from '../../../utils/helpers';
import Skeleton from '../../../components/ui/Skeleton';
import Card3D from '../../../components/ui/Card3D';
import PolicyModal from '../../admin/policies/PolicyModal';
import InviteModal from '../../../components/manager/InviteModal';

const ManagerDashboard = () => {
    const { stats, fetchTeamStats, isLoading } = useTeamStore();
    const { user } = useAuthStore();
    const { createPolicy } = usePolicyStore();
    const navigate = useNavigate();

    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        fetchTeamStats();
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const handleCreatePolicy = async (policyData) => {
        const success = await createPolicy(policyData, true);
        if (success) setIsPolicyModalOpen(false);
    };

    // Realistic mock data for visualization
    const chartData = [
        { name: 'Mon', amount: 2400 },
        { name: 'Tue', amount: 1398 },
        { name: 'Wed', amount: 3800 },
        { name: 'Thu', amount: 3908 },
        { name: 'Fri', amount: 4800 },
        { name: 'Sat', amount: 3800 },
        { name: 'Sun', amount: 4300 },
    ];

    const categoryData = [
        { name: 'Travel', value: 45, color: '#10b981' },
        { name: 'Food', value: 25, color: '#312e81' },
        { name: 'Office', value: 20, color: '#6366f1' },
        { name: 'Other', value: 10, color: '#94a3b8' },
    ];

    const StatCard = ({ title, value, icon: Icon, color, delay, subtext }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <Card3D className="group relative p-6 bg-white/40 dark:bg-emerald-950/20 backdrop-blur-2xl border border-white/50 dark:border-emerald-800/20 shadow-2xl shadow-emerald-500/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon className="w-16 h-16 text-emerald-500" />
                </div>

                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 shadow-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 dark:text-emerald-500/60 uppercase tracking-[0.2em] mb-1">{title}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                            {isLoading ? <Skeleton className="h-8 w-24" /> : value}
                        </h3>
                        {subtext && (
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    {subtext}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Card3D>
        </motion.div>
    );

    return (
        <div className="space-y-8 pb-10 max-w-[1600px] mx-auto">

            {/* Immersive Team Hero */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="relative p-10 rounded-[40px] overflow-hidden group shadow-2xl shadow-emerald-500/10"
            >
                {/* Emerald Mesh Gradient Background */}
                <div className="absolute inset-0 bg-white dark:bg-slate-950 transition-colors duration-700" />
                <div className="absolute inset-0 opacity-40 dark:opacity-60 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 60, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_30%_50%,#10b981_0,transparent_25%),radial-gradient(circle_at_70%_50%,#059669_0,transparent_25%)] blur-[120px]"
                    />
                </div>

                <div className="absolute top-0 left-0 w-full h-full bg-white/10 dark:bg-emerald-950/10 backdrop-blur-[2px]" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-3 mb-4 justify-center md:justify-start"
                        >
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                Manager Dashboard
                            </div>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-[0.9]">
                            {greeting}, <span className="text-emerald-600 dark:text-emerald-400">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-slate-500 dark:text-emerald-100/60 text-lg font-medium max-w-lg mb-8">
                            Your team's financial performance is up <span className="text-emerald-600 font-black">12.5%</span> this month. You have {stats?.pendingCount || 12} items awaiting your review.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/manager/expenses')}
                                className="px-8 py-4 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all flex items-center gap-2"
                            >
                                Process Approvals <ArrowRightIcon className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsPolicyModalOpen(true)}
                                className="px-8 py-4 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-md text-slate-900 dark:text-white font-black text-sm border border-white/50 dark:border-white/10 transition-all hover:bg-white dark:hover:bg-white/20"
                            >
                                New Policy
                            </motion.button>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-6 relative">
                        <div className="absolute -inset-10 bg-emerald-500/10 rounded-full blur-[60px] animate-pulse" />
                        {/* Mini Dashboard Context */}
                        <Card3D className="w-56 p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-white/5 shadow-2xl rotate-3 mb-10 translate-y-10">
                            <ShieldCheckIcon className="w-8 h-8 text-emerald-500 mb-4" />
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Team Trust Score</p>
                            <p className="text-3xl font-black dark:text-white">98.4</p>
                        </Card3D>
                        <Card3D className="w-56 p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-white/5 shadow-2xl -rotate-6">
                            <UsersIcon className="w-8 h-8 text-indigo-500 mb-4" />
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Active Members</p>
                            <p className="text-3xl font-black dark:text-white">{stats?.activeMembers || 24}</p>
                        </Card3D>
                    </div>
                </div>
            </motion.div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Awaiting Review"
                    value={stats?.pendingCount || 12}
                    icon={ClipboardDocumentCheckIcon}
                    color="amber"
                    delay={0.4}
                    subtext="+2 since yesterday"
                />
                <StatCard
                    title="Team Efficiency"
                    value="94.2%"
                    icon={CheckCircleIcon}
                    color="emerald"
                    delay={0.5}
                    subtext="Optimized"
                />
                <StatCard
                    title="Rejected Assets"
                    value={stats?.rejectedCount || 3}
                    icon={XCircleIcon}
                    color="rose"
                    delay={0.6}
                    subtext="Policy Violations"
                />
                <StatCard
                    title="Total Spending"
                    value={formatCurrency(stats?.totalSpent || 12500)}
                    icon={CurrencyDollarIcon}
                    color="emerald"
                    delay={0.7}
                    subtext="This Cycle"
                />
            </div>

            {/* Visual Analytics & Execution Zone */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Spending Curve */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="lg:col-span-2 relative p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[32px] border border-white/50 dark:border-emerald-800/10 shadow-2xl overflow-hidden"
                >
                    <div className="relative z-10 flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Team Spending Curve</h3>
                            <p className="text-slate-400 text-sm font-medium">Daily transaction pulse across all members</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                                <CalendarIcon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="h-[340px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="managerEmeraldGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="8 8" stroke="rgba(148, 163, 184, 0.1)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 800 }}
                                    dy={10}
                                />
                                <YAxis
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderRadius: '20px',
                                        border: 'none',
                                        backdropBlur: '12px',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#managerEmeraldGradient)"
                                    animationDuration={2500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Quick Execution & Policy Lab */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 1 }}
                    className="space-y-6"
                >
                    <div className="p-8 bg-emerald-600 rounded-[32px] text-white shadow-2xl shadow-emerald-600/30 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <ShieldCheckIcon className="w-32 h-32" />
                        </div>
                        <h4 className="text-xl font-black mb-2 relative z-10 tracking-tight">Policy Control Lab</h4>
                        <p className="text-emerald-100/70 text-sm font-bold mb-6 relative z-10">Deploy new financial constraints for your team in seconds.</p>
                        <motion.button
                            whileHover={{ x: 5 }}
                            onClick={() => setIsPolicyModalOpen(true)}
                            className="bg-white text-emerald-600 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl relative z-10"
                        >
                            Create New Policy
                        </motion.button>
                    </div>

                    <Card3D className="p-8 bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl">
                        <h4 className="text-xl font-black text-white mb-6 tracking-tight">Team Management</h4>
                        <div className="space-y-4">
                            <button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                        <PlusIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300">Invite Members</span>
                                </div>
                                <ArrowUpRightIcon className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                            </button>
                            <button
                                onClick={() => navigate('/manager/reports')}
                                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                        <ChartBarIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300">Team Analytics</span>
                                </div>
                                <ArrowUpRightIcon className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                            </button>
                        </div>
                    </Card3D>
                </motion.div>
            </div>

            <PolicyModal
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                onSubmit={handleCreatePolicy}
                isLoading={false}
            />

            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
};

export default ManagerDashboard;
