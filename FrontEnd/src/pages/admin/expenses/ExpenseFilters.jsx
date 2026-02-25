import React, { useMemo } from 'react';
import UnifiedSearchBar from '../../../components/ui/UnifiedSearchBar';
import {
    FunnelIcon,
    Squares2X2Icon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import useAdminExpenseStore from '../../../store/adminExpenseStore';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import DatePicker from '../../../components/ui/DatePicker';

const ExpenseFilters = ({ filters, onChange }) => {
    const STATUS_OPTIONS = useMemo(() => [
        { label: 'All Statuses', value: 'all', icon: <Squares2X2Icon />, iconColor: 'text-gray-500' },
        { label: 'Pending', value: 'PENDING', icon: <ClockIcon />, iconColor: 'text-amber-500' },
        { label: 'Approved', value: 'APPROVED', icon: <CheckCircleIcon />, iconColor: 'text-emerald-500' },
        { label: 'Rejected', value: 'REJECTED', icon: <XCircleIcon />, iconColor: 'text-rose-500' }
    ], []);

    const { setExpenses } = useAdminExpenseStore();

    const handleChange = (key, value) => {
        onChange({ [key]: value });
    };

    const handleSearchResults = (results) => {
        setExpenses(results);
    };

    return (
        <div className="mb-8">
            <div className="flex flex-col xl:flex-row items-center gap-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl p-2 rounded-[24px] border border-white dark:border-gray-700 shadow-2xl shadow-primary-500/10 overflow-visible relative z-[10]">

                <div className="flex items-center gap-4 pl-4 py-2">
                    {/* Status Filter */}
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-primary-500 dark:text-primary-400 uppercase tracking-[0.2em] mb-1">Filter</span>
                        <div className="min-w-[150px]">
                            <CustomDropdown
                                options={STATUS_OPTIONS}
                                value={filters.status}
                                onChange={(val) => handleChange('status', val)}
                            />
                        </div>
                    </div>

                    <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-700 to-transparent mx-2" />

                    {/* Date Range Section */}
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-amber-500 dark:text-amber-400 uppercase tracking-[0.2em] mb-1">Date Range</span>
                        <div className="flex items-center gap-3 bg-gray-100/50 dark:bg-gray-900/50 p-1 px-1 rounded-[18px] border border-gray-200 dark:border-white/5 shadow-inner">
                            <DatePicker
                                value={filters.startDate}
                                onChange={(val) => handleChange('startDate', val)}
                                placeholder="Start Date"
                                className="min-w-[140px]"
                            />
                            <div className="flex flex-col items-center justify-center opacity-30">
                                <div className="h-2 w-[1px] bg-gray-400"></div>
                                <span className="text-[8px] font-black italic">TO</span>
                                <div className="h-2 w-[1px] bg-gray-400"></div>
                            </div>
                            <DatePicker
                                value={filters.endDate}
                                onChange={(val) => handleChange('endDate', val)}
                                placeholder="End Date"
                                className="min-w-[140px]"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1" />

                {/* Search - Right Side */}
                <div className="w-full xl:w-[500px] p-1">
                    <div className="flex flex-col mb-1 px-1">
                        <span className="text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em] xl:text-right">Search</span>
                    </div>
                    <UnifiedSearchBar
                        onResults={handleSearchResults}
                        placeholder="Search by user, expense, or date..."
                    />

                </div>
            </div>
        </div>
    );
};

export default ExpenseFilters;
