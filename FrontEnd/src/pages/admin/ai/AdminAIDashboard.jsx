import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getFraudInsights,
    getBudgetPrediction,
    getPolicyViolations,
    getVendorROI,
    getAuditSummary
} from '../../../services/aiService';
import api from '../../../services/api';
import PageTransition from '../../../components/layout/PageTransition';
import {
    ShieldCheckIcon,
    MagnifyingGlassIcon,
    ChartBarIcon,
    DocumentCheckIcon,
    CurrencyDollarIcon,
    ArrowPathIcon,
    BoltIcon,
    ExclamationTriangleIcon,
    ChevronRightIcon,
    GlobeAltIcon,
    CubeIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../../utils/helpers';
import Button from '../../../components/ui/Button';

// ── Shared sub-components ────────────────────────────────────────────────────

const AICard = ({ title, icon: Icon, description, badge, children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative group h-full"
    >
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-indigo-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
        <div className="relative h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-8 border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-5 mb-8">
                <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-500 shadow-lg shadow-violet-500/5 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{title}</h3>
                        {badge && (
                            <span className="px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full">
                                {badge}
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">{description}</p>
                </div>
            </div>
            <div className="flex-1 space-y-6">{children}</div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-500/5 blur-[60px] rounded-full pointer-events-none" />
        </div>
    </motion.div>
);

const AIResultBox = ({ result, loading }) => {
    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12 gap-5 bg-violet-500/5 rounded-3xl border border-violet-500/10 mt-6"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-violet-500 uppercase tracking-[0.3em] animate-pulse">Scanning Global Matrix…</span>
                </motion.div>
            ) : result ? (
                <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "mt-6 p-6 rounded-3xl border backdrop-blur-xl relative overflow-hidden",
                        result.fallback
                            ? "bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-200"
                            : "bg-violet-500/5 border-violet-500/20 text-slate-700 dark:text-slate-200 shadow-[inset_0_2px_15px_rgba(139,92,246,0.05)]"
                    )}
                >
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                        <BoltIcon className="w-5 h-5" />
                    </div>
                    {result.fallback && (
                        <div className="flex items-center gap-2 mb-4">
                            <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Manual Audit Override Active</p>
                        </div>
                    )}
                    <p className="text-sm font-medium leading-relaxed">{result.result}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-violet-500/10 pt-4 opacity-40">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Logic Node: {result.model || 'Aegis Omniscience'}</span>
                        </div>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const AdminAIDashboard = () => {
    const [fraudResult, setFraudResult] = useState(null);
    const [fraudLoading, setFraudLoading] = useState(false);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [budgetResult, setBudgetResult] = useState(null);
    const [budgetLoading, setBudgetLoading] = useState(false);
    const [policyExpenseId, setPolicyExpenseId] = useState('');
    const [policyResult, setPolicyResult] = useState(null);
    const [policyLoading, setPolicyLoading] = useState(false);
    const [vendorResult, setVendorResult] = useState(null);
    const [vendorLoading, setVendorLoading] = useState(false);
    const [auditResult, setAuditResult] = useState(null);
    const [auditLoading, setAuditLoading] = useState(false);

    useEffect(() => {
        api.get('/admin/teams').then(r => {
            const list = Array.isArray(r.data) ? r.data : (r.data?.content || []);
            setTeams(list);
            if (list.length > 0) setSelectedTeam(list[0].id);
        }).catch(() => { });
    }, []);

    const inputCls = "w-full px-6 py-4 rounded-2xl bg-white/20 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 outline-none transition-all";

    const handleFraud = useCallback(async () => {
        setFraudLoading(true); setFraudResult(null);
        try { setFraudResult(await getFraudInsights()); }
        catch { setFraudResult({ result: 'Fraud analysis node failure. Manual verification advised.', fallback: true }); }
        finally { setFraudLoading(false); }
    }, []);

    const handleBudget = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedTeam) return;
        setBudgetLoading(true); setBudgetResult(null);
        try { setBudgetResult(await getBudgetPrediction(selectedTeam)); }
        catch { setBudgetResult({ result: 'Team telemetry insufficient for reliable budget projection.', fallback: true }); }
        finally { setBudgetLoading(false); }
    }, [selectedTeam]);

    const handlePolicy = useCallback(async (e) => {
        e.preventDefault();
        if (!policyExpenseId.trim()) return;
        setPolicyLoading(true); setPolicyResult(null);
        try { setPolicyResult(await getPolicyViolations(policyExpenseId)); }
        catch { setPolicyResult({ result: 'Policy verification error for entity ' + policyExpenseId, fallback: true }); }
        finally { setPolicyLoading(false); }
    }, [policyExpenseId]);

    const handleVendorROI = useCallback(async () => {
        setVendorLoading(true); setVendorResult(null);
        try { setVendorResult(await getVendorROI()); }
        catch { setVendorResult({ result: 'Vendor ROI matrix generation interrupted.', fallback: true }); }
        finally { setVendorLoading(false); }
    }, []);

    const handleAuditSummary = useCallback(async () => {
        setAuditLoading(true); setAuditResult(null);
        try { setAuditResult(await getAuditSummary()); }
        catch { setAuditResult({ result: 'Executive audit synthesis failure.', fallback: true }); }
        finally { setAuditLoading(false); }
    }, []);

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto space-y-16 pb-24 px-4 sm:px-6">

                {/* ── Aegis Core Header ── */}
                <div className="relative py-8">
                    <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                        <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
                            transition={{ duration: 15, repeat: Infinity }}
                            className="absolute -top-[50%] -left-[10%] w-[100%] h-[200%] bg-violet-500/20 blur-[150px] rounded-full"
                        />
                    </div>

                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-12 border-b border-violet-500/10 pb-12">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-8"
                            >
                                <div className="p-7 rounded-[40px] bg-slate-900 dark:bg-violet-600 text-white shadow-3xl shadow-violet-600/30 relative group overflow-hidden">
                                    <GlobeAltIcon className="w-14 h-14 relative z-10" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-2 bg-gradient-to-tr from-white/20 via-transparent to-white/20 blur-md"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Aegis</h1>
                                    <p className="text-[11px] text-violet-600 dark:text-violet-400 font-black uppercase tracking-[0.5em] mt-6 flex items-center gap-4">
                                        <CubeIcon className="w-5 h-5 animate-spin-slow" />
                                        Advanced Governance Logic
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="px-8 py-5 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl flex items-center gap-5">
                                <div className="w-3 h-3 rounded-full bg-violet-500 animate-pulse shadow-[0_0_10px_#8b5cf6]" />
                                <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest leading-none">Omniscience Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Fraud Insights */}
                    <AICard
                        title="Fraud Matrix"
                        icon={MagnifyingGlassIcon}
                        badge="ADMIN-CLASS"
                        description="Suspicious Pattern & Outlier Detection"
                        delay={0.1}
                    >
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Initialize a deep scan for fiscal anomalies. AI evaluates entity class, submission frequency, and value outliers across the global grid.
                        </p>
                        <div className="pt-4 flex flex-col">
                            <Button
                                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl group/btn overflow-hidden relative"
                                onClick={handleFraud}
                                disabled={fraudLoading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:scale-105 transition-transform duration-500" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {fraudLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ChevronRightIcon className="w-4 h-4" />}
                                    {fraudLoading ? 'Synthesizing…' : 'Execute Global Scan'}
                                </span>
                            </Button>
                            <AIResultBox result={fraudResult} loading={fraudLoading} />
                        </div>
                    </AICard>

                    {/* Budget Prediction */}
                    <AICard
                        title="Budget Projection"
                        icon={ChartBarIcon}
                        description="Team-Level Expenditure Forecaster"
                        delay={0.2}
                    >
                        <form onSubmit={handleBudget} className="space-y-5">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Target Sector</label>
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
                                    <input className={inputCls} type="number" placeholder="Reference ID" value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} />
                                )}
                            </div>
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 group/btn"
                                disabled={budgetLoading || !selectedTeam}
                            >
                                <span className="flex items-center justify-center gap-3 text-violet-600">
                                    {budgetLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ChartBarIcon className="w-4 h-4" />}
                                    {budgetLoading ? 'Projecting…' : 'Generate Forecast'}
                                </span>
                            </Button>
                        </form>
                        <AIResultBox result={budgetResult} loading={budgetLoading} />
                    </AICard>

                    {/* Policy Violations */}
                    <AICard
                        title="Policy Auditor"
                        icon={DocumentCheckIcon}
                        description="Directive Compliance Verification"
                        delay={0.3}
                    >
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
                            Audit unique entities against the established fiscal directory (Meal Caps, Travel Class, Vendor Tiers).
                        </p>
                        <form onSubmit={handlePolicy} className="space-y-4">
                            <input
                                className={inputCls}
                                type="number"
                                placeholder="Entity Reference UID"
                                value={policyExpenseId}
                                onChange={e => setPolicyExpenseId(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 group/btn"
                                disabled={policyLoading || !policyExpenseId}
                            >
                                <span className="flex items-center justify-center gap-3 text-emerald-500">
                                    {policyLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <DocumentCheckIcon className="w-4 h-4" />}
                                    {policyLoading ? 'Auditing…' : 'Verify Compliance'}
                                </span>
                            </Button>
                        </form>
                        <AIResultBox result={policyResult} loading={policyLoading} />
                    </AICard>

                    {/* Vendor ROI */}
                    <AICard
                        title="Sector Yield"
                        icon={CurrencyDollarIcon}
                        description="Vendor Efficiency & Optimization Analysis"
                        delay={0.4}
                    >
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Aggregates global vendor interactions to identify consolidation vectors and high-yield sectors.
                        </p>
                        <div className="pt-4">
                            <Button
                                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl group/btn overflow-hidden relative"
                                onClick={handleVendorROI}
                                disabled={vendorLoading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 group-hover:scale-105 transition-transform duration-500" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {vendorLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CurrencyDollarIcon className="w-4 h-4" />}
                                    {vendorLoading ? 'Analyzing…' : 'Calculate Sector Yield'}
                                </span>
                            </Button>
                            <AIResultBox result={vendorResult} loading={vendorLoading} />
                        </div>
                    </AICard>

                    {/* Executive Audit Summary */}
                    <AICard
                        title="Aegis Overview"
                        icon={ShieldCheckIcon}
                        description="Consolidated Governance Snapshot"
                        delay={0.5}
                    >
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Generates a high-level summary of systemic health and regulatory alignment for board-level review.
                        </p>
                        <div className="pt-4">
                            <Button
                                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 border-slate-900 dark:border-white/20 group/btn"
                                onClick={handleAuditSummary}
                                disabled={auditLoading}
                            >
                                <span className="flex items-center justify-center gap-3 text-slate-900 dark:text-white">
                                    {auditLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <DocumentCheckIcon className="w-4 h-4" />}
                                    {auditLoading ? 'Generating…' : 'Compile Executive Audit'}
                                </span>
                            </Button>
                            <AIResultBox result={auditResult} loading={auditLoading} />
                        </div>
                    </AICard>
                </div>
            </div>
        </PageTransition>
    );
};

export default AdminAIDashboard;
