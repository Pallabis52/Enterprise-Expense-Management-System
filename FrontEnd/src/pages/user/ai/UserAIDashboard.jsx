import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getSpendingInsights,
    categorizeExpense,
    explainRejection
} from '../../../services/aiService';
import PageTransition from '../../../components/layout/PageTransition';
import {
    CpuChipIcon,
    SparklesIcon,
    TagIcon,
    ShieldExclamationIcon,
    MicrophoneIcon,
    ArrowPathIcon,
    BoltIcon,
    BeakerIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../../utils/helpers';
import Button from '../../../components/ui/Button';

// ── Shared sub-components ────────────────────────────────────────────────────

const AICard = ({ title, icon: Icon, description, children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: "easeOut" }}
        className="relative group h-full"
    >
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
        <div className="relative h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-8 border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-5 mb-8">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-lg shadow-indigo-500/5 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{title}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">{description}</p>
                </div>
            </div>
            <div className="flex-1 space-y-6">{children}</div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none" />
        </div>
    </motion.div>
);

const AIResultBox = ({ result, loading, onRetry }) => {
    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12 gap-5 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 mt-6"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full"
                        />
                        <SparklesIcon className="w-5 h-5 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] animate-pulse">Synthesizing Data…</span>
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
                            : "bg-indigo-500/5 border-indigo-500/20 text-slate-700 dark:text-slate-200"
                    )}
                >
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                        <BoltIcon className="w-5 h-5" />
                    </div>
                    {result.fallback && (
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                <ShieldExclamationIcon className="w-4 h-4" />
                                AI Unavailable
                            </p>
                            {onRetry && (
                                <button
                                    onClick={onRetry}
                                    className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all"
                                >
                                    <ArrowPathIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                    <p className="text-sm font-medium leading-relaxed">{result.result}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-indigo-500/10 pt-4 opacity-50">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{result.model || 'AI Engine'}</span>
                        </div>
                        {result.processingMs && (
                            <span className="text-[9px] font-black uppercase tracking-widest">
                                {result.processingMs >= 1000 ? `${(result.processingMs / 1000).toFixed(1)}s` : `${result.processingMs}ms`} Response Time
                            </span>
                        )}
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const UserAIDashboard = () => {
    const [insightsResult, setInsightsResult] = useState(null);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [catState, setCatState] = useState({ title: '', desc: '', amount: '' });
    const [catResult, setCatResult] = useState(null);
    const [catLoading, setCatLoading] = useState(false);
    const [rejectId, setRejectId] = useState('');
    const [rejectResult, setRejectResult] = useState(null);
    const [rejectLoading, setRejectLoading] = useState(false);

    const handleInsights = useCallback(async () => {
        setInsightsLoading(true);
        setInsightsResult(null);
        try {
            const data = await getSpendingInsights();
            setInsightsResult(data);
        } catch {
            setInsightsResult({ result: 'AI is currently unavailable. Please try again later.', fallback: true });
        } finally {
            setInsightsLoading(false);
        }
    }, []);

    const handleCategorize = useCallback(async (e) => {
        e.preventDefault();
        setCatLoading(true);
        setCatResult(null);
        try {
            const data = await categorizeExpense(catState.title, catState.desc, parseFloat(catState.amount) || 0);
            setCatResult(data);
        } catch {
            setCatResult({ result: 'Categorization failed. Please try again.', fallback: true });
        } finally {
            setCatLoading(false);
        }
    }, [catState]);

    const handleExplainRejection = useCallback(async (e) => {
        e.preventDefault();
        if (!rejectId.trim()) return;
        setRejectLoading(true);
        setRejectResult(null);
        try {
            const data = await explainRejection(rejectId);
            setRejectResult(data);
        } catch {
            setRejectResult({ result: 'Could not load rejection details for the given ID.', fallback: true });
        } finally {
            setRejectLoading(false);
        }
    }, [rejectId]);

    const inputCls = "w-full px-6 py-4 rounded-2xl bg-white/20 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all";

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto space-y-16 pb-24 px-4 sm:px-6">

                {/* ── Neural Interface Header ── */}
                <div className="relative py-8">
                    <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute -top-[50%] -left-[10%] w-[80%] h-[150%] bg-indigo-500/20 blur-[120px] rounded-full"
                        />
                    </div>

                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-6"
                            >
                                <div className="p-6 rounded-[32px] bg-slate-900 dark:bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 relative group">
                                    <CpuChipIcon className="w-12 h-12 relative z-10" />
                                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
                                </div>
                                <div>
                                    <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Aether</h1>
                                    <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-3">
                                        <SparklesIcon className="w-4 h-4 animate-spin-slow" />
                                        AI Assistant
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex gap-4">
                            <div className="px-6 py-4 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-white/10 flex items-center gap-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-none">Core Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Feature Matrix Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Feature 1: Spending Insights */}
                    <AICard
                        title="Spending Insights"
                        icon={BeakerIcon}
                        description="Analyze your spending patterns"
                        delay={0.1}
                    >
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Analyze your spending data to find patterns and potential savings.
                        </p>
                        <div className="pt-4 flex flex-col">
                            <Button
                                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl group/btn overflow-hidden relative"
                                onClick={handleInsights}
                                disabled={insightsLoading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:scale-105 transition-transform duration-500" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {insightsLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <SparklesIcon className="w-4 h-4" />}
                                    {insightsLoading ? 'Loading…' : 'Get Spending Insights'}
                                </span>
                            </Button>
                            <AIResultBox result={insightsResult} loading={insightsLoading} />
                        </div>
                    </AICard>

                    {/* Feature 2: Smart Categorize */}
                    <AICard
                        title="Categorize Expense"
                        icon={TagIcon}
                        description="Automatically find the right category"
                        delay={0.2}
                    >
                        <form onSubmit={handleCategorize} className="space-y-4">
                            <input
                                className={inputCls}
                                placeholder="Expense Title (e.g. Taxi)"
                                value={catState.title}
                                onChange={e => setCatState({ ...catState, title: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    className={inputCls}
                                    placeholder="Description (optional)"
                                    value={catState.desc}
                                    onChange={e => setCatState({ ...catState, desc: e.target.value })}
                                />
                                <input
                                    className={inputCls}
                                    type="number"
                                    placeholder="Amount"
                                    value={catState.amount}
                                    onChange={e => setCatState({ ...catState, amount: e.target.value })}
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 group/btn"
                                disabled={catLoading || !catState.title}
                            >
                                <span className="flex items-center justify-center gap-3 text-indigo-500">
                                    {catLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <TagIcon className="w-4 h-4" />}
                                    {catLoading ? 'Categorizing…' : 'Suggest Category'}
                                </span>
                            </Button>
                        </form>
                        <AIResultBox result={catResult} loading={catLoading} />
                    </AICard>

                    {/* Feature 3: Explain Rejection */}
                    <AICard
                        title="Explain Rejection"
                        icon={ShieldExclamationIcon}
                        description="Understand why an expense was rejected"
                        delay={0.3}
                    >
                        <form onSubmit={handleExplainRejection} className="space-y-4">
                            <input
                                className={inputCls}
                                type="number"
                                placeholder="Expense ID"
                                value={rejectId}
                                onChange={e => setRejectId(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 group/btn"
                                disabled={rejectLoading || !rejectId}
                            >
                                <span className="flex items-center justify-center gap-3 text-emerald-500">
                                    {rejectLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ShieldExclamationIcon className="w-4 h-4" />}
                                    {rejectLoading ? 'Loading…' : 'Explain Rejection'}
                                </span>
                            </Button>
                        </form>
                        <AIResultBox result={rejectResult} loading={rejectLoading} />
                    </AICard>

                    {/* Voice Interface Hub */}
                    <AICard
                        title="Voice Commands"
                        icon={MicrophoneIcon}
                        description="Use your voice to interact with the system"
                        delay={0.4}
                    >
                        <div className="space-y-6">
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Speak commands to quickly add expenses and navigate the system.
                            </p>
                            <div className="grid gap-3">
                                {[
                                    'Show pending expenses',
                                    'Show rejected expenses',
                                    'Add taxi expense - 500',
                                    'Show spending summary'
                                ].map((hint, i) => (
                                    <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 group-hover:bg-indigo-500/10 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
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

export default UserAIDashboard;
