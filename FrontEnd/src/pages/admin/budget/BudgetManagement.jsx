import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
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

                {/* ── Month/Year selector ── */}
                <div className="flex items-center gap-2">
                    <select
                        className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(Number(e.target.value))}
                    >
                        {months.slice(1).map((m, i) => (
                            <option key={i + 1} value={i + 1}>{m}</option>
                        ))}
                    </select>
                    <select
                        className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                        value={selectedYear}
                        onChange={e => setSelectedYear(Number(e.target.value))}
                    >
                        {[today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Toast ── */}
            {msg && (
                <div className={`p-3 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    {msg.text}
                </div>
            )}

            {/* ── Freeze Period Controls ── */}
            <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                    {isCurrentFrozen ? <LockClosedIcon className="w-5 h-5 text-red-500" /> : <LockOpenIcon className="w-5 h-5 text-green-500" />}
                    Expense Freeze — {months[selectedMonth]} {selectedYear}
                </h2>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isCurrentFrozen ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {isCurrentFrozen ? '🔒 Locked — submissions blocked' : '🔓 Open — submissions allowed'}
                    </span>
                    {isCurrentFrozen ? (
                        <button
                            onClick={handleUnlock}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                            Unlock Submissions
                        </button>
                    ) : (
                        <button
                            onClick={handleLock}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            Lock Submissions
                        </button>
                    )}
                </div>
            </div>

            {/* ── Budget Table ── */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 p-5 border-b border-gray-100 dark:border-gray-700">
                    <ChartBarIcon className="w-5 h-5 text-emerald-500" />
                    <h2 className="font-semibold text-gray-700 dark:text-gray-200">Team Budgets — {months[selectedMonth]} {selectedYear}</h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : budgets.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No teams found</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                {['Team', 'Budget (₹)', 'Spent (₹)', 'Remaining (₹)', 'Status', 'Action'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {budgets.map(b => {
                                const pct = b.budget > 0 ? Math.min(100, (b.spent / b.budget) * 100) : 0;
                                return (
                                    <tr key={b.teamId} className={b.exceeded ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{b.teamName}</td>
                                        <td className="px-4 py-3">
                                            {editTeamId === b.teamId ? (
                                                <input
                                                    type="number"
                                                    className="w-28 px-2 py-1 rounded border border-emerald-400 dark:bg-gray-700 text-sm"
                                                    value={editAmount}
                                                    onChange={e => setEditAmount(e.target.value)}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span>{b.budget > 0 ? `₹${b.budget.toLocaleString()}` : '—'}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center gap-2">
                                                ₹{(b.spent || 0).toLocaleString()}
                                                {b.budget > 0 && (
                                                    <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-600">
                                                        <div
                                                            className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">₹{(b.remaining || 0).toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            {b.exceeded ? (
                                                <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Exceeded</span>
                                            ) : b.budget === 0 ? (
                                                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">No Limit</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">OK ({pct.toFixed(0)}%)</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {editTeamId === b.teamId ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveBudget(b.teamId)}
                                                        className="px-3 py-1 rounded bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                                                    >Save</button>
                                                    <button
                                                        onClick={() => { setEditTeamId(null); setEditAmount(''); }}
                                                        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-600 text-xs"
                                                    >Cancel</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => { setEditTeamId(b.teamId); setEditAmount(b.budget || ''); }}
                                                    className="px-3 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                                                >Set Budget</button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BudgetManagement;
