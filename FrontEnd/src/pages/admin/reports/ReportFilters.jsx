import React from 'react';

const ReportFilters = ({ filters, onChange }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center">

            {/* Year Filter */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Year
                </label>
                <select
                    value={filters.year}
                    onChange={(e) => onChange({ ...filters, year: parseInt(e.target.value) })}
                    className="rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-primary-500"
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* Month Filter */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Month
                </label>
                <select
                    value={filters.month}
                    onChange={(e) => onChange({ ...filters, month: e.target.value })}
                    className="rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-primary-500 min-w-[120px]"
                >
                    <option value="all">All Months</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>
            </div>

            {/* Category Filter (Optional placeholder) */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Category
                </label>
                <select
                    className="rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-primary-500 min-w-[150px]"
                    disabled // Future implementation
                >
                    <option>All Categories</option>
                </select>
            </div>

        </div>
    );
};

export default ReportFilters;
