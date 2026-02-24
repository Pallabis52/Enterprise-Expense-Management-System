import React, { useEffect, useState } from 'react';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import userService from '../../../services/userService';
import useUserExpenseStore from '../../../store/userExpenseStore';
import Button from '../../../components/ui/Button';
import SearchVoiceInput from '../../../components/ui/SearchVoiceInput';
import Card3D from '../../../components/ui/Card3D';
import Badge from '../../../components/ui/Badge';
import PageTransition from '../../../components/layout/PageTransition';
import Swal from 'sweetalert2';
import ExpenseModal from '../../../components/expenses/ExpenseModal';
import VoiceButton from '../../../components/ui/VoiceButton';

const UserExpenseList = () => {
    const { expenses, fetchMyExpenses, isLoading, deleteExpense, addExpense, updateExpense } = useUserExpenseStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [voicePrefill, setVoicePrefill] = useState(null);

    // Handle voice command results
    const handleVoiceResult = (response) => {
        if (response.intent === 'ADD_EXPENSE' && response.data?.action === 'PREFILL_FORM') {
            setVoicePrefill(response.data);
            setModalData(null);
            setIsModalOpen(true);
        } else if (response.intent === 'SEARCH_EXPENSES' && Array.isArray(response.data)) {
            // Voice search — the VoiceResultPanel shows results inline
        }
    };

    useEffect(() => {
        fetchMyExpenses(1, statusFilter);
    }, [statusFilter]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            const success = await deleteExpense(id);
            if (success) {
                Swal.fire('Deleted!', 'Your expense has been deleted.', 'success');
            }
        }
    };

    const handleOpenModal = (expense = null) => {
        setModalData(expense);
        setIsModalOpen(true);
    };

    const handleSaveExpense = async (data, receiptFile) => {
        setIsSubmitting(true);
        try {
            if (modalData) {
                // Update
                await updateExpense(modalData.id, data, receiptFile);
                Swal.fire('Updated!', 'Expense updated successfully.', 'success');
            } else {
                // Add
                await addExpense(data, receiptFile);
                Swal.fire('Added!', 'Expense added successfully.', 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            Swal.fire('Error', error.message || 'Failed to save expense', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewReceipt = async (id) => {
        try {
            const url = await userService.viewReceipt(id);
            window.open(url, '_blank');
        } catch (error) {
            Swal.fire('Error', 'Failed to load receipt', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'error';
            default: return 'default';
        }
    };

    const filteredExpenses = expenses.filter(ex =>
        ex.title.toLowerCase().includes(search.toLowerCase()) ||
        ex.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Expenses</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track your expense requests</p>
                    </div>
                    <Button icon={PlusIcon} onClick={() => handleOpenModal(null)}>
                        Add Expense
                    </Button>
                </div>

                {/* Voice Search */}
                <VoiceButton role="USER" onResult={handleVoiceResult} />

                {/* Filters */}
                <Card3D className="p-4 bg-white dark:bg-gray-800">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <SearchVoiceInput
                                value={search}
                                onChange={setSearch}
                                placeholder="Search by title or category…"
                            />
                        </div>
                        <select
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </Card3D>

                {/* List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8">Loading...</td>
                                    </tr>
                                ) : filteredExpenses.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8">No expenses found</td>
                                    </tr>
                                ) : (
                                    filteredExpenses.map((expense) => (
                                        <tr key={expense.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4">{expense.date}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                {expense.title}
                                            </td>
                                            <td className="px-6 py-4">{expense.category}</td>
                                            <td className="px-6 py-4">₹{expense.amount}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getStatusColor(expense.status)}>
                                                    {expense.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                {expense.receiptUrl && (
                                                    <button
                                                        onClick={() => handleViewReceipt(expense.id)}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                        title="View Receipt"
                                                    >
                                                        <EyeIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleOpenModal(expense)}
                                                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expense Modal */}
                <ExpenseModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setVoicePrefill(null); }}
                    onSubmit={handleSaveExpense}
                    initialData={voicePrefill || modalData}
                    isLoading={isSubmitting}
                />
            </div>
        </PageTransition>
    );
};

export default UserExpenseList;
