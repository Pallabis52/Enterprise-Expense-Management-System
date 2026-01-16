import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import PageTransition from '../../components/layout/PageTransition';
import Card3D from '../../components/ui/Card3D';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '../../utils/helpers';

const data = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 2000 },
    { name: 'Apr', amount: 2780 },
    { name: 'May', amount: 1890 },
    { name: 'Jun', amount: 2390 },
];

const pieData = [
    { name: 'Food', value: 400 },
    { name: 'Travel', value: 300 },
    { name: 'Utilities', value: 300 },
    { name: 'Entertainment', value: 200 },
];

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444']; // Violet, Emerald, Amber, Red

const KPICard = ({ title, amount, trend, trendValue, color }) => (
    <Card3D className="relative overflow-hidden">
        <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{amount}</h3>
            <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
                <span>{trendValue}</span>
                <span className="text-gray-400 ml-1">vs last month</span>
            </div>
        </div>
        {/* Decorative blur */}
        <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20 blur-2xl ${color}`} />
    </Card3D>
);

const Dashboard = () => {
    return (
        <PageTransition>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Overview of your financial checkup</p>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KPICard
                    title="Total Expenses"
                    amount={formatCurrency(12450)}
                    trend="up"
                    trendValue="12%"
                    color="bg-red-500"
                />
                <KPICard
                    title="Total Income"
                    amount={formatCurrency(45000)}
                    trend="up"
                    trendValue="8%"
                    color="bg-emerald-500"
                />
                <KPICard
                    title="Balance"
                    amount={formatCurrency(32550)}
                    trend="down"
                    trendValue="2%"
                    color="bg-primary-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card3D>
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Monthly Expenses</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
                                />
                                <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card3D>

                <Card3D>
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Expense Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center flex-wrap gap-4 mt-4">
                            {pieData.map((entry, index) => (
                                <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </Card3D>
            </div>
        </PageTransition>
    );
};

export default Dashboard;
