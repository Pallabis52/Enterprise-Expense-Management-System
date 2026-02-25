import React, { useEffect, useState, useMemo } from 'react';
import Table from '../../../components/ui/Table';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon,
    XMarkIcon,
    FunnelIcon,
    Squares2X2Icon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import userService from '../../../services/userService';
import useUserExpenseStore from '../../../store/userExpenseStore';
import Button from '../../../components/ui/Button';
import UnifiedSearchBar from '../../../components/ui/UnifiedSearchBar';
import Card3D from '../../../components/ui/Card3D';
import Badge from '../../../components/ui/Badge';
import PageTransition from '../../../components/layout/PageTransition';
import { premiumSuccess, premiumError, premiumConfirm } from '../../../utils/premiumAlerts';
import ExpenseModal from '../../../components/expenses/ExpenseModal';

const UserExpenseList = () => {
    const STATUS_OPTIONS = useMemo(() => [
        { label: 'All Status', value: 'all', icon: <Squares2X2Icon />, iconColor: 'text-indigo-500' },
        { label: 'Drafts', value: 'DRAFT', icon: <PencilSquareIcon />, iconColor: 'text-gray-500' },
        { label: 'Pending', value: 'PENDING', icon: <ClockIcon />, iconColor: 'text-amber-500' },
        { label: 'Approved', value: 'APPROVED', icon: <CheckCircleIcon />, iconColor: 'text-emerald-500' },
        { label: 'Rejected', value: 'REJECTED', icon: <XCircleIcon />, iconColor: 'text-rose-500' }
    ], []);

    const {
        expenses,
        fetchMyExpenses,
        isLoading,
        deleteExpense,
        addExpense,
        updateExpense,
        saveDraft,
        submitDraft,
        setExpenses,
        isSearchMode,
    } = useUserExpenseStore();
    const [statusFilter, setStatusFilter] = useState('all');
    const [aiFilters, setAiFilters] = useState({});

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
        const result = await premiumConfirm('Are you sure?', "You won't be able to revert this!", 'Yes, delete it!');

        if (result.isConfirmed) {
            const success = await deleteExpense(id);
            if (success) {
                premiumSuccess('Deleted!', 'Your expense has been deleted.');
            }
        }
    };

    const handleOpenModal = (expense = null) => {
        setModalData(expense);
        setIsModalOpen(true);
    };

    const handleSaveExpense = async (data, receiptFile, isDraft = false) => {
        setIsSubmitting(true);
        try {
            if (isDraft) {
                await saveDraft(data, receiptFile);
                premiumSuccess('Draft Saved!', 'You can find it in your drafts.');
            } else if (modalData) {
                // Update
                await updateExpense(modalData.id, data, receiptFile);
                premiumSuccess('Updated!', 'Expense updated successfully.');
            } else {
                // Add
                await addExpense(data, receiptFile);
                premiumSuccess('Added!', 'Expense added successfully.');
            }
            setIsModalOpen(false);
        } catch (error) {
            premiumError('Error', error.message || 'Failed to save expense');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitDraftAction = async (id) => {
        try {
            await submitDraft(id);
            premiumSuccess('Submitted!', 'Expense submitted for approval.');
        } catch (error) {
            premiumError('Error', 'Failed to submit draft');
        }
    };

    const handleViewReceipt = async (id) => {
        try {
            const url = await userService.viewReceipt(id);
            window.open(url, '_blank');
        } catch (error) {
            premiumError('Error', 'Failed to load receipt');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'error';
            case 'DRAFT': return 'default';
            default: return 'default';
        }
    };

    // List display helper
    const displayExpenses = expenses;

    const columns = [
        { title: 'Date', key: 'date', sortable: true },
        {
            title: 'Title',
            key: 'title',
            render: row => <span className="font-semibold text-gray-900 dark:text-white">{row.title}</span>
        },
        { title: 'Category', key: 'category' },
        {
            title: 'Amount',
            key: 'amount',
            sortable: true,
            render: row => <span className="font-bold text-gray-900 dark:text-white">₹{row.amount}</span>
        },
        {
            title: 'Status',
            key: 'status',
            render: row => (
                <Badge variant={getStatusColor(row.status)}>
                    {row.status}
                </Badge>
            )
        },
        {
            title: '',
            key: 'actions',
            className: 'text-right',
            render: row => (
                <div className="flex items-center justify-end gap-2 px-2">
                    {row.status === 'DRAFT' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleSubmitDraftAction(row.id); }}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                            title="Submit Draft"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                        </button>
                    )}
                    {row.receiptUrl && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleViewReceipt(row.id); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="View Receipt"
                        >
                            <EyeIcon className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(row); }}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

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

                {/* Cohesive Header Bar */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row items-center gap-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl p-2 rounded-[24px] border border-white dark:border-gray-700 shadow-2xl shadow-indigo-500/10 overflow-visible relative z-[10]">
                        {/* Status Filter Section */}
                        <div className="flex items-center gap-4 pl-4 py-2">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mb-1">Filter</span>
                                <div className="min-w-[150px]">
                                    <CustomDropdown
                                        options={STATUS_OPTIONS}
                                        value={statusFilter}
                                        onChange={setStatusFilter}
                                    />
                                </div>
                            </div>

                            <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-700 to-transparent mx-2" />

                            <div className="flex flex-col min-w-[120px]">
                                <span className="text-[9px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-[0.2em] mb-1">Count</span>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur opacity-25 animate-pulse"></div>
                                        <span className="relative px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-black">
                                            {expenses.length}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">
                                        Total<br />Records
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Spacer for Desktop */}
                        <div className="flex-1" />

                        {/* Search Section */}
                        <div className="w-full lg:w-[500px] p-1">
                            <div className="flex flex-col mb-1 px-1">
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-[9px] font-black text-purple-500 dark:text-purple-400 uppercase tracking-[0.2em]">Search</span>
                                    {isSearchMode && (
                                        <button
                                            onClick={() => fetchMyExpenses(1, statusFilter)}
                                            className="text-[9px] font-black text-red-500 hover:text-red-600 uppercase tracking-[0.1em] flex items-center gap-1 transition-all"
                                        >
                                            <XMarkIcon className="w-3 h-3" /> Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                            <UnifiedSearchBar
                                onResults={(results) => setExpenses(results, true)}
                                placeholder="Search by title, category, or amount..."
                            />
                        </div>
                    </div>
                </div>

                {/* List */}
                <Table
                    columns={columns}
                    data={displayExpenses}
                    isLoading={isLoading}
                    emptyMessage="No expenses found"
                    onRowClick={(row) => handleOpenModal(row)}
                />

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
