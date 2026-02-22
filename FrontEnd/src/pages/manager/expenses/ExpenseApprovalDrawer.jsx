import React, { useState } from 'react';
import useManagerExpenseStore from '../../../store/managerExpenseStore';
import Drawer from '../../../components/ui/Drawer';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/helpers';
import {
    CheckCircleIcon,
    XCircleIcon,
    ArrowUpTrayIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const MANAGER_APPROVE_LIMIT = 10_000;   // ≤ this: manager can approve
const ADMIN_ONLY_LIMIT = 50_000;   // > this: admin only, manager cannot forward

const ExpenseApprovalDrawer = ({ isOpen, onClose }) => {
    const { currentExpense: expense, approveExpense, rejectExpense, forwardToAdmin } =
        useManagerExpenseStore();

    const [comment, setComment] = useState('');
    const [mode, setMode] = useState(null); // null | 'reject' | 'forward'

    if (!expense) return null;

    const amount = expense.amount || 0;
    const isWithinManagerLimit = amount <= MANAGER_APPROVE_LIMIT;       // ≤ 10k: manager acts
    const isForwardable = amount > MANAGER_APPROVE_LIMIT && amount <= ADMIN_ONLY_LIMIT; // 10k–50k
    const isAdminOnly = amount > ADMIN_ONLY_LIMIT;              // > 50k: admin only

    const currentStatus = expense.status || 'PENDING';
    const isPending = currentStatus === 'PENDING';
    const statusVariant =
        currentStatus === 'APPROVED' ? 'success' :
            currentStatus === 'REJECTED' ? 'error' :
                currentStatus === 'FORWARDED_TO_ADMIN' ? 'warning' : 'warning';

    const resetAndClose = () => {
        setMode(null);
        setComment('');
        onClose();
    };

    const handleApprove = async () => {
        await approveExpense(expense.id, comment);
        resetAndClose();
    };

    const handleReject = async () => {
        if (!comment.trim()) return;
        await rejectExpense(expense.id, comment);
        resetAndClose();
    };

    const handleForward = async () => {
        if (!comment.trim()) return;
        await forwardToAdmin(expense.id, comment);
        resetAndClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={resetAndClose}
            title="Review Expense"
            footer={
                isPending && (
                    <div className="w-full flex flex-col gap-3">

                        {/* ── Amount rule banner ── */}
                        {isAdminOnly && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                <p className="font-semibold flex items-center gap-2">
                                    <XCircleIcon className="w-4 h-4" />
                                    Admin Approval Only
                                </p>
                                <p className="mt-1 opacity-90">
                                    Expenses above ₹50,000 require direct admin approval. You can forward this claim.
                                </p>
                            </div>
                        )}
                        {isForwardable && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                                <p className="font-semibold flex items-center gap-2">
                                    <ArrowUpTrayIcon className="w-4 h-4" />
                                    Admin Approval Required
                                </p>
                                <p className="mt-1 opacity-90">
                                    Expenses between ₹10,001–₹50,000 must be forwarded to admin.
                                </p>
                            </div>
                        )}

                        {/* ── Duplicate warning ── */}
                        {expense.isDuplicate && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
                                <span><strong>Possible Duplicate</strong> – Similar expense detected. Review carefully before approving.</span>
                            </div>
                        )}

                        {/* ── Comment textarea ── */}
                        {mode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {mode === 'reject' ? 'Rejection Reason *' :
                                        mode === 'forward' ? 'Forwarding Note *' : 'Approval Comment (optional)'}
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder={
                                        mode === 'reject' ? 'Please provide a reason for rejection...' :
                                            mode === 'forward' ? 'Explain why this needs admin approval...' :
                                                'Optional approval note...'
                                    }
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                            </div>
                        )}

                        {/* ── Action buttons ── */}
                        <div className="flex gap-2 w-full flex-wrap">

                            {/* Cancel mode button */}
                            {mode && (
                                <Button variant="ghost" onClick={() => { setMode(null); setComment(''); }} className="flex-1">
                                    Cancel
                                </Button>
                            )}

                            {/* Reject (manager limit only) */}
                            {!isAdminOnly && (
                                mode === 'reject' ? (
                                    <Button
                                        variant="danger"
                                        className="flex-1"
                                        disabled={!comment.trim()}
                                        onClick={handleReject}
                                    >
                                        <XCircleIcon className="w-4 h-4 mr-1" /> Confirm Reject
                                    </Button>
                                ) : mode === null && (
                                    <Button
                                        variant="danger"
                                        className="flex-1"
                                        disabled={!isWithinManagerLimit}
                                        title={!isWithinManagerLimit ? 'Use Forward to Admin for this amount' : 'Reject this expense'}
                                        onClick={() => setMode('reject')}
                                    >
                                        <XCircleIcon className="w-4 h-4 mr-1" /> Reject
                                    </Button>
                                )
                            )}

                            {/* Approve (manager limit only) */}
                            {!isAdminOnly && !isForwardable && mode === null && (
                                <Button
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                    disabled={!isWithinManagerLimit}
                                    title={!isWithinManagerLimit ? 'Only Admin can approve this amount' : 'Approve this expense'}
                                    onClick={handleApprove}
                                >
                                    <CheckCircleIcon className="w-4 h-4 mr-1" /> Approve
                                </Button>
                            )}

                            {/* Forward to Admin */}
                            {(isForwardable || isAdminOnly) && (
                                mode === 'forward' ? (
                                    <Button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={!comment.trim()}
                                        onClick={handleForward}
                                    >
                                        <ArrowUpTrayIcon className="w-4 h-4 mr-1" /> Confirm Forward
                                    </Button>
                                ) : mode === null && (
                                    <Button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => setMode('forward')}
                                    >
                                        <ArrowUpTrayIcon className="w-4 h-4 mr-1" /> Forward to Admin
                                    </Button>
                                )
                            )}
                        </div>
                    </div>
                )
            }
        >
            {/* ── Expense detail body ── */}
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{expense.title}</h3>
                        <p className="text-sm text-gray-500">{expense.category}</p>
                        {expense.isDuplicate && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                                <ExclamationTriangleIcon className="w-3 h-3" /> Possible Duplicate
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(expense.amount)}
                        </p>
                        <Badge variant={statusVariant} className="mt-1">{currentStatus}</Badge>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Employee</h4>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
                            {expense.user?.name?.[0] || 'E'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.user?.name || 'Employee'}</p>
                            <p className="text-xs text-gray-500">{expense.user?.email}</p>
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
                        <p className="text-gray-700 dark:text-gray-300 mt-1">{expense.description || 'No description provided.'}</p>
                    </div>

                    {/* Approval comment from previous action */}
                    {expense.approvalComment && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <label className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Approval Note</label>
                            <p className="text-blue-900 dark:text-blue-200 mt-1 text-sm">{expense.approvalComment}</p>
                        </div>
                    )}

                    {expense.receiptUrl && (
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Receipt</label>
                            <img src={expense.receiptUrl} alt="Receipt"
                                className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700 mt-2" />
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    );
};

export default ExpenseApprovalDrawer;
