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
            title="Strategic Expense Review"
            footer={
                currentStatus === 'PENDING' && (
                    <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/30">
                        {isRejecting ? (
                            <div className="w-full flex gap-3 animate-in slide-in-from-bottom-4">
                                <Button variant="ghost" onClick={() => setIsRejecting(false)} className="flex-1 rounded-2xl">
                                    Abort
                                </Button>
                                <Button variant="danger" onClick={handleReject} className="flex-1 rounded-2xl shadow-lg shadow-red-500/20">
                                    Confirm Rejection
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsRejecting(true)}
                                    className="flex-1 py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest transition-all"
                                >
                                    Reject Entry
                                </button>
                                <Button
                                    variant="action"
                                    className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-primary-600 hover:from-emerald-400 hover:to-primary-500 text-white shadow-xl shadow-primary-500/25 border-none transform active:scale-95 transition-all text-xs font-black tracking-widest uppercase"
                                    onClick={handleApprove}
                                >
                                    Authorize Flow
                                </Button>
                            </div>
                        )}
                    </div>
                )
            }
        >
            <div className="space-y-8 animate-in fade-in duration-500">

                {/* Value Header Card */}
                <div className="relative overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br from-gray-900 to-primary-900 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-500/20 rounded-full blur-2xl -ml-12 -mb-12"></div>

                    <div className="relative z-10 flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-1 block">
                                Transaction Value
                            </span>
                            <h3 className="text-4xl font-black">{formatCurrency(expense.amount)}</h3>
                            <div className="flex items-center gap-2 mt-4">
                                <Badge variant={statusVariant} className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-none ring-1 ring-white/20">
                                    {currentStatus}
                                </Badge>
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                    #{expense.id?.toString().padStart(5, '0')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submitter Operative Card */}
                <div className="p-6 rounded-[2rem] bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
                    <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-1">
                        Originating Operative
                    </h4>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary-500/30">
                                {expense.userName?.[0] || 'U'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-gray-800 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-lg font-black text-gray-900 dark:text-white leading-none mb-1">{expense.userName || 'Unknown User'}</p>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{expense.userEmail || 'No verified email'}</p>
                        </div>
                    </div>
                </div>

                {/* Transaction Metadata Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Timeline</label>
                        <p className="text-gray-900 dark:text-white font-black text-sm">{expense.date || new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="p-5 rounded-3xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Category</label>
                        <p className="text-gray-900 dark:text-white font-black text-sm">{expense.category}</p>
                    </div>
                </div>

                {/* Narrative & Assets */}
                <div className="space-y-6 px-1">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-4 bg-primary-500 rounded-full"></div>
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Transaction Abstract</label>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed italic border-l-2 border-gray-100 dark:border-gray-800 pl-4 py-1">
                            "{expense.description || "No tactical description provided."}"
                        </p>
                    </div>

                    {expense.receiptUrl && (
                        <div className="group/artifact">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-4 bg-accent-500 rounded-full"></div>
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Verified Digital Artifact</label>
                            </div>
                            <button
                                className="w-full group relative overflow-hidden p-4 rounded-3xl bg-gray-900/5 dark:bg-white/5 border border-gray-100 dark:border-gray-800 transition-all hover:bg-gray-900/10 dark:hover:bg-white/10 flex items-center justify-between"
                                onClick={async () => {
                                    try {
                                        const url = await import('../../../services/userService').then(m => m.default.viewReceipt(expense.id));
                                        window.open(url, '_blank');
                                    } catch (err) {
                                        console.error('Failed to view receipt', err);
                                    }
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary-500 uppercase tracking-widest">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-gray-900 dark:text-white">receipt_v1.artifact</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Binary Integrity Verified</p>
                                    </div>
                                </div>
                                <div className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Rejection Narrative Input */}
                {isRejecting && (
                    <div className="animate-in zoom-in-95 duration-300 p-6 rounded-[2rem] bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 shadow-2xl shadow-red-500/10">
                        <label className="block text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-3 px-1">
                            Rejection Justification Required
                        </label>
                        <textarea
                            rows={3}
                            className="w-full rounded-2xl border-red-200 dark:border-red-900/50 focus:ring-red-500 focus:border-red-500 dark:bg-gray-900/50 text-gray-900 dark:text-white px-4 py-3 outline-none transition-all resize-none font-medium text-sm"
                            placeholder="Detail why this entry was aborted..."
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
