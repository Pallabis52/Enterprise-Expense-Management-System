import React, { useState, useCallback } from 'react';
import {
    getSpendingInsights,
    categorizeExpense,
    explainRejection
} from '../../../services/aiService';
import PageTransition from '../../../components/layout/PageTransition';

// ── Shared sub-components ────────────────────────────────────────────────────

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

const AIResultBox = ({ result, loading, onRetry }) => {
    if (loading) return (
        <div className="flex items-center gap-3 py-6 justify-center">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking…</span>
        </div>
    );
    if (!result) return null;
    const ms = result.processingMs;
    const elapsed = ms ? (ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`) : null;
    return (
        <div className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap ${result.fallback
            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
            : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800 text-gray-800 dark:text-gray-200'
            }`}>
            {result.fallback && (
                <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-amber-600 dark:text-amber-400">⚠ AI Unavailable — Showing Fallback</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="text-xs px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-700 transition-colors font-medium"
                        >
                            ↻ Retry
                        </button>
                    )}
                </div>
            )}
            <p>{result.result}</p>
            {elapsed && (
                <p className="mt-2 text-xs opacity-50">⚡ {elapsed} · {result.model}</p>
            )}
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const UserAIDashboard = () => {
    // Feature: Spending Insights
    const [insightsResult, setInsightsResult] = useState(null);
    const [insightsLoading, setInsightsLoading] = useState(false);

    // Feature: Smart Categorize
    const [catTitle, setCatTitle] = useState('');
    const [catDesc, setCatDesc] = useState('');
    const [catAmount, setCatAmount] = useState('');
    const [catResult, setCatResult] = useState(null);
    const [catLoading, setCatLoading] = useState(false);

    // Feature: Explain Rejection
    const [rejectId, setRejectId] = useState('');
    const [rejectResult, setRejectResult] = useState(null);
    const [rejectLoading, setRejectLoading] = useState(false);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleInsights = useCallback(async () => {
        setInsightsLoading(true);
        setInsightsResult(null);
        try {
            const data = await getSpendingInsights();
            setInsightsResult(data);
        } catch {
            setInsightsResult({ result: 'Failed to fetch insights. Please try again.', fallback: true });
        } finally {
            setInsightsLoading(false);
        }
    }, []);

    const handleCategorize = useCallback(async (e) => {
        e.preventDefault();
        setCatLoading(true);
        setCatResult(null);
        try {
            const data = await categorizeExpense(catTitle, catDesc, parseFloat(catAmount) || 0);
            setCatResult(data);
        } catch {
            setCatResult({ result: 'Categorization failed. Please try again.', fallback: true });
        } finally {
            setCatLoading(false);
        }
    }, [catTitle, catDesc, catAmount]);

    const handleExplainRejection = useCallback(async (e) => {
        e.preventDefault();
        if (!rejectId.trim()) return;
        setRejectLoading(true);
        setRejectResult(null);
        try {
            const data = await explainRejection(rejectId);
            setRejectResult(data);
        } catch {
            setRejectResult({ result: 'Could not fetch explanation. The expense may not exist or may not be rejected.', fallback: true });
        } finally {
            setRejectLoading(false);
        }
    }, [rejectId]);

    const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition";
    const btnCls = "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        🤖 AI Assistant
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        AI-powered tools to manage and understand your expenses
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Feature 1: Spending Insights */}
                    <AICard
                        title="Personal Spending Insights"
                        icon="📊"
                        description="Analyse your spending patterns and get personalised recommendations"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Our AI Assistant analyses all your expense history to identify trends, top categories, and cost-saving opportunities.
                        </p>
                        <button className={btnCls} onClick={handleInsights} disabled={insightsLoading}>
                            {insightsLoading ? 'Analysing…' : '✨ Get My Insights'}
                        </button>
                        <AIResultBox result={insightsResult} loading={insightsLoading} />
                    </AICard>

                    {/* Feature 2: Smart Categorize */}
                    <AICard
                        title="Smart Expense Categoriser"
                        icon="🏷️"
                        description="Can't decide which category? Let AI suggest the best one"
                    >
                        <form onSubmit={handleCategorize} className="space-y-3">
                            <input
                                className={inputCls}
                                placeholder="Expense title (e.g. Team lunch at Taj Hotel)"
                                value={catTitle}
                                onChange={e => setCatTitle(e.target.value)}
                                required
                            />
                            <input
                                className={inputCls}
                                placeholder="Description (optional)"
                                value={catDesc}
                                onChange={e => setCatDesc(e.target.value)}
                            />
                            <input
                                className={inputCls}
                                type="number"
                                placeholder="Amount (₹)"
                                value={catAmount}
                                onChange={e => setCatAmount(e.target.value)}
                                min="0"
                            />
                            <button type="submit" className={btnCls} disabled={catLoading || !catTitle}>
                                {catLoading ? 'Categorising…' : '🏷️ Suggest Category'}
                            </button>
                        </form>
                        <AIResultBox result={catResult} loading={catLoading} />
                    </AICard>

                    {/* Feature 3: Explain Rejection */}
                    <AICard
                        title="Why Was My Expense Rejected?"
                        icon="❌"
                        description="Get a clear, friendly explanation for any rejected expense"
                    >
                        <form onSubmit={handleExplainRejection} className="space-y-3">
                            <input
                                className={inputCls}
                                type="number"
                                placeholder="Expense ID (find it in My Expenses)"
                                value={rejectId}
                                onChange={e => setRejectId(e.target.value)}
                                required
                                min="1"
                            />
                            <button type="submit" className={btnCls} disabled={rejectLoading || !rejectId}>
                                {rejectLoading ? 'Fetching…' : '🔍 Explain Rejection'}
                            </button>
                        </form>
                        <AIResultBox result={rejectResult} loading={rejectLoading} />
                    </AICard>

                    {/* Info card – Voice */}
                    <AICard
                        title="Voice Search"
                        icon="🎤"
                        description="Speak your commands directly from any page"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                            A voice-enabled AI assistant is built into the <strong>My Expenses</strong> page.
                            Click the microphone icon there to try voice commands like:
                        </p>
                        <ul className="space-y-2">
                            {[
                                '"Show my pending travel expenses"',
                                '"What are my rejected expenses?"',
                                '"Add expense for taxi 500 rupees"',
                                '"Give me my spending summary"',
                            ].map((hint, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="text-indigo-500 mt-0.5">▸</span>
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

export default UserAIDashboard;
