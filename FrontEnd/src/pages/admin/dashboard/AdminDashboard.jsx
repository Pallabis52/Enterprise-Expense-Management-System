import React, { useEffect } from 'react';
import useReportStore from '../../../store/reportStore';
import {
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ChartPieIcon,
    UsersIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../../utils/helpers';
import Skeleton from '../../../components/ui/Skeleton';
import Card3D from '../../../components/ui/Card3D';
import PageTransition from '../../../components/layout/PageTransition';

const AdminDashboard = () => {
    const { fetchDashboardData, stats, isLoading } = useReportStore();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const KPICard = ({ title, value, icon: Icon, color, delay }) => (
        <Card3D className="p-6 bg-white dark:bg-gray-800" delay={delay}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {isLoading ? <Skeleton className="h-8 w-32" /> : value}
                    </h3>
                </div>
                <div className={`p-3 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {/* Simple sparkline or trend placeholder */}
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                <span>Updated just now</span>
            </div>
        </Card3D>
    );

    return (
        <PageTransition>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Overview of system metrics and expense activities
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    <KPICard
                        title="Total Expenses"
                        value={formatCurrency(stats?.totalSpent || 0)}
                        icon={BanknotesIcon}
                        color="blue"
                        delay={0.1}
                    />
                    <KPICard
                        title="Avg. Monthly Spend"
                        value={formatCurrency(stats?.avgMonthlySpend || 0)}
                        icon={ArrowTrendingUpIcon}
                        color="emerald"
                        delay={0.2}
                    />
                    <KPICard
                        title="Active Categories"
                        value={stats?.categoryCount || "0"}
                        icon={ChartPieIcon}
                        color="amber"
                        delay={0.3}
                    />
                    <KPICard
                        title="Total Users"
                        value={stats?.userCount || "0"}
                        icon={UsersIcon}
                        color="purple"
                        delay={0.4}
                    />
                    <KPICard
                        title="Total Teams"
                        value={stats?.teamCount || "0"}
                        icon={UsersIcon}
                        color="indigo"
                        delay={0.5}
                    />
                </div>

                {/* Quick Actions or Recent Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <a href="/admin/expenses" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                            Manage Expenses
                        </a>
                        <a href="/admin/reports" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors">
                            View Detailed Reports
                        </a>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default AdminDashboard;
