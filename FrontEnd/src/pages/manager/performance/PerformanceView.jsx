import React, { useEffect } from 'react';
import usePerformanceStore from '../../../store/performanceStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowTrendingUpIcon, BanknotesIcon, UserGroupIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../../utils/helpers';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PerformanceView = () => {
    const { stats, isLoading, fetchTeamPerformance } = usePerformanceStore();

    useEffect(() => {
        fetchTeamPerformance();
    }, []);

    if (isLoading) return <div className="p-8 text-center">Loading performance metrics...</div>;
    if (!stats) return <div className="p-8 text-center text-gray-500">No performance data available.</div>;

    // Transform Map data for Recharts
    const categoryData = Object.entries(stats.categorySpend || {}).map(([name, value]) => ({ name, value }));
    const monthlyData = Object.entries(stats.monthlySpend || {}).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Performance</h1>
                <p className="text-gray-500 dark:text-gray-400">Analytics and insights for your team's spending.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Total Spent" value={formatCurrency(stats.totalSpent)} icon={BanknotesIcon} color="text-blue-600 bg-blue-100" />
                <KPICard title="Total Expenses" value={stats.totalExpensesCount} icon={UserGroupIcon} color="text-purple-600 bg-purple-100" />
                <KPICard title="Approved Count" value={stats.approvedCount} icon={CheckBadgeIcon} color="text-emerald-600 bg-emerald-100" />
                <KPICard title="Avg Per Member" value={formatCurrency(stats.avgExpensePerMember)} icon={ArrowTrendingUpIcon} color="text-orange-600 bg-orange-100" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Monthly Trend */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Spending Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Spender Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Top Spender</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Employee</p>
                        <p className="font-medium text-lg">{stats.topSpenderName || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-bold text-lg text-primary-600">{formatCurrency(stats.topSpenderAmount)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

export default PerformanceView;
