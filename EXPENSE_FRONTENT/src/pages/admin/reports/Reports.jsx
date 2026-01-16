import React, { useEffect, useState } from 'react';
import useReportStore from '../../../store/reportStore';
import ReportFilters from './ReportFilters';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { formatCurrency } from '../../../utils/helpers';
import Skeleton from '../../../components/ui/Skeleton';
import { ArrowTrendingUpIcon, BanknotesIcon, ChartPieIcon } from '@heroicons/react/24/outline';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Reports = () => {
    const { fetchDashboardData, monthlyData, categoryData, stats, isLoading } = useReportStore();
    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        month: 'all'
    });

    useEffect(() => {
        fetchDashboardData();
        // In a real app, we would pass filters to fetchDashboardData(filters)
    }, [filters]);

    const KPICard = ({ title, value, icon: Icon, trend, color }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {isLoading ? <Skeleton className="h-8 w-24" /> : value}
                    </h3>
                </div>
                <div className={`p-3 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-emerald-600 font-medium flex items-center">
                        <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                        {trend}
                    </span>
                    <span className="text-gray-400 ml-2">vs last month</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>

            <ReportFilters filters={filters} onChange={setFilters} />

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Total Expenses"
                    value={formatCurrency(stats?.totalExpense || 0)}
                    icon={BanknotesIcon}
                    trend="+12.5%"
                    color="primary"
                />
                <KPICard
                    title="Avg. Monthly Spend"
                    value={formatCurrency(stats?.avgMonthly || 0)}
                    icon={ArrowTrendingUpIcon}
                    color="emerald"
                />
                <KPICard
                    title="Top Category"
                    value={stats?.topCategory || "N/A"}
                    icon={ChartPieIcon}
                    color="amber"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Monthly Bar Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Monthly Expenses</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Expense Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Reports;
