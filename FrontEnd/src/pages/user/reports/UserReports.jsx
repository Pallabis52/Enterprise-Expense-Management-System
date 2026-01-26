import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import useUserExpenseStore from '../../../store/userExpenseStore';
import Card3D from '../../../components/ui/Card3D';
import PageTransition from '../../../components/layout/PageTransition';

const UserReports = () => {
    const { fetchMyStats, stats, expenses, fetchMyExpenses } = useUserExpenseStore();

    useEffect(() => {
        fetchMyStats();
        fetchMyExpenses(1, 'all'); // Ensure we have expenses for charts
    }, []);

    // Process data for charts
    // 1. Monthly Spend (Mock or derive from expenses if date available, simplified for now)
    const monthlyData = [
        { name: 'Jan', amount: 0 },
        { name: 'Feb', amount: 0 },
        { name: 'Mar', amount: 0 },
        { name: 'Apr', amount: 4000 },
        { name: 'May', amount: 2500 },
        { name: 'Jun', amount: expenses.reduce((acc, curr) => acc + curr.amount, 0) } // Rough sum
    ];

    // 2. Status Distribution
    const statusData = [
        { name: 'Approved', value: stats?.approvedCount || 0, color: '#10B981' },
        { name: 'Pending', value: stats?.pendingCount || 0, color: '#F59E0B' },
        { name: 'Rejected', value: stats?.rejectedCount || 0, color: '#EF4444' }
    ];

    return (
        <PageTransition>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Reports</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Visual insights into your spending habits
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Spend Bar Chart */}
                    <Card3D className="p-6 bg-white dark:bg-gray-800" delay={0.1}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Monthly Spending</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card3D>

                    {/* Status Distribution Pie Chart */}
                    <Card3D className="p-6 bg-white dark:bg-gray-800" delay={0.2}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Approval Status</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card3D>
                </div>
            </div>
        </PageTransition>
    );
};

export default UserReports;
