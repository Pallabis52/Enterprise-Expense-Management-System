import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getApprovalRecommendation,
    getRiskScore,
    getTeamSummary
} from '../../../services/aiService';
import PageTransition from '../../../components/layout/PageTransition';
import {
    PresentationChartLineIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    MicrophoneIcon,
    ChartBarIcon,
    ArrowPathIcon,
    BoltIcon,
    ShieldExclamationIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../../utils/helpers';
import Button from '../../../components/ui/Button';

// ── Shared helpers ────────────────────────────────────────────────────────────

const AICard = ({ title, icon: Icon, description, children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative group h-full"
    >
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
        <div className="relative h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-8 border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-5 mb-8">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/5 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{title}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">{description}</p>
                </div>
            </div>
            <div className="flex-1 space-y-6">{children}</div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none" />
        </div>
    </motion.div>
);

const AIResultBox = ({ result, loading }) => {
    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center justify-center py-12 gap-5 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 mt-6"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full"
                        />
                        <SparklesIcon className="w-5 h-5 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] animate-pulse">Analyzing Fleet Telemetry…</span>
                </motion.div>
            ) : result ? (
                <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                        "mt-6 p-6 rounded-3xl border backdrop-blur-xl relative overflow-hidden",
                        result.fallback
                            ? "bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-200"
                            : "bg-emerald-500/5 border-emerald-500/20 text-slate-700 dark:text-slate-200 shadow-[inset_0_2px_10px_rgba(16,185,129,0.05)]"
                    )}
                >
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                        <BoltIcon className="w-5 h-5" />
                    </div>
                    {result.fallback && (
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldExclamationIcon className="w-4 h-4 text-amber-500" />
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Protocol Override: Manual Data Cache</p>
                        </div>
                    )}
                    <p className="text-sm font-medium leading-relaxed">{result.result}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-emerald-500/10 pt-4 opacity-40">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Admin Oversight: {result.model || 'Command Node'}</span>
                        </div>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const ManagerAIDashboard = () => {
    const [summaryResult, setSummaryResult] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [recExpenseId, setRecExpenseId] = useState('');
    const [recResult, setRecResult] = useState(null);
    const [recLoading, setRecLoading] = useState(false);
    const [riskExpenseId, setRiskExpenseId] = useState('');
    const [riskResult, setRiskResult] = useState(null);
    const [riskLoading, setRiskLoading] = useState(false);

    const handleTeamSummary = useCallback(async () => {
        setSummaryLoading(true);
        setSummaryResult(null);
        try {
            const data = await getTeamSummary();
            setSummaryResult(data);
        } catch (error) {
            setSummaryResult({ result: 'Squad integrity verification failed. Manual sync required.', fallback: true });
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
        } catch (error) {
            setRecResult({ result: 'Recommendation processor offline for entity ' + recExpenseId, fallback: true });
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
        } catch (error) {
            setRiskResult({ result: 'Risk matrix calculation failed for entity ' + riskExpenseId, fallback: true });
        } finally {
            setRiskLoading(false);
        }
    }, [riskExpenseId]);

    const inputCls = "w-full px-6 py-4 rounded-2xl bg-white/20 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all";

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto space-y-16 pb-24 px-4 sm:px-6">

                {/* ── Command Nexus Header ── */}
                <div className="relative py-8">
                    <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 12, repeat: Infinity }}
                            className="absolute -top-[50%] -right-[10%] w-[80%] h-[150%] bg-emerald-500/20 blur-[130px] rounded-full"
                        />
                    </div>

                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-emerald-500/10 pb-12">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-6"
                            >
                                <div className="p-6 rounded-[32px] bg-slate-900 dark:bg-emerald-600 text-white shadow-2xl shadow-emerald-600/20 relative group overflow-hidden">
                                    <ChartBarIcon className="w-12 h-12 relative z-10" />
                                    <motion.div
                                        animate={{ y: [-100, 100] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-white/10 w-full h-10 blur-md skew-y-12"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Vertex</h1>
                                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-3">
                                        <BoltIcon className="w-4 h-4 animate-pulse" />
                                        Strategic Core Interface
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="px-8 py-4 rounded-full border-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all"
                            >
                                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                System Logs
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Team Summary */}
                    <AICard
                        title="Squad Synthesis"
                        icon={PresentationChartLineIcon}
                        description="Global Fleet Expenditure Audit"
                        delay={0.1}
                    >
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Initialize a high-level scan of squad spending patterns. Compares operational volume against allocated budget tokens.
                        </p>
                        <div className="pt-4">
                            <Button
                                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl group/btn overflow-hidden relative"
                                onClick={handleTeamSummary}
                                disabled={summaryLoading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:scale-105 transition-transform duration-500" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {summaryLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <SparklesIcon className="w-4 h-4" />}
                                    {summaryLoading ? 'Processing…' : 'Synthesize Squad Data'}
                                </span>
                            </Button>
                            <AIResultBox result={summaryResult} loading={summaryLoading} />
                        </div>
                    </AICard>

                    {/* Approval Recommendation */}
                    <AICard
                        title="Command Verdict"
                        icon={ShieldCheckIcon}
                        description="Entity Approval Recommendation"
                        delay={0.2}
                    >
                        <form onSubmit={handleApprovalRec} className="space-y-4">
                            <input
                                className={inputCls}
                                type="number"
                                placeholder="Entity ID (Reference Matrix)"
                                value={recExpenseId}
                                onChange={e => setRecExpenseId(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 group/btn"
                                disabled={recLoading || !recExpenseId}
                            >
                                <span className="flex items-center justify-center gap-3 text-emerald-600">
                                    {recLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ShieldCheckIcon className="w-4 h-4" />}
                                    {recLoading ? 'Calculating…' : 'Request Verdict'}
                                </span>
                            </Button>
                        </form>
                        <AIResultBox result={recResult} loading={recLoading} />
                    </AICard>

                    {/* Risk Score */}
                    <AICard
                        title="Threat Matrix"
                        icon={ExclamationTriangleIcon}
                        description="Anomaly & Risk Scoring Protocol"
                        delay={0.3}
                    >
                        <form onSubmit={handleRiskScore} className="space-y-4">
                            <input
                                className={inputCls}
                                type="number"
                                placeholder="Entity Reference Code"
                                value={riskExpenseId}
                                onChange={e => setRiskExpenseId(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 group/btn"
                                disabled={riskLoading || !riskExpenseId}
                            >
                                <span className="flex items-center justify-center gap-3 text-amber-500">
                                    {riskLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ExclamationTriangleIcon className="w-4 h-4" />}
                                    {riskLoading ? 'Scanning…' : 'Execute Risk Scan'}
                                </span>
                            </Button>
                        </form>
                        <AIResultBox result={riskResult} loading={riskLoading} />
                    </AICard>

                    {/* Voice Hub */}
                    <AICard
                        title="Voice Uplink"
                        icon={MicrophoneIcon}
                        description="Auditory Command Vector Active"
                        delay={0.4}
                    >
                        <div className="space-y-6">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                Direct voice integration integrated into the high-level approval grid. Protocol hints:
                            </p>
                            <div className="grid gap-3">
                                {[
                                    'Authorize entity 15',
                                    'Decline entity 22 — Reason: Receipt Missing',
                                    'Squad pending telemetry report',
                                    'Monthly squad volume summary'
                                ].map((hint, i) => (
                                    <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest italic">{hint}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AICard>
                </div>
            </div>
        </PageTransition>
    );
};

export default ManagerAIDashboard;
