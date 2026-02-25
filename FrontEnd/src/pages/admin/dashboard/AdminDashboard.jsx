import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ChartPieIcon,
    UsersIcon,
    CpuChipIcon,
    ArrowRightIcon,
    ServerIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    SparklesIcon,
    ArrowUpRightIcon,
    DocumentChartBarIcon
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
import useReportStore from '../../../store/reportStore';
import useAuthStore from '../../../store/authStore';
import { formatCurrency, cn } from '../../../utils/helpers';
import Skeleton from '../../../components/ui/Skeleton';
import Card3D from '../../../components/ui/Card3D';
import PageTransition from '../../../components/layout/PageTransition';
import VoiceButton from '../../../components/ui/VoiceButton';

const AdminDashboard = () => {
    const { fetchDashboardData, stats, isLoading } = useReportStore();
    const { user } = useAuthStore();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        fetchDashboardData();
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('System Online');
        else if (hour < 18) setGreeting('Operations Active');
        else setGreeting('Night Watch');
    }, []);

    // Enterprise mock data for global trends
    const systemTrendData = [
        { name: 'Jan', volume: 45000, efficiency: 98 },
        { name: 'Feb', volume: 52000, efficiency: 97 },
        { name: 'Mar', volume: 48000, efficiency: 99 },
        { name: 'Apr', volume: 61000, efficiency: 96 },
        { name: 'May', volume: 55000, efficiency: 98 },
        { name: 'Jun', volume: 67000, efficiency: 99 },
    ];

    const KPICard = ({ title, value, icon: Icon, color, delay, subtext }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            <Card3D className="group relative p-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border border-white/50 dark:border-gray-800/20 shadow-2xl shadow-primary-500/5 overflow-hidden">
                <div className="absolute -right-4 -bottom-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <Icon className="w-24 h-24 text-primary-500" />
                </div>

                <div className="relative z-10">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:rotate-3 duration-500 shadow-lg",
                        `bg-${color}-500/10 text-${color}-600 dark:text-${color}-400`
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-primary-500/60 uppercase tracking-[0.2em] mb-1">{title}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                            {isLoading ? <Skeleton className="h-8 w-24" /> : value}
                        </h3>
                        {subtext && (
                            <p className="mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500 shadow-[0_0_8px_rgba(var(--primary-500-rgb),0.5)]`} />
                                {subtext}
                            </p>
                        )}
                    </div>
                </div>
            </Card3D>
        </motion.div>
    );

    return (
        <PageTransition>
            <div className="space-y-8 pb-10 max-w-[1800px] mx-auto">

                {/* Enterprise Command Center Hero */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative p-12 rounded-[48px] overflow-hidden group shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)]"
                >
                    {/* Dark Enterprise Background */}
                    <div className="absolute inset-0 bg-slate-950" />
                    <div className="absolute inset-0 opacity-40">
                        <motion.div
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#3b82f6_0,transparent_50%),radial-gradient(circle_at_100%_100%,#6366f1_0,transparent_50%)] blur-[100px]"
                        />
                    </div>

                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-3 mb-6 justify-center lg:justify-start"
                            >
                                <div className="px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.4em]">
                                    Enterprise Core v2.4
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Global Sync Active</span>
                                </div>
                            </motion.div>

                            <h1 className="text-6xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-[0.85]">
                                {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-400">{user?.name?.split(' ')[0]}</span>
                            </h1>

                            <p className="text-slate-400 text-xl font-medium max-w-xl mb-10 leading-relaxed">
                                System integrity is at <span className="text-white font-bold">100%</span>. You are overseeing <span className="text-primary-400 font-bold">{stats?.userCount || 0} users</span> across <span className="text-indigo-400 font-bold">{stats?.teamCount || 0} enterprise teams</span>.
                            </p>

                            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 rounded-[24px] bg-primary-600 text-white font-black text-sm shadow-2xl shadow-primary-600/30 hover:bg-primary-500 transition-all flex items-center gap-3"
                                >
                                    Global Intelligence <SparklesIcon className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 rounded-[24px] bg-white/5 backdrop-blur-xl text-white font-black text-sm border border-white/10 transition-all hover:bg-white/10"
                                >
                                    System Settings
                                </motion.button>
                            </div>
                        </div>

                        {/* Interactive Global Pulse */}
                        <div className="hidden xl:flex flex-col gap-4">
                            <Card3D className="p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] w-80 shadow-2xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-2xl bg-primary-500/20 text-primary-400">
                                        <ServerIcon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Global Compute</p>
                                        <p className="text-3xl font-black text-white">99.9%</p>
                                    </div>
                                </div>
                                <div className="h-12 flex items-end gap-1 px-1">
                                    {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            className="flex-1 bg-gradient-to-t from-primary-600 to-indigo-400 rounded-t-sm opacity-60"
                                        />
                                    ))}
                                </div>
                            </Card3D>
                        </div>
                    </div>
                </motion.div>

                {/* System KPI Architecture */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    <KPICard
                        title="Global Spend"
                        value={formatCurrency(stats?.totalSpent || 0)}
                        icon={BanknotesIcon}
                        color="primary"
                        delay={0.3}
                        subtext="Aggregated Real-time"
                    />
                    <KPICard
                        title="Avg Spend Velocity"
                        value={formatCurrency(stats?.avgMonthlySpend || 0)}
                        icon={ArrowTrendingUpIcon}
                        color="emerald"
                        delay={0.4}
                        subtext="↑ 4.2% Growth"
                    />
                    <KPICard
                        title="Schema Domains"
                        value={stats?.categoryCount || "0"}
                        icon={ChartPieIcon}
                        color="amber"
                        delay={0.5}
                        subtext="Active Taxonomies"
                    />
                    <KPICard
                        title="Global Directory"
                        value={stats?.userCount || "0"}
                        icon={UsersIcon}
                        color="purple"
                        delay={0.6}
                        subtext="Verified Identities"
                    />
                    <KPICard
                        title="Strategic Teams"
                        value={stats?.teamCount || "0"}
                        icon={UserGroupIcon}
                        color="indigo"
                        delay={0.7}
                        subtext="Enterprise Units"
                    />
                </div>

                {/* Enterprise Analytics & Neural Command */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* System Volume Matrix */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="lg:col-span-2 relative p-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[40px] border border-white/50 dark:border-primary-800/10 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Enterprise Volume Matrix</h3>
                                <p className="text-slate-500 font-medium">Multi-dimensional spend analysis across all operational units</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-600">
                                <CpuChipIcon className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="h-[400px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={systemTrendData}>
                                    <defs>
                                        <linearGradient id="adminIndigoGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="10 10" stroke="#94a3b8" opacity={0.05} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 900 }}
                                        dy={15}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                            borderRadius: '24px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            padding: '20px',
                                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="volume"
                                        stroke="#6366f1"
                                        strokeWidth={6}
                                        fillOpacity={1}
                                        fill="url(#adminIndigoGradient)"
                                        animationDuration={3000}
                                        animationEasing="ease-in-out"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Neural Command Quick Actions */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <VoiceButton role="ADMIN" />
                        </motion.div>

                        <Card3D className="p-10 bg-primary-600 rounded-[40px] text-white shadow-2xl shadow-primary-600/30 relative overflow-hidden group">
                            <div className="absolute -right-10 -bottom-10 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                                <DocumentChartBarIcon className="w-56 h-56" />
                            </div>
                            <h4 className="text-2xl font-black mb-3 tracking-tight">Financial Audits</h4>
                            <p className="text-primary-100/70 text-sm font-bold mb-8 leading-relaxed">System-wide audit trail and reconciliation tools are ready.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="bg-white text-primary-600 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl"
                            >
                                Run Global Report
                            </motion.button>
                        </Card3D>

                        <div className="grid grid-cols-2 gap-4">
                            <motion.button
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-[32px] bg-white/40 dark:bg-slate-900 border border-white/50 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col items-center gap-3 transition-all"
                            >
                                <UsersIcon className="w-6 h-6 text-primary-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Users</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-[32px] bg-white/40 dark:bg-slate-900 border border-white/50 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col items-center gap-3 transition-all"
                            >
                                <ShieldCheckIcon className="w-6 h-6 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Trust</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Local Subtle Texture Overlay */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.01] bg-slate-500/5 z-[-1]" />
            </div>
        </PageTransition>
    );
};

export default AdminDashboard;
