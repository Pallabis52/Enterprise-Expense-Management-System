import React from 'react';
import Input from '../../components/ui/Input';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const ExpenseFilters = ({ filters, onChange }) => {
    const handleChange = (key, value) => {
        onChange({ [key]: value });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">

            {/* Search */}
            <div className="flex-1">
                <Input
                    icon={MagnifyingGlassIcon}
                    placeholder="Search by user or title..."
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
                <select
                    value={filters.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                    <option value="all">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {/* Date Range (Simplified for now) */}
            <div className="flex items-center gap-2">
                <input
                    type="date"
                    className="rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-primary-500"
                    value={filters.startDate || ''}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                />
                <span className="text-gray-400">-</span>
                <input
                    type="date"
                    className="rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-primary-500"
                    value={filters.endDate || ''}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                />
            </div>
        </div>
    );
};

export default ExpenseFilters;
