import React, { useEffect, useState } from 'react';
import useTeamStore from '../../../store/teamStore';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { ArrowDownTrayIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';
import { formatCurrency } from '../../../utils/helpers';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const ManagerReports = () => {
    const { stats, fetchTeamStats, isLoading } = useTeamStore();
    const [dateRange, setDateRange] = useState('this_month');

    useEffect(() => {
        fetchTeamStats({ range: dateRange });
    }, [dateRange]);

    // Mock chart data if stats is empty (for visualization)
    const monthlyData = stats?.monthlyData || [
        { month: 'Jan', amount: 4000 },
        { month: 'Feb', amount: 3000 },
        { month: 'Mar', amount: 5000 },
        { month: 'Apr', amount: 2780 },
    ];

    const categoryData = stats?.categoryData || [
        { name: 'Travel', value: 400 },
        { name: 'Food', value: 300 },
        { name: 'Office', value: 300 },
        { name: 'Tech', value: 200 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Insights into team spending patterns.</p>
                </div>

                <div className="flex gap-2">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-emerald-500 shadow-sm"
                    >
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                        <option value="last_3_months">Last 3 Months</option>
                        <option value="this_year">This Year</option>
                    </select>

                    <Button variant="outline" size="sm" onClick={() => alert("Exporting CSV...")}>
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                        CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => alert("Exporting PDF...")}>
                        <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                        PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Team Monthly Spending (Bar) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Monthly Spending</h3>
                    {isLoading ? <Skeleton className="h-80 w-full" /> : (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value) => formatCurrency(value)}
                                    />
                                    <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Team Spending Trend (Line) - NEW */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Spending Trend</h3>
                    {isLoading ? <Skeleton className="h-80 w-full" /> : (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Team Category Distribution (Pie) */}
                <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Spending by Category</h3>
                    {isLoading ? <Skeleton className="h-80 w-full" /> : (
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
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ManagerReports;
