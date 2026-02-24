import React, { useState, useCallback, useEffect } from 'react';
import {
    getFraudInsights,
    getBudgetPrediction,
    getPolicyViolations,
    getVendorROI,
    getAuditSummary
} from '../../../services/aiService';
import api from '../../../services/api';
import PageTransition from '../../../components/layout/PageTransition';

const AICard = ({ title, icon, description, badge, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                    {badge && <span className="px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 rounded-full">{badge}</span>}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const AIResultBox = ({ result, loading, accentColor = 'violet' }) => {
    if (loading) return (
        <div className="flex items-center gap-3 py-6 justify-center">
            <div className={`w-5 h-5 border-2 border-${accentColor}-500 border-t-transparent rounded-full animate-spin`} />
            <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking…</span>
        </div>
    );
    if (!result) return null;
    return (
        <div className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap ${result.fallback
            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
            : 'bg-violet-50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-800 text-gray-800 dark:text-gray-200'
            }`}>
            {result.fallback && <p className="font-semibold text-amber-600 dark:text-amber-400 mb-2">⚠ AI Unavailable — Showing Fallback</p>}
            <p>{result.result}</p>
        </div>
    );
};

const AdminAIDashboard = () => {
    // Fraud Insights
    const [fraudResult, setFraudResult] = useState(null);
    const [fraudLoading, setFraudLoading] = useState(false);

    // Budget Prediction
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [budgetResult, setBudgetResult] = useState(null);
    const [budgetLoading, setBudgetLoading] = useState(false);

    // Policy Violations
    const [policyExpenseId, setPolicyExpenseId] = useState('');
    const [policyResult, setPolicyResult] = useState(null);
    const [policyLoading, setPolicyLoading] = useState(false);

    // Vendor ROI
    const [vendorResult, setVendorResult] = useState(null);
    const [vendorLoading, setVendorLoading] = useState(false);

    // Audit Summary
    const [auditResult, setAuditResult] = useState(null);
    const [auditLoading, setAuditLoading] = useState(false);

    useEffect(() => {
        // Load teams for budget prediction dropdown
        api.get('/admin/teams').then(r => {
            const list = Array.isArray(r.data) ? r.data : (r.data?.content || []);
            setTeams(list);
            if (list.length > 0) setSelectedTeam(list[0].id);
        }).catch(() => { });
    }, []);

    const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 outline-none transition";
    const btnCls = "px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const handleFraud = useCallback(async () => {
        setFraudLoading(true); setFraudResult(null);
        try { setFraudResult(await getFraudInsights()); }
        catch { setFraudResult({ result: 'Fraud analysis failed. Please try again.', fallback: true }); }
        finally { setFraudLoading(false); }
    }, []);

    const handleBudget = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedTeam) return;
        setBudgetLoading(true); setBudgetResult(null);
        try { setBudgetResult(await getBudgetPrediction(selectedTeam)); }
        catch { setBudgetResult({ result: 'Budget prediction failed. Team may not have a budget set.', fallback: true }); }
        finally { setBudgetLoading(false); }
    }, [selectedTeam]);

    const handlePolicy = useCallback(async (e) => {
        e.preventDefault();
        if (!policyExpenseId.trim()) return;
        setPolicyLoading(true); setPolicyResult(null);
        try { setPolicyResult(await getPolicyViolations(policyExpenseId)); }
        catch { setPolicyResult({ result: 'Policy check failed. Expense not found.', fallback: true }); }
        finally { setPolicyLoading(false); }
    }, [policyExpenseId]);

    const handleVendorROI = useCallback(async () => {
        setVendorLoading(true); setVendorResult(null);
        try { setVendorResult(await getVendorROI()); }
        catch { setVendorResult({ result: 'Vendor ROI analysis failed. Please try again.', fallback: true }); }
        finally { setVendorLoading(false); }
    }, []);

    const handleAuditSummary = useCallback(async () => {
        setAuditLoading(true); setAuditResult(null);
        try { setAuditResult(await getAuditSummary()); }
        catch { setAuditResult({ result: 'Audit summary generation failed. Please try again.', fallback: true }); }
        finally { setAuditLoading(false); }
    }, []);

    return (
        <PageTransition>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        🤖 AI Command Centre
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Advanced AI analytics for company-wide expense governance
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Feature 7: Fraud Insights */}
                    <AICard
                        title="Fraud Pattern Detection"
                        icon="🔍"
                        badge="Admin Only"
                        description="AI scans this month's expenses for anomalies, duplicates and suspicious patterns"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Analyses up to 30 recent expenses for red flags — high amounts, unusual categories, duplicate submissions, and outlier behaviour.
                        </p>
                        <button className={btnCls} onClick={handleFraud} disabled={fraudLoading}>
                            {fraudLoading ? 'Scanning…' : '🔍 Run Fraud Scan'}
                        </button>
                        <AIResultBox result={fraudResult} loading={fraudLoading} />
                    </AICard>

                    {/* Feature 8: Budget Prediction */}
                    <AICard
                        title="Budget Overrun Prediction"
                        icon="📈"
                        description="Predict whether a team will exceed its monthly budget"
                    >
                        <form onSubmit={handleBudget} className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Team</label>
                            {teams.length > 0 ? (
                                <select
                                    className={inputCls}
                                    value={selectedTeam}
                                    onChange={e => setSelectedTeam(e.target.value)}
                                >
                                    {teams.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    className={inputCls}
                                    type="number"
                                    placeholder="Team ID"
                                    value={selectedTeam}
                                    onChange={e => setSelectedTeam(e.target.value)}
                                    min="1"
                                />
                            )}
                            <button type="submit" className={btnCls} disabled={budgetLoading || !selectedTeam}>
                                {budgetLoading ? 'Predicting…' : '📈 Predict Overrun'}
                            </button>
                        </form>
                        <AIResultBox result={budgetResult} loading={budgetLoading} />
                    </AICard>

                    {/* Feature 9: Policy Violations */}
                    <AICard
                        title="Policy Violation Check"
                        icon="📋"
                        description="Check if an expense violates company policy rules"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Checks against: meal limits ₹1k/meal, travel class rules, hotel caps, entertainment approval thresholds, and personal expense restrictions.
                        </p>
                        <form onSubmit={handlePolicy} className="space-y-3">
                            <input
                                className={inputCls}
                                type="number"
                                placeholder="Expense ID to check"
                                value={policyExpenseId}
                                onChange={e => setPolicyExpenseId(e.target.value)}
                                required min="1"
                            />
                            <button type="submit" className={btnCls} disabled={policyLoading || !policyExpenseId}>
                                {policyLoading ? 'Checking…' : '📋 Check Policy'}
                            </button>
                        </form>
                        <AIResultBox result={policyResult} loading={policyLoading} />
                    </AICard>

                    {/* Feature 11: Vendor ROI */}
                    <AICard
                        title="Vendor ROI Analysis"
                        icon="💰"
                        description="Identify top vendors and get cost-optimisation recommendations"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Aggregates this month's expenses by vendor, ranks them by spend, and suggests cost-saving strategies and vendor consolidation opportunities.
                        </p>
                        <button className={btnCls} onClick={handleVendorROI} disabled={vendorLoading}>
                            {vendorLoading ? 'Analysing…' : '💰 Analyse Vendors'}
                        </button>
                        <AIResultBox result={vendorResult} loading={vendorLoading} />
                    </AICard>

                    {/* Feature 13: Audit Summary */}
                    <AICard
                        title="Executive Audit Summary"
                        icon="📋"
                        description="Generate a high-level summary of company spending for external auditors"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Aggregates all of this month's expenses and highlights key findings, risk areas, and compliance status in a professional format.
                        </p>
                        <button className={btnCls} onClick={handleAuditSummary} disabled={auditLoading}>
                            {auditLoading ? 'Generating…' : '📋 Generate Audit Summary'}
                        </button>
                        <AIResultBox result={auditResult} loading={auditLoading} accentColor="indigo" />
                    </AICard>
                </div>
            </div>
        </PageTransition>
    );
};

export default AdminAIDashboard;
