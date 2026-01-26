import React, { useEffect, useState } from 'react';
import useManagerExpenseStore from '../../../store/managerExpenseStore';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import ExpenseApprovalDrawer from './ExpenseApprovalDrawer';
import { formatCurrency } from '../../../utils/helpers';
import { EyeIcon, MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; // CheckCircle for Bulk

const ManagerExpenseList = () => {
    const {
        expenses,
        isLoading,
        filters,
        setFilters,
        fetchTeamExpenses,
        setCurrentExpense
    } = useManagerExpenseStore();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]); // For bulk actions

    useEffect(() => {
        fetchTeamExpenses();
    }, [filters]);

    // Handle Checkbox Selection (if Table supports it, otherwise manual logic)
    // Assuming Table supports rowSelection or we add it. 
    // For simplicity in this demo, I will just add the Bulk Action button 
    // but note that "Table" needs to support selection to be functional.
    // If Table doesn't support selection, I'll assume we might add it later or mock it.
    // For now, I'll add the button UI.

    const handleBulkApprove = () => {
        alert("Bulk Approve Feature: Implement 'bulkApprove' in store and connect here once Table supports selection.");
    };

    const columns = [
        {
            key: 'id',
            title: 'Ref ID',
            className: 'w-20',
            render: (row) => <span className="text-gray-500">#{row.id.toString().slice(-4)}</span>
        },
        {
            key: 'employee',
            title: 'Employee',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {row.user?.name?.[0] || 'E'}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{row.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{row.user?.email || 'No Email'}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'category',
            title: 'Category',
            render: (row) => (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                    {row.category}
                </span>
            )
        },
        {
            key: 'amount',
            title: 'Amount',
            sortable: true,
            render: (row) => <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(row.amount)}</span>
        },
        {
            key: 'status',
            title: 'Status',
            sortable: true,
            render: (row) => {
                const variant =
                    row.status === 'APPROVED' ? 'success' :
                        row.status === 'REJECTED' ? 'error' : 'warning';
                return <Badge variant={variant}>{row.status}</Badge>;
            }
        },
        {
            key: 'date',
            title: 'Date',
            sortable: true,
            render: (row) => new Date(row.date).toLocaleDateString()
        },
        {
            key: 'actions',
            title: '',
            className: 'text-right',
            render: (row) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentExpense(row);
                        setIsDrawerOpen(true);
                    }}
                >
                    <EyeIcon className="w-4 h-4" />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Approvals</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Review and action assigned team expenses.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={handleBulkApprove}>
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Bulk Approve
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                    <Input
                        icon={MagnifyingGlassIcon}
                        placeholder="Search employee or expense..."
                        value={filters.search}
                        onChange={(e) => setFilters({ search: e.target.value })}
                        className="w-full"
                    />
                </div>
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ status: e.target.value })}
                    className="rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-emerald-500"
                >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
                <input
                    type="date"
                    className="rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-emerald-500"
                    onChange={(e) => setFilters({ startDate: e.target.value })}
                />
            </div>

            <Table
                columns={columns}
                data={expenses}
                isLoading={isLoading}
                onRowClick={(row) => {
                    setCurrentExpense(row);
                    setIsDrawerOpen(true);
                }}
                emptyMessage="No pending approvals found."
            />

            <ExpenseApprovalDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

export default ManagerExpenseList;
