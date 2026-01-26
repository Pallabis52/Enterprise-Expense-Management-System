import React, { useState } from 'react';
import Drawer from '../../../components/ui/Drawer';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/helpers';
import useAdminExpenseStore from '../../../store/adminExpenseStore';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const ExpenseDetailsDrawer = ({ isOpen, onClose }) => {
    const { currentExpense: expense, approveExpense, rejectExpense } = useAdminExpenseStore();
    const [rejectReason, setRejectReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    if (!expense) return null;

    const handleApprove = async () => {
        await approveExpense(expense.id);
        onClose();
    };

    const handleReject = async () => {
        if (!isRejecting) {
            setIsRejecting(true);
            return;
        }
        if (!rejectReason.trim()) return; // Require reason
        await rejectExpense(expense.id, rejectReason);
        setIsRejecting(false);
        setRejectReason('');
        onClose();
    };

    const currentStatus = expense.status || 'PENDING';
    const statusVariant =
        currentStatus === 'APPROVED' ? 'success' :
            currentStatus === 'REJECTED' ? 'error' : 'warning';

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Expense Details"
            footer={
                currentStatus === 'PENDING' && (
                    <>
                        {isRejecting ? (
                            <div className="w-full flex gap-2">
                                <Button variant="ghost" onClick={() => setIsRejecting(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleReject} className="flex-1">
                                    Confirm Reject
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button variant="danger" onClick={() => setIsRejecting(true)} className="flex-1">
                                    <XCircleIcon className="w-5 h-5 mr-2" />
                                    Reject
                                </Button>
                                <Button variant="action" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleApprove}>
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                    Approve
                                </Button>
                            </>
                        )}
                    </>
                )
            }
        >
            <div className="space-y-6">

                {/* Header Info */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{expense.title}</h3>
                        <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {formatCurrency(expense.amount)}
                        </p>
                        <Badge variant={statusVariant} className="mt-1">
                            {currentStatus}
                        </Badge>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Submitted By</h4>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                            {expense.userName?.[0] || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.userName || 'Unknown User'}</p>
                            <p className="text-xs text-gray-500">{expense.userEmail || 'No email'}</p>
                        </div>
                    </div>
                </div>

                {/* Details List */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</label>
                        <p className="text-gray-900 dark:text-white font-medium">{expense.date || new Date().toLocaleDateString()}</p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                            {expense.description || "No description provided."}
                        </p>
                    </div>

                    {expense.receiptUrl && (
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Receipt</label>
                            <div className="mt-2">
                                <img
                                    src={expense.receiptUrl}
                                    alt="Receipt"
                                    className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                />
                                <a
                                    href={expense.receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
                                >
                                    View Full Size
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Rejection Input */}
                {isRejecting && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                            Reason for Rejection *
                        </label>
                        <textarea
                            rows={3}
                            className="w-full rounded-lg border-red-300 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-red-900"
                            placeholder="Provide a reason..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                )}

            </div>
        </Drawer>
    );
};

export default ExpenseDetailsDrawer;
