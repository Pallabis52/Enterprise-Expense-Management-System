import React, { useEffect } from 'react';
import usePolicyStore from '../../../store/policyStore';
import Badge from '../../../components/ui/Badge';
import { formatCurrency } from '../../../utils/helpers';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const PolicyView = () => {
    const { policies, isLoading, fetchPolicies } = usePolicyStore();

    useEffect(() => {
        fetchPolicies(false); // isAdmin = false, fetch active only
    }, []);

    if (isLoading) return <div className="p-8 text-center">Loading policies...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Expense Policies</h1>
                <p className="text-gray-500 dark:text-gray-400">Rules applied to your team's expenses.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        No active policies found.
                    </div>
                ) : (
                    policies.map(policy => (
                        <div key={policy.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                                    <ShieldCheckIcon className="w-6 h-6" />
                                </div>
                                <Badge variant="success">Active</Badge>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{policy.name}</h3>
                                {policy.description && <p className="text-sm text-gray-500 mt-1">{policy.description}</p>}
                            </div>

                            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                {policy.maxAmount && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Max Per Expense</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-200">{formatCurrency(policy.maxAmount)}</span>
                                    </div>
                                )}
                                {policy.monthlyLimit && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Monthly Limit</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-200">{formatCurrency(policy.monthlyLimit)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Receipt Required</span>
                                    <span className={`font-medium ${policy.requiresReceipt ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {policy.requiresReceipt ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>

                            {policy.allowedCategories && policy.allowedCategories.length > 0 && (
                                <div className="pt-2">
                                    <span className="text-xs text-gray-400 uppercase font-semibold">Allowed Categories</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {policy.allowedCategories.map(cat => (
                                            <span key={cat} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PolicyView;
