import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useTeamStore from '../../../store/teamStore';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import {
    ArrowDownTrayIcon,
    DocumentArrowDownIcon,
    ChartPieIcon,
    ArrowTrendingUpIcon,
    PresentationChartLineIcon,
    CalendarIcon,
    TableCellsIcon
} from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';
import { formatCurrency } from '../../../utils/helpers';
import PageTransition from '../../../components/layout/PageTransition';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899'];

const ManagerReports = () => {
    const { stats, fetchTeamStats, isLoading } = useTeamStore();
    const [dateRange, setDateRange] = useState('this_month');

    useEffect(() => {
        fetchTeamStats({ range: dateRange });
    }, [dateRange]);

    const monthlyData = stats?.monthlyData || [
        { month: 'Jan', amount: 4000 },
        { month: 'Feb', amount: 3000 },
        { month: 'Mar', amount: 5000 },
        { month: 'Apr', amount: 2780 },
        { month: 'May', amount: 3890 },
        { month: 'Jun', amount: 4390 },
    ];

    const categoryData = stats?.categoryData || [
        { name: 'Travel', value: 400 },
        { name: 'Food', value: 300 },
        { name: 'Office', value: 300 },
        { name: 'Tech', value: 200 },
    ];

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

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 sm:px-6">

                {/* ── Executive Analytics Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-5"
                        >
                            <div className="p-5 rounded-[24px] bg-slate-900 dark:bg-emerald-600 text-white shadow-2xl shadow-emerald-600/20">
                                <PresentationChartLineIcon className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Team Insight</h1>
                                <p className="text-[11px] text-emerald-500 dark:text-emerald-400 font-black uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    Operational Command Telemetry
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="appearance-none rounded-[20px] px-6 py-4 bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500 pr-12 transition-all cursor-pointer hover:bg-white/60 dark:hover:bg-white/10"
                            >
                                <option value="this_month">This Month</option>
                                <option value="last_month">Last Month</option>
                                <option value="last_3_months">Last 3 Months</option>
                                <option value="this_year">This Year</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="p-4 rounded-[20px] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-500 hover:text-emerald-500 transition-all shadow-sm">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                            </button>
                            <button className="p-4 rounded-[20px] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-500 hover:text-emerald-500 transition-all shadow-sm">
                                <DocumentArrowDownIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Visual Intelligence Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Team Monthly Spending (Area) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative group lg:col-span-2"
                    >
                        <div className="absolute -inset-1.5 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 rounded-[48px] blur-2xl opacity-50" />
                        <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/60 dark:border-white/10 shadow-xl overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                                        <ArrowTrendingUpIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Aggregate Volume Flow</h3>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Live Stream
                                </div>
                            </div>
                            <div className="h-[450px]">
                                {isLoading ? <Skeleton className="h-full w-full rounded-2xl" /> : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyData}>
                                            <defs>
                                                <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
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
                                                stroke="#10B981"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorTeam)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Team Category Distribution (Donut) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-1.5 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-[48px] blur-2xl opacity-50" />
                        <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/60 dark:border-white/10 shadow-xl min-h-[500px] flex flex-col justify-between">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                                    <ChartPieIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Sector Allocation</h3>
                            </div>
                            <div className="h-[300px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={90}
                                            outerRadius={130}
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
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Diversity Index</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">High</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-10">
                                {categoryData.slice(0, 4).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Operational Precision (Bar) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-1.5 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-[48px] blur-2xl opacity-50" />
                        <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/60 dark:border-white/10 shadow-xl min-h-[500px]">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                                    <TableCellsIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Precision Matrix</h3>
                            </div>
                            <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData}>
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
                                        <Bar
                                            dataKey="amount"
                                            fill="#3b82f6"
                                            radius={[12, 12, 4, 4]}
                                            barSize={32}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-8 bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10">
                                <p className="text-[10px] text-blue-500/60 font-black uppercase tracking-[0.2em]">Efficiency Rating</p>
                                <div className="flex items-end justify-between mt-2">
                                    <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none">A+ OPS</h4>
                                    <span className="text-xs font-black text-emerald-500">+14.2%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </PageTransition>
    );
};

export default ManagerReports;
