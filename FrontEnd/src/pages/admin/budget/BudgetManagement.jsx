import React, { useEffect, useState, useMemo } from 'react';
import Table from '../../../components/ui/Table';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { BanknotesIcon, LockClosedIcon, LockOpenIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BudgetManagement = () => {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [budgets, setBudgets] = useState([]);
    const [freezeStatus, setFreezeStatus] = useState(null);
    const [editTeamId, setEditTeamId] = useState(null);
    const [editAmount, setEditAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const notify = (text, type = 'success') => {
        setMsg({ text, type });
        setTimeout(() => setMsg(null), 3000);
    };

    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const [budgetRes, freezeRes] = await Promise.all([
                api.get('/admin/budgets', { params: { month: selectedMonth, year: selectedYear } }),
                api.get('/admin/freeze/status')
            ]);
            setBudgets(budgetRes.data);
            setFreezeStatus(freezeRes.data);
        } catch {
            notify('Failed to load budget data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBudgets(); }, [selectedMonth, selectedYear]);

    const handleSaveBudget = async (teamId) => {
        if (!editAmount || isNaN(editAmount)) return;
        try {
            await api.post('/admin/budgets', {
                teamId,
                month: selectedMonth,
                year: selectedYear,
                budgetAmount: parseFloat(editAmount)
            });
            notify(`Budget saved for ${months[selectedMonth]} ${selectedYear}`);
            setEditTeamId(null);
            setEditAmount('');
            fetchBudgets();
        } catch {
            notify('Failed to save budget', 'error');
        }
    };

    const handleLock = async () => {
        try {
            await api.post('/admin/freeze', { month: selectedMonth, year: selectedYear });
            notify(`Expenses locked for ${months[selectedMonth]} ${selectedYear}`);
            fetchBudgets();
        } catch {
            notify('Failed to lock period', 'error');
        }
    };

    const handleUnlock = async () => {
        try {
            await api.delete(`/admin/freeze/${selectedMonth}/${selectedYear}`);
            notify(`Expenses unlocked for ${months[selectedMonth]} ${selectedYear}`);
            fetchBudgets();
        } catch {
            notify('Failed to unlock period', 'error');
        }
    };

    const isCurrentFrozen = freezeStatus?.frozen &&
        freezeStatus?.month === selectedMonth &&
        freezeStatus?.year === selectedYear;

    const columns = useMemo(() => [
        {
            title: 'Team',
            key: 'teamName',
            render: row => <span className="font-semibold text-gray-900 dark:text-white uppercase tracking-tight">{row.teamName}</span>
        },
        {
            title: 'Budget (₹)',
            key: 'budget',
            render: row => (
                <div className="min-w-[120px]">
                    {editTeamId === row.teamId ? (
                        <input
                            type="number"
                            className="w-28 px-3 py-1.5 rounded-lg border-2 border-emerald-400 dark:bg-gray-700 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-lg shadow-emerald-500/5"
                            value={editAmount}
                            onChange={e => setEditAmount(e.target.value)}
                            autoFocus
                        />
                    ) : (
                        <span className="font-bold text-gray-700 dark:text-gray-200">
                            {row.budget > 0 ? `₹${row.budget.toLocaleString()}` : '—'}
                        </span>
                    )}
                </div>
            )
        },
        {
            title: 'Spent (₹)',
            key: 'spent',
            render: row => {
                const pct = row.budget > 0 ? Math.min(100, (row.spent / row.budget) * 100) : 0;
                return (
                    <div className="flex flex-col gap-2 min-w-[140px]">
                        <span className="font-bold text-gray-900 dark:text-white">₹{(row.spent || 0).toLocaleString()}</span>
                        {row.budget > 0 && (
                            <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                />
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            title: 'Remaining (₹)',
            key: 'remaining',
            render: row => <span className={`font-bold ${row.remaining < 0 ? 'text-red-500' : 'text-emerald-600'}`}>₹{(row.remaining || 0).toLocaleString()}</span>
        },
        {
            title: 'Status',
            key: 'status',
            render: row => {
                const pct = row.budget > 0 ? Math.min(100, (row.spent / row.budget) * 100) : 0;
                if (row.exceeded) return <span className="px-3 py-1 rounded-full bg-red-100/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">Exceeded</span>;
                if (row.budget === 0) return <span className="px-3 py-1 rounded-full bg-gray-100/10 border border-gray-500/20 text-gray-500 text-[10px] font-black uppercase tracking-widest">No Limit</span>;
                return <span className="px-3 py-1 rounded-full bg-emerald-100/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">OK ({pct.toFixed(0)}%)</span>;
            }
        },
        {
            title: '',
            key: 'actions',
            render: row => (
                <div className="flex justify-end pr-4">
                    {editTeamId === row.teamId ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleSaveBudget(row.teamId)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                            >Save</button>
                            <button
                                onClick={() => { setEditTeamId(null); setEditAmount(''); }}
                                className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-bold uppercase tracking-wider"
                            >Cancel</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setEditTeamId(row.teamId); setEditAmount(row.budget || ''); }}
                            className="px-4 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-black uppercase tracking-widest hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-500/10 transition-all hover:scale-105"
                        >Set Budget</button>
                    )}
                </div>
            )
        }
    ], [editTeamId, editAmount]);

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* ── Header ── */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BanknotesIcon className="w-7 h-7 text-emerald-500" /> Budget Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Set monthly team budgets and control expense freeze periods</p>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(Number(e.target.value))}
                    >
                        {months.slice(1).map((m, i) => (
                            <option key={i + 1} value={i + 1}>{m}</option>
                        ))}
                    </select>
                    <select
                        className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                        value={selectedYear}
                        onChange={e => setSelectedYear(Number(e.target.value))}
                    >
                        {[today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {msg && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-sm font-medium border ${msg.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}
                >
                    {msg.text}
                </motion.div>
            )}

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                    {isCurrentFrozen ? <LockClosedIcon className="w-5 h-5 text-red-500" /> : <LockOpenIcon className="w-5 h-5 text-green-500" />}
                    Expense Freeze — {months[selectedMonth]} {selectedYear}
                </h2>
                <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest ${isCurrentFrozen ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                        {isCurrentFrozen ? '🔒 Submissions Blocked' : '🔓 Submissions Open'}
                    </span>
                    {isCurrentFrozen ? (
                        <button
                            onClick={handleUnlock}
                            className="px-6 py-2 rounded-lg bg-green-600 text-white text-sm font-bold uppercase tracking-wider hover:bg-green-700 transition-all hover:scale-105 shadow-lg shadow-green-500/20"
                        >
                            Unlock Submissions
                        </button>
                    ) : (
                        <button
                            onClick={handleLock}
                            className="px-6 py-2 rounded-lg bg-red-600 text-white text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-all hover:scale-105 shadow-lg shadow-red-500/20"
                        >
                            Lock Submissions
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-[24px] border border-white dark:border-gray-700 shadow-2xl shadow-indigo-500/5 overflow-hidden">
                <div className="flex items-center gap-2 p-6 border-b border-gray-100 dark:border-gray-800">
                    <ChartBarIcon className="w-5 h-5 text-emerald-500" />
                    <div>
                        <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] text-xs">Team Performance</h2>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 tracking-wider uppercase font-bold">Budgets for {months[selectedMonth]} {selectedYear}</p>
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={budgets}
                    isLoading={loading}
                    emptyMessage="No teams found"
                    rowClassName={row => row.exceeded ? 'bg-red-50/20 dark:bg-red-900/5' : ''}
                />
            </div>
        </div>
    );
};

export default BudgetManagement;
