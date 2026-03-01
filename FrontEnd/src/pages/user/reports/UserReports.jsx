import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import useUserExpenseStore from '../../../store/userExpenseStore';
import Card3D from '../../../components/ui/Card3D';
import PageTransition from '../../../components/layout/PageTransition';
import {
    ChartBarIcon,
    PresentationChartLineIcon,
    ArrowTrendingUpIcon,
    ArrowDownTrayIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import reportService from '../../../services/reportService';
import { toast } from 'react-hot-toast';

const UserReports = () => {
    const { fetchMyStats, stats, expenses, fetchMyExpenses } = useUserExpenseStore();

    useEffect(() => {
        fetchMyStats();
        fetchMyExpenses(1, 'all');
    }, []);

    const handleExcelDownload = async () => {
        try {
            await reportService.downloadUserExcel();
            toast.success('Fiscal intelligence exported', {
                style: { borderRadius: '16px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
        } catch (error) {
            toast.error('Export failed');
        }
    };

    // ── Data Processing Hub ──
    const monthlyData = [
        { name: 'Jan', amount: 1200, trend: 1000 },
        { name: 'Feb', amount: 2100, trend: 1500 },
        { name: 'Mar', amount: 1800, trend: 1800 },
        { name: 'Apr', amount: 4000, trend: 2500 },
        { name: 'May', amount: 2500, trend: 2800 },
        { name: 'Jun', amount: expenses.reduce((acc, curr) => acc + curr.amount, 0) || 3200, trend: 3000 }
    ];

    const statusData = [
        { name: 'SECURED', value: stats?.approvedCount || 12, color: '#10B981' },
        { name: 'PENDING', value: stats?.pendingCount || 5, color: '#6366F1' },
        { name: 'REJECTED', value: stats?.rejectedCount || 2, color: '#F43F5E' }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
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

                {/* ── Intelligence Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-5"
                        >
                            <div className="p-5 rounded-[24px] bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/20">
                                <PresentationChartLineIcon className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Strategic Intelligence</h1>
                                <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4" />
                                    Real-time Operational Telemetry
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-4"
                    >
                        <button
                            onClick={handleExcelDownload}
                            title="Download Fiscal Intelligence (Excel)"
                            className="p-4 rounded-[20px] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-500 hover:text-indigo-500 transition-all active:scale-95 group hover:shadow-2xl hover:shadow-indigo-500/20"
                        >
                            <ArrowDownTrayIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Monthly Expenditure Analysis */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1.5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-[48px] blur-2xl opacity-50" />
                            <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/60 dark:border-white/10 shadow-xl overflow-hidden">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                                            <ChartBarIcon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Expenditure Flow</h3>
                                    </div>
                                    <ArrowTrendingUpIcon className="w-6 h-6 text-emerald-500 animate-pulse" />
                                </div>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyData}>
                                            <defs>
                                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                            <XAxis
                                                dataKey="name"
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
                                                fill="url(#colorAmount)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Operational Status Matrix */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1.5 bg-gradient-to-br from-rose-500/10 to-indigo-500/10 rounded-[48px] blur-2xl opacity-50" />
                            <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/60 dark:border-white/10 shadow-xl overflow-hidden">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                                        <PresentationChartLineIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Status Matrix</h3>
                                </div>
                                <div className="h-[400px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={110}
                                                outerRadius={150}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Overlay Content */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Total Integrity</p>
                                            <p className="text-4xl font-black text-slate-900 dark:text-white mt-1">100%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-8">
                                    {statusData.map((item, idx) => (
                                        <div key={idx} className="text-center space-y-1">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.name}</p>
                                            <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "70%" }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default UserReports;
