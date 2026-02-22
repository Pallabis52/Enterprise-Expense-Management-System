import React, { useEffect, useState } from 'react';
import useAdminExpenseStore from '../../../store/adminExpenseStore';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import ExpenseFilters from './ExpenseFilters';
import ExpenseDetailsDrawer from './ExpenseDetailsDrawer';
import { formatCurrency } from '../../../utils/helpers';
import { EyeIcon } from '@heroicons/react/24/outline';

const ExpenseList = () => {
    const {
        expenses = [], // Default to empty array
        isLoading,
        filters,
        setFilters,
        fetchExpenses,
        setCurrentExpense,
        rowsPerPage // Assuming store handles or we handle locally
    } = useAdminExpenseStore();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, [filters]); // Re-fetch when filters change

    const handleViewDetails = (expense) => {
        setCurrentExpense(expense);
        setIsDrawerOpen(true);
    };

    const columns = [
        {
            key: 'id',
            title: 'ID',
            className: 'w-20',
            render: (row) => <span className="text-gray-500">#{row.id.toString().slice(-4)}</span>
        },
        {
            key: 'user',
            title: 'User',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300">
                        {row.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{row.user?.name || 'Unknown User'}</p>
                        <p className="text-xs text-gray-500">{row.user?.email || 'No Email'}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'team',
            title: 'Team',
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">{row.user?.team?.name || '-'}</p>
                    <p className="text-xs text-gray-500">{row.user?.team?.manager?.name ? `Mgr: ${row.user.team.manager.name}` : 'No Manager'}</p>
                </div>
            )
        },
        { key: 'title', title: 'Expense', className: 'font-medium' },
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
            title: 'Actions',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleViewDetails(row); }}
                    >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage employee expenses.</p>
                </div>
                {/* Could add Export buttons here */}
            </div>

            <ExpenseFilters filters={filters} onChange={setFilters} />

            <Table
                columns={columns}
                data={expenses}
                isLoading={isLoading}
                onRowClick={handleViewDetails}
                emptyMessage="No expenses found matching current filters."
            />

            <ExpenseDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

export default ExpenseList;
