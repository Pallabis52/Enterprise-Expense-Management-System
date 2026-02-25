import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useReportStore from '../../../store/reportStore';
import ReportFilters from './ReportFilters';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { formatCurrency, cn } from '../../../utils/helpers';
import Skeleton from '../../../components/ui/Skeleton';
import {
    ArrowTrendingUpIcon,
    BanknotesIcon,
    ChartPieIcon,
    PresentationChartLineIcon,
    GlobeAltIcon,
    CpuChipIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import PageTransition from '../../../components/layout/PageTransition';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899'];

const Reports = () => {
    const { fetchDashboardData, monthlyData, categoryData, stats, isLoading } = useReportStore();
    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        month: 'all'
    });

    useEffect(() => {
        fetchDashboardData();
    }, [filters]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                            <p className="text-sm font-black text-white uppercase tracking-tighter">
                                ${entry.value.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const KPICard = ({ title, value, icon: Icon, trend, color, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="relative group h-full"
        >
            <div className={`absolute -inset-1 bg-gradient-to-r ${color === 'primary' ? 'from-indigo-500 to-purple-500' : color === 'emerald' ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-orange-500'} rounded-[32px] blur opacity-0 group-hover:opacity-20 transition duration-1000`} />
            <div className="relative h-full flex flex-col justify-between bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[32px] p-8 border border-white/60 dark:border-white/10 shadow-xl overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-3 tracking-tighter">
                            {isLoading ? <Skeleton className="h-10 w-32 rounded-lg" /> : value}
                        </h3>
                    </div>
                    <div className={cn(
                        "p-4 rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110",
                        color === 'primary' ? "bg-indigo-500/10 text-indigo-500" : color === 'emerald' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>

                {/* Always render trend row — keeps all cards the same height */}
                <div className="mt-6 flex items-center gap-2 relative z-10 min-h-[28px]">
                    {trend ? (
                        <>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                                {trend}
                            </div>
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">vs last month</span>
                        </>
                    ) : (
                        <span className="text-transparent select-none text-[10px]">—</span>
                    )}
                </div>

                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none" />
            </div>
        </motion.div>
    );


    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 sm:px-6">

                {/* ── Header + Filters (title left | filters right) ── */}
                <div className="flex items-center justify-between gap-6 py-4 flex-wrap">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-5"
                    >
                        <div className="p-5 rounded-[24px] bg-slate-900 dark:bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20">
                            <GlobeAltIcon className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Reports</h1>
                            <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
                                <CpuChipIcon className="w-4 h-4" />
                                System-Wide Analytics
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <ReportFilters filters={filters} onChange={setFilters} />
                    </motion.div>
                </div>



                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <KPICard
                        title="Total Expenses"
                        value={formatCurrency(stats?.totalExpense || 0)}
                        icon={BanknotesIcon}
                        trend="+12.5%"
                        color="primary"
                        delay={0.1}
                    />
                    <KPICard
                        title="Avg Monthly Spend"
                        value={formatCurrency(stats?.avgMonthly || 0)}
                        icon={ArrowTrendingUpIcon}
                        color="emerald"
                        delay={0.2}
                    />
                    <KPICard
                        title="Top Category"
                        value={stats?.topCategory || "N/A"}
                        icon={ChartPieIcon}
                        color="amber"
                        delay={0.3}
                    />
                </div>

                {/* Charts Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Monthly Volume Analysis (Area) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-1.5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-[48px] blur-2xl opacity-50" />
                        <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/60 dark:border-white/10 shadow-xl overflow-hidden min-h-[500px]">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                                    <PresentationChartLineIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Monthly Spend</h3>
                            </div>
                            <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyData}>
                                        <defs>
                                            <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            tickFormatter={(v) => `$${v}`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#6366F1"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorAdmin)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sector Distribution Matrix (Donut) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-1.5 bg-gradient-to-br from-purple-500/10 to-rose-500/10 rounded-[48px] blur-2xl opacity-50" />
                        <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/60 dark:border-white/10 shadow-xl overflow-hidden min-h-[500px] flex flex-col justify-between">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                                    <ChartPieIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">By Category</h3>
                            </div>
                            <div className="h-[300px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={100}
                                            outerRadius={140}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Coverage</p>
                                        <p className="text-3xl font-black text-emerald-500 mt-1">OPTIMIZED</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-8 justify-center">
                                {categoryData.slice(0, 5).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                        <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </PageTransition>
    );
};

export default Reports;
