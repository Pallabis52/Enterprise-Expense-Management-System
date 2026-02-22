import React, { useEffect, useState } from 'react';
import useManagerExpenseStore from '../../../store/managerExpenseStore';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import ExpenseApprovalDrawer from './ExpenseApprovalDrawer';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ExclamationTriangleIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../../utils/helpers';

const STATUS_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Forwarded to Admin', value: 'FORWARDED_TO_ADMIN' },
];

const statusVariant = s =>
    s === 'APPROVED' ? 'success' :
        s === 'REJECTED' ? 'error' :
            s === 'FORWARDED_TO_ADMIN' ? 'warning' : 'warning';

const ManagerExpenseList = () => {
    const {
        expenses,
        loading,
        pagination,
        dashboard,
        fetchExpenses,
        fetchDashboard,
        setCurrentExpense,
    } = useManagerExpenseStore();

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        fetchExpenses({ status: status || undefined, page: 1 });
        fetchDashboard();
    }, [status]);

    const handleRowClick = expense => {
        setCurrentExpense(expense);
        setDrawerOpen(true);
    };

    const handlePageChange = page => fetchExpenses({ status: status || undefined, page });

    const filtered = (expenses || []).filter(e =>
        !search ||
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const budgetExceeded = dashboard?.budget?.exceeded;

    const columns = [
        {
            header: 'Employee',
            accessor: 'user',
            cell: row => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                        {row.user?.name?.[0] || 'E'}
                    </div>
                    <div className="leading-tight">
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{row.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{row.user?.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Title',
            accessor: 'title',
            cell: row => (
                <div className="flex items-center gap-2">
                    <span>{row.title}</span>
                    {row.isDuplicate && (
                        <span title="Possible duplicate" className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs font-medium">
                            <ExclamationTriangleIcon className="w-3 h-3" /> Dup
                        </span>
                    )}
                </div>
            )
        },
        { header: 'Category', accessor: 'category' },
        { header: 'Date', accessor: 'date', cell: row => new Date(row.date).toLocaleDateString() },
        {
            header: 'Amount',
            accessor: 'amount',
            cell: row => (
                <span className={row.amount > 50_000 ? 'text-red-600 font-bold' :
                    row.amount > 10_000 ? 'text-amber-600 font-semibold' :
                        'font-medium'}>
                    {formatCurrency(row.amount)}
                </span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            cell: row => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
        },
        {
            header: '',
            accessor: 'id',
            cell: row => (
                <Button size="sm" variant="ghost" onClick={() => handleRowClick(row)}>
                    Review
                </Button>
            )
        },
    ];

    return (
        <div className="space-y-4">
            {/* ── Budget exceeded banner ── */}
            {budgetExceeded && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                    <BanknotesIcon className="w-5 h-5 shrink-0" />
                    <div>
                        <p className="font-semibold">Team Monthly Budget Exceeded</p>
                        <p className="text-sm opacity-90">
                            Your team has spent {formatCurrency(dashboard?.budget?.spent)} of the{' '}
                            {formatCurrency(dashboard?.budget?.budget)} budget this month.
                            Admin approval is required for further expenses.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Filters ── */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                    <Input
                        prefix={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                        placeholder="Search expenses or employees..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FunnelIcon className="w-4 h-4 text-gray-400" />
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="w-48 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
                    >
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Stats row ── */}
            {dashboard && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Pending', value: dashboard.pendingCount, color: 'text-amber-600' },
                        { label: 'Forwarded', value: dashboard.forwardedCount, color: 'text-blue-600' },
                        { label: 'Flagged', value: dashboard.flaggedCount, color: 'text-yellow-600' },
                        { label: 'Monthly Spend', value: formatCurrency(dashboard.monthlySpend), color: 'text-emerald-600' },
                    ].map(stat => (
                        <div key={stat.label} className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Table ── */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <Table
                    columns={columns}
                    data={filtered}
                    loading={loading}
                    emptyMessage="No expenses found"
                    rowClassName={row =>
                        row.isDuplicate
                            ? 'bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400'
                            : ''
                    }
                />
                {pagination && (
                    <div className="flex justify-between items-center p-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                size="sm" variant="ghost"
                                disabled={pagination.page <= 1}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >Previous</Button>
                            <Button
                                size="sm" variant="ghost"
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >Next</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Drawer ── */}
            <ExpenseApprovalDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </div>
    );
};

export default ManagerExpenseList;
