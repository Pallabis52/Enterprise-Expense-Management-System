import React, { useEffect, useState } from 'react';
import useTeamStore from '../../../store/teamStore';
import {
    ClipboardDocumentCheckIcon,
    CheckCircleIcon,
    XCircleIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import Skeleton from '../../../components/ui/Skeleton';
import { formatCurrency } from '../../../utils/helpers';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import PolicyModal from '../../admin/policies/PolicyModal';
import InviteModal from '../../../components/manager/InviteModal';
import usePolicyStore from '../../../store/policyStore';

const ManagerDashboard = () => {
    const { stats, fetchTeamStats, isLoading } = useTeamStore();
    const navigate = useNavigate();
    const { createPolicy } = usePolicyStore();

    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const handleCreatePolicy = async (policyData) => {
        const success = await createPolicy(policyData, true); // true for isManager
        if (success) {
            setIsPolicyModalOpen(false);
        }
    };

    useEffect(() => {
        fetchTeamStats();
    }, []);

    // Mock data for chart if stats is empty
    const chartData = [
        { name: 'Week 1', amount: 4000 },
        { name: 'Week 2', amount: 3000 },
        { name: 'Week 3', amount: 2000 },
        { name: 'Week 4', amount: 2780 },
    ];

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {isLoading ? <Skeleton className="h-8 w-16" /> : value}
                </h3>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Dashboard</h1>
                <span className="text-sm text-gray-500">Welcome back, Team Lead</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Pending Approvals"
                    value={stats?.pendingCount || 12}
                    icon={ClipboardDocumentCheckIcon}
                    color="amber"
                    subtext="Action required"
                />
                <StatCard
                    title="Approved (Month)"
                    value={stats?.approvedCount || 45}
                    icon={CheckCircleIcon}
                    color="emerald"
                />
                <StatCard
                    title="Rejected (Month)"
                    value={stats?.rejectedCount || 3}
                    icon={XCircleIcon}
                    color="rose"
                />
                <StatCard
                    title="Team Spending"
                    value={formatCurrency(stats?.totalSpent || 12500)}
                    icon={CurrencyDollarIcon}
                    color="blue"
                    subtext="This month"
                />
            </div>

            {/* Recent Activity & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Team Spending Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                                <Tooltip />
                                <Area type="monotone" dataKey="amount" stroke="#3B82F6" fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => setIsPolicyModalOpen(true)}
                            className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group"
                        >
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Expense Policy</span>
                            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <button
                            onClick={() => navigate('/manager/reports')}
                            className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group"
                        >
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Performance</span>
                            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group"
                        >
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Invite Member</span>
                            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            </div>

            <PolicyModal
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                onSubmit={handleCreatePolicy}
                isLoading={false}
            />

            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
};

export default ManagerDashboard;
