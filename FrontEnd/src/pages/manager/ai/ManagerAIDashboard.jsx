import React, { useState, useCallback } from 'react';
import {
    getApprovalRecommendation,
    getRiskScore,
    getTeamSummary
} from '../../../services/aiService';
import PageTransition from '../../../components/layout/PageTransition';

// ── Shared helpers ────────────────────────────────────────────────────────────

const AICard = ({ title, icon, description, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const AIResultBox = ({ result, loading }) => {
    if (loading) return (
        <div className="flex items-center gap-3 py-6 justify-center">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking…</span>
        </div>
    );
    if (!result) return null;
    return (
        <div className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap ${result.fallback
            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
            : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-gray-800 dark:text-gray-200'
            }`}>
            {result.fallback && <p className="font-semibold text-amber-600 dark:text-amber-400 mb-2">⚠ AI Unavailable — Showing Fallback</p>}
            <p>{result.result}</p>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const ManagerAIDashboard = () => {
    // Feature: Team Summary
    const [summaryResult, setSummaryResult] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);

    // Feature: Approval Recommendation
    const [recExpenseId, setRecExpenseId] = useState('');
    const [recResult, setRecResult] = useState(null);
    const [recLoading, setRecLoading] = useState(false);

    // Feature: Risk Score
    const [riskExpenseId, setRiskExpenseId] = useState('');
    const [riskResult, setRiskResult] = useState(null);
    const [riskLoading, setRiskLoading] = useState(false);

    const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition";
    const btnCls = "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const handleTeamSummary = useCallback(async () => {
        setSummaryLoading(true);
        setSummaryResult(null);
        try {
            const data = await getTeamSummary();
            setSummaryResult(data);
        } catch {
            setSummaryResult({ result: 'Failed to load team summary. You may not be assigned to a team.', fallback: true });
        } finally {
            setSummaryLoading(false);
        }
    }, []);

    const handleApprovalRec = useCallback(async (e) => {
        e.preventDefault();
        if (!recExpenseId.trim()) return;
        setRecLoading(true);
        setRecResult(null);
        try {
            const data = await getApprovalRecommendation(recExpenseId);
            setRecResult(data);
        } catch {
            setRecResult({ result: 'Expense not found or not accessible.', fallback: true });
        } finally {
            setRecLoading(false);
        }
    }, [recExpenseId]);

    const handleRiskScore = useCallback(async (e) => {
        e.preventDefault();
        if (!riskExpenseId.trim()) return;
        setRiskLoading(true);
        setRiskResult(null);
        try {
            const data = await getRiskScore(riskExpenseId);
            setRiskResult(data);
        } catch {
            setRiskResult({ result: 'Risk scoring failed. Expense could not be found.', fallback: true });
        } finally {
            setRiskLoading(false);
        }
    }, [riskExpenseId]);

    return (
        <PageTransition>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        🤖 AI Manager Tools
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        AI-powered insights to help you manage team approvals smartly
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Feature: Team Spending Summary */}
                    <AICard
                        title="Team AI Spending Summary"
                        icon="👥"
                        description="Get a comprehensive AI analysis of your team's expense patterns"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Our AI Assistant analyses your team's monthly spend, pending approvals, top categories, and compares against budget.
                        </p>
                        <button className={btnCls} onClick={handleTeamSummary} disabled={summaryLoading}>
                            {summaryLoading ? 'Analysing…' : '✨ Analyse My Team'}
                        </button>
                        <AIResultBox result={summaryResult} loading={summaryLoading} />
                    </AICard>

                    {/* Feature: Approval Recommendation */}
                    <AICard
                        title="Should I Approve This?"
                        icon="✅"
                        description="AI recommendation on whether to approve or question an expense"
                    >
                        <form onSubmit={handleApprovalRec} className="space-y-3">
                            <input
                                className={inputCls}
                                type="number"
                                placeholder="Expense ID (from Approvals page)"
                                value={recExpenseId}
                                onChange={e => setRecExpenseId(e.target.value)}
                                required
                                min="1"
                            />
                            <button type="submit" className={btnCls} disabled={recLoading || !recExpenseId}>
                                {recLoading ? 'Analysing…' : '🧠 Get Recommendation'}
                            </button>
                        </form>
                        <AIResultBox result={recResult} loading={recLoading} />
                    </AICard>

                    {/* Feature: Risk Score */}
                    <AICard
                        title="Expense Risk Score"
                        icon="⚠️"
                        description="Assess the risk level of any expense before approving"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Checks amount anomalies, duplicate flags, category patterns, and history to produce a risk level (LOW / MEDIUM / HIGH).
                        </p>
                        <form onSubmit={handleRiskScore} className="space-y-3">
                            <input
                                className={inputCls}
                                type="number"
                                placeholder="Expense ID"
                                value={riskExpenseId}
                                onChange={e => setRiskExpenseId(e.target.value)}
                                required
                                min="1"
                            />
                            <button type="submit" className={btnCls} disabled={riskLoading || !riskExpenseId}>
                                {riskLoading ? 'Scoring…' : '🎯 Get Risk Score'}
                            </button>
                        </form>
                        <AIResultBox result={riskResult} loading={riskLoading} />
                    </AICard>

                    {/* Info: Voice on Approvals Page */}
                    <AICard
                        title="Voice Approval Commands"
                        icon="🎤"
                        description="Use voice commands on the Approvals page"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                            The <strong>Approvals</strong> page has a built-in voice assistant. Try:
                        </p>
                        <ul className="space-y-2">
                            {[
                                '"Approve expense 15"',
                                '"Reject expense 22, reason: missing receipt"',
                                '"Show my team\'s pending expenses"',
                                '"Summarize my team\'s spending this month"',
                            ].map((hint, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="text-emerald-500 mt-0.5">▸</span>
                                    <span className="italic">{hint}</span>
                                </li>
                            ))}
                        </ul>
                    </AICard>
                </div>
            </div>
        </PageTransition>
    );
};

export default ManagerAIDashboard;
