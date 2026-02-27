import React from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import VoiceAssistant from '../../components/ai/VoiceAssistant';

// ── Role-specific command guide ─────────────────────────────────────────────
const ROLE_COMMANDS = {
    USER: [
        { intent: 'ADD_EXPENSE', example: '"Add expense 1500 for travel"', desc: 'Pre-fill the expense form' },
        { intent: 'SHOW_EXPENSES', example: '"Show my pending expenses"', desc: 'Filter your expense list' },
        { intent: 'CHECK_STATUS', example: '"What is my approval status?"', desc: 'Count pending/approved/rejected' },
        { intent: 'SPENDING_SUMMARY', example: '"How much have I spent this month?"', desc: 'AI spending insight' },
    ],
    MANAGER: [
        { intent: 'APPROVE_EXPENSE', example: '"Approve expense 42"', desc: 'Approve a specific expense' },
        { intent: 'REJECT_EXPENSE', example: '"Reject expense 15 reason duplicate"', desc: 'Reject with reason' },
        { intent: 'TEAM_SUMMARY', example: '"Summarize team spending"', desc: 'Team budget & spend overview' },
        { intent: 'TEAM_QUERY', example: '"Show pending team expenses"', desc: 'Filter team expense list' },
    ],
    ADMIN: [
        { intent: 'AUDIT_REPORT', example: '"Show audit report"', desc: 'View last 20 audit log entries' },
        { intent: 'FRAUD_ALERTS', example: '"Show fraud alerts"', desc: 'Run anomaly detection' },
        { intent: 'BUDGET_QUERY', example: '"Show budget status"', desc: 'All team budget statuses' },
        { intent: 'VENDOR_ROI', example: '"Vendor ROI analysis"', desc: 'Vendor spend & cost-saving insights' },
    ],
};

// Intent badge colour map (must also match VoiceAssistant.jsx)
const BADGE = {
    ADD_EXPENSE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    SHOW_EXPENSES: 'bg-blue-500/20   text-blue-300   border-blue-500/40',
    CHECK_STATUS: 'bg-sky-500/20    text-sky-300    border-sky-500/40',
    SPENDING_SUMMARY: 'bg-amber-500/20  text-amber-300  border-amber-500/40',
    APPROVE_EXPENSE: 'bg-green-500/20  text-green-300  border-green-500/40',
    REJECT_EXPENSE: 'bg-red-500/20    text-red-300    border-red-500/40',
    TEAM_SUMMARY: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    TEAM_QUERY: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    AUDIT_REPORT: 'bg-pink-500/20   text-pink-300   border-pink-500/40',
    FRAUD_ALERTS: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    BUDGET_QUERY: 'bg-cyan-500/20   text-cyan-300   border-cyan-500/40',
    VENDOR_ROI: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
};

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const VoiceAssistantPage = () => {
    const { user } = useAuthStore();
    const role = user?.role || 'USER';
    const commands = ROLE_COMMANDS[role] || ROLE_COMMANDS.USER;

    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1530 40%, #0a1525 70%, #0a0f1e 100%)',
            }}
        >
            {/* Background orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
                <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
                    style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* ── Page header ──────────────────────────────────────────────────── */}
                <motion.div
                    initial="hidden" animate="visible"
                    variants={fadeUp} transition={{ duration: 0.5 }}
                    className="text-center space-y-3"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border"
                        style={{
                            background: 'rgba(124,58,237,0.15)',
                            borderColor: 'rgba(124,58,237,0.3)',
                            color: '#a78bfa'
                        }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                        AI Voice Interface • {role}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                        Voice{' '}
                        <span style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Control
                        </span>
                    </h1>
                    <p className="text-slate-400 text-base max-w-xl mx-auto">
                        Speak naturally. The AI understands your intent and executes it instantly.
                        Powered by Phi-3 with keyword fallback for zero-downtime reliability.
                    </p>
                </motion.div>

                {/* ── Main 2-column layout ─────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Left: Voice panel (takes 3/5 width) */}
                    <motion.div
                        className="lg:col-span-3"
                        initial="hidden" animate="visible"
                        variants={fadeUp} transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        <div
                            className="rounded-2xl border p-6 h-full"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderColor: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            {/* Panel header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zm-1 16.93V20H9v2h6v-2h-2v-2.07A8 8 0 0120 11h-2a6 6 0 01-12 0H4a8 8 0 007 7.93z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg leading-tight">Voice Assistant</h2>
                                    <p className="text-slate-400 text-xs">Click mic or use a command below</p>
                                </div>
                                {/* Powered by badge */}
                                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                                    style={{ background: 'rgba(6,182,212,0.1)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.2)' }}>
                                    <span>✨</span> Phi-3
                                </div>
                            </div>
                            <VoiceAssistant compact={false} />
                        </div>
                    </motion.div>

                    {/* Right: Commands guide (takes 2/5 width) */}
                    <motion.div
                        className="lg:col-span-2"
                        initial="hidden" animate="visible"
                        variants={fadeUp} transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div
                            className="rounded-2xl border p-6 h-full"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderColor: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <div className="flex items-center gap-2 mb-5">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Command Guide</h3>
                            </div>
                            <div className="space-y-3">
                                {commands.map((cmd, i) => (
                                    <motion.div
                                        key={cmd.intent}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 + i * 0.07 }}
                                        className="rounded-xl border p-3"
                                        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${BADGE[cmd.intent] || 'bg-gray-500/20 text-gray-300 border-gray-500/40'}`}>
                                                {cmd.intent}
                                            </span>
                                        </div>
                                        <p className="text-white text-xs font-medium mb-0.5">{cmd.example}</p>
                                        <p className="text-slate-500 text-[11px]">{cmd.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Fail-safe note */}
                            <div className="mt-4 rounded-xl p-3 flex items-start gap-2"
                                style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
                                <svg className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-yellow-300 text-[11px] font-semibold">Fail-safe enabled</p>
                                    <p className="text-yellow-400/70 text-[10px] mt-0.5">If AI is offline, keyword parser activates automatically.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── Flow diagram ─────────────────────────────────────────────────── */}
                <motion.div
                    initial="hidden" animate="visible"
                    variants={fadeUp} transition={{ delay: 0.3, duration: 0.5 }}
                    className="rounded-2xl border p-6"
                    style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">How It Works</h3>
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { step: '1', label: 'Speak', icon: '🎙', colour: '#7c3aed' },
                            { step: '2', label: 'Speech → Text', icon: '📝', colour: '#4f46e5' },
                            { step: '3', label: 'Intent Detection', icon: '🤖', colour: '#0891b2' },
                            { step: '4', label: 'Role Check', icon: '🔐', colour: '#059669' },
                            { step: '5', label: 'Execute Action', icon: '⚡', colour: '#d97706' },
                            { step: '6', label: 'Speak Response', icon: '🔊', colour: '#7c3aed' },
                        ].map((item, i, arr) => (
                            <React.Fragment key={item.step}>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                                    style={{ background: `${item.colour}15`, border: `1px solid ${item.colour}30` }}>
                                    <span className="text-base">{item.icon}</span>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest" style={{ color: item.colour }}>Step {item.step}</p>
                                        <p className="text-white text-xs font-semibold">{item.label}</p>
                                    </div>
                                </div>
                                {i < arr.length - 1 && (
                                    <svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default VoiceAssistantPage;
