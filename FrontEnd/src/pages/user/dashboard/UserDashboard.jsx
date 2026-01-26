import React, { useEffect } from 'react';
import {
    CurrencyDollarIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import useUserExpenseStore from '../../../store/userExpenseStore';
import Card3D from '../../../components/ui/Card3D';
import PageTransition from '../../../components/layout/PageTransition';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <Card3D className="p-6 bg-white dark:bg-gray-800" delay={delay}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </Card3D>
);

const UserDashboard = () => {
    const { stats, fetchMyStats, isLoading } = useUserExpenseStore();

    useEffect(() => {
        fetchMyStats();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Overview of your personal expenses and reimbursement status
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Spent"
                        value={formatCurrency(stats?.totalSpent)}
                        icon={CurrencyDollarIcon}
                        color="bg-primary-500"
                        delay={0.1}
                    />
                    <StatCard
                        title="Pending Approval"
                        value={stats?.pendingCount || 0}
                        icon={ClockIcon}
                        color="bg-yellow-500"
                        delay={0.2}
                    />
                    <StatCard
                        title="Approved"
                        value={stats?.approvedCount || 0}
                        icon={CheckCircleIcon}
                        color="bg-green-500"
                        delay={0.3}
                    />
                    <StatCard
                        title="Rejected"
                        value={stats?.rejectedCount || 0}
                        icon={XCircleIcon}
                        color="bg-red-500"
                        delay={0.4}
                    />
                </div>

                {/* Recent Activity Section could go here */}
                {/* For now, just a placeholder or link to expenses */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <a href="/user/expenses" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                            View All Expenses
                        </a>
                        <a href="/user/reports" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors">
                            View Reports
                        </a>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default UserDashboard;
