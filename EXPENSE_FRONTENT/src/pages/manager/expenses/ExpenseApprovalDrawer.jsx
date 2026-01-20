import React, { useState } from 'react';
import useManagerExpenseStore from '../../../store/managerExpenseStore';
import Drawer from '../../../components/ui/Drawer';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/helpers';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const ExpenseApprovalDrawer = ({ isOpen, onClose }) => {
    const { currentExpense: expense, approveExpense, rejectExpense } = useManagerExpenseStore();
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
        if (!rejectReason.trim()) return;
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
            title="Review Expense"
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
                                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleApprove}>
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
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{expense.title}</h3>
                        <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(expense.amount)}
                        </p>
                        <Badge variant={statusVariant} className="mt-1">
                            {currentStatus}
                        </Badge>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Employee</h4>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
                            {expense.user?.name?.[0] || 'E'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.user?.name || 'Employee Name'}</p>
                            <p className="text-xs text-gray-500">{expense.user?.email || 'employee@company.com'}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</label>
                        <p className="text-gray-900 dark:text-white font-medium">{new Date(expense.date).toLocaleDateString()}</p>
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
                            </div>
                        </div>
                    )}
                </div>

                {isRejecting && (
                    <div className="mt-4 animate-fadeIn">
                        <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                            Rejection Reason *
                        </label>
                        <textarea
                            rows={3}
                            className="w-full rounded-lg border-red-300 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-red-900"
                            placeholder="Please provide a reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </Drawer>
    );
};

export default ExpenseApprovalDrawer;
