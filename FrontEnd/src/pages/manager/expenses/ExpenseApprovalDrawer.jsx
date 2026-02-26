import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useManagerExpenseStore from '../../../store/managerExpenseStore';
import Drawer from '../../../components/ui/Drawer';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/helpers';
import {
    CheckCircleIcon,
    XCircleIcon,
    ArrowUpTrayIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    UserCircleIcon,
    CalendarIcon,
    ChatBubbleLeftRightIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import MoodInsightBadge from '../../../components/ai/MoodInsightBadge';
import ConfidenceIndicator from '../../../components/ai/ConfidenceIndicator';

const MANAGER_APPROVE_LIMIT = 10_000;
const ADMIN_ONLY_LIMIT = 50_000;

const ExpenseApprovalDrawer = ({ isOpen, onClose }) => {
    const { currentExpense: expense, approveExpense, rejectExpense, forwardToAdmin } =
        useManagerExpenseStore();

    const [comment, setComment] = useState('');
    const [mode, setMode] = useState(null); // null | 'reject' | 'forward'

    if (!expense) return null;

    const amount = expense.amount || 0;
    const isWithinManagerLimit = amount <= MANAGER_APPROVE_LIMIT;
    const isForwardable = amount > MANAGER_APPROVE_LIMIT && amount <= ADMIN_ONLY_LIMIT;
    const isAdminOnly = amount > ADMIN_ONLY_LIMIT;

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
            title={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                        <BanknotesIcon className="w-5 h-5" />
                    </div>
                    <span className="font-black uppercase tracking-tighter text-xl">Review Expense</span>
                </div>
            }
            footer={
                isPending && (
                    <div className="w-full flex flex-col gap-4 p-2">
                        <AnimatePresence mode="wait">
                            {mode && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="space-y-3"
                                >
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                                        {mode === 'reject' ? 'Rejection Reason (Required)' :
                                            mode === 'forward' ? 'Forwarding Note (Required)' : 'Approval Comment'}
                                    </label>
                                    <textarea
                                        rows={3}
                                        autoFocus
                                        className="w-full rounded-[20px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 transition-all p-4 text-sm font-medium"
                                        placeholder={
                                            mode === 'reject' ? 'Please provide a reason for rejection...' :
                                                mode === 'forward' ? 'Explain why this needs admin approval...' :
                                                    'Optional approval note...'
                                        }
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-3 w-full">
                            {mode ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        onClick={() => { setMode(null); setComment(''); }}
                                        className="flex-1 rounded-[20px] font-bold uppercase tracking-wider text-xs h-12"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        className={`flex-1 rounded-[24px] font-black uppercase tracking-widest text-xs h-12 shadow-lg transition-all active:scale-95 ${mode === 'reject' ? 'bg-rose-500 hover:bg-rose-600 !text-white' : 'bg-indigo-600 hover:bg-indigo-700 !text-white'
                                            }`}
                                        disabled={!comment.trim()}
                                        onClick={mode === 'reject' ? handleReject : handleForward}
                                    >
                                        Confirm {mode}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {!isAdminOnly && (
                                        <Button
                                            variant="ghost"
                                            className="flex-1 rounded-[24px] border-rose-500/20 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-black uppercase tracking-widest text-xs h-14 transition-all hover:scale-[1.02] border"
                                            onClick={() => setMode('reject')}
                                        >
                                            Reject
                                        </Button>
                                    )}

                                    {!isAdminOnly && !isForwardable ? (
                                        <Button
                                            className="flex-[2] rounded-[24px] bg-emerald-600 hover:bg-emerald-700 !text-white font-black uppercase tracking-widest text-xs h-14 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] active:scale-95"
                                            onClick={handleApprove}
                                        >
                                            Approve
                                        </Button>
                                    ) : (
                                        <Button
                                            className="flex-[2] rounded-[24px] bg-indigo-600 hover:bg-indigo-700 !text-white font-black uppercase tracking-widest text-xs h-14 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.4)] transition-all hover:scale-[1.02] active:scale-95"
                                            onClick={() => setMode('forward')}
                                        >
                                            Forward to Admin
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )
            }
        >
            <div className="space-y-8 p-1">
                {/* ── Visual Warning Banners ── */}
                <AnimatePresence>
                    {(isAdminOnly || isForwardable || expense.isDuplicate) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                        >
                            {isAdminOnly && (
                                <div className="p-4 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-rose-500 text-white flex-shrink-0">
                                        <XCircleIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-tight">Requires Admin Approval</p>
                                        <p className="text-xs text-rose-500 mt-0.5 font-medium leading-relaxed opacity-80">Amount is too high for manager approval. Must be forwarded to Admin.</p>
                                    </div>
                                </div>
                            )}

                            {isForwardable && !isAdminOnly && (
                                <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-amber-500 text-white flex-shrink-0">
                                        <ArrowUpTrayIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-tight">Forwarding Required</p>
                                        <p className="text-xs text-amber-500 mt-0.5 font-medium leading-relaxed opacity-80">Amount exceeds manager limit (₹10,001–₹50,000). Please forward to Admin.</p>
                                    </div>
                                </div>
                            )}

                            {expense.isDuplicate && (
                                <div className="p-4 bg-yellow-400/5 border border-yellow-400/30 rounded-2xl flex items-start gap-4 shadow-sm backdrop-blur-sm">
                                    <div className="p-2 rounded-lg bg-yellow-400 text-slate-900 flex-shrink-0 ring-4 ring-yellow-400/20 shadow-lg">
                                        <ExclamationTriangleIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-yellow-700 dark:text-yellow-400 uppercase tracking-tight">Possible Duplicate</p>
                                        <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-0.5 font-medium leading-relaxed">This expense looks similar to an existing record. Please verify.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Main Expense Overview ── */}
                <div className="relative overflow-hidden rounded-[32px] bg-slate-50 dark:bg-slate-800/50 p-8 border border-slate-100 dark:border-white/5 group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] group-hover:bg-indigo-500/10 transition-colors duration-700" />

                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.25em]">Transaction Title</span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">{expense.title}</h3>
                            <Badge variant="indigo" className="bg-indigo-500/10 text-indigo-500 font-black text-[10px] tracking-widest px-3 py-1 mt-2">
                                {expense.category}
                            </Badge>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em]">Value</span>
                            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mt-1">
                                {formatCurrency(expense.amount)}
                            </p>
                            <div className="mt-3 flex items-center justify-end gap-2">
                                <MoodInsightBadge expenseId={expense.id} />
                                <Badge variant={statusVariant} className="font-black text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full">{currentStatus}</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Auditing Strategy (Confidence Score) */}
                <div className="p-8 rounded-[2rem] bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 shadow-xl">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6">AI Transaction Identity Verification</h4>
                    <ConfidenceIndicator expenseId={expense.id} />
                </div>

                {/* ── Personnel Card ── */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Submitted By</label>
                    <div className="p-6 bg-white dark:bg-slate-900/40 rounded-[24px] border border-slate-200 dark:border-white/10 flex items-center gap-5 group hover:border-indigo-500/30 transition-all duration-500">
                        <div className="relative">
                            <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition" />
                            <div className="relative w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center text-white text-xl font-black shadow-xl ring-4 ring-white dark:ring-slate-900">
                                {expense.user?.name?.[0] || 'E'}
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">{expense.user?.name || 'Employee'}</p>
                            <p className="text-xs text-slate-400 font-bold mt-1.5 flex items-center gap-2">
                                <UserCircleIcon className="w-4 h-4 text-slate-300" />
                                {expense.user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Metadata & Description ── */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 dark:bg-slate-900/20 rounded-[20px] border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            Submission Date
                        </div>
                        <p className="text-slate-900 dark:text-white font-black text-sm">{new Date(expense.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                    {expense.receiptUrl && (
                        <button
                            onClick={async () => {
                                try {
                                    const url = await import('../../../services/userService').then(m => m.default.viewReceipt(expense.id));
                                    window.open(url, '_blank');
                                } catch (err) {
                                    console.error('Failed to view receipt', err);
                                }
                            }}
                            className="p-5 bg-white dark:bg-white/5 rounded-[20px] border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-3 group/receipt shadow-sm"
                        >
                            <EyeIcon className="w-5 h-5 text-indigo-500" />
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Document</span>
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest pl-1">
                        <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                        Description
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[24px] border border-slate-100 dark:border-white/5">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                            "{expense.description || 'No description provided.'}"
                        </p>
                    </div>

                    {expense.approvalComment && (
                        <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-[24px] space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-indigo-500 font-black uppercase tracking-widest">
                                <ArrowUpTrayIcon className="w-3.5 h-3.5" />
                                Approval Notes
                            </div>
                            <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed">{expense.approvalComment}</p>
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    );
};

export default ExpenseApprovalDrawer;
