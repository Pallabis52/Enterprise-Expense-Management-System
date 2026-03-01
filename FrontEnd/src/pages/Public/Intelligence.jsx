import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Brain, Zap, Activity, Eye, Search, Network } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import PublicNavbar from './PublicNavbar';

const Intelligence = () => {
    return (
        <PageTransition className="bg-[#05070a] min-h-screen text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                {/* Background Subtle Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-cyan-600/5 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center mb-24"
                    >
                        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full mb-8">
                            <Brain className="w-4 h-4 text-cyan-400" />
                            <span className="text-[9px] font-black tracking-[4px] uppercase text-cyan-300">Neural Sync v9.2</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">
                            SYNTHETIC <span className="text-cyan-400">INTEL.</span>
                        </h1>
                        <p className="text-white/40 max-w-2xl font-semibold leading-relaxed uppercase tracking-wider text-xs">
                            Beyond automation. Beyond insight. We've engineered a financial consciousness that predicts market volatility before it manifests.
                        </p>
                    </motion.div>

                    {/* AI Process Visualization */}
                    <div className="relative mb-32 p-1 bg-gradient-to-br from-cyan-500/20 via-transparent to-indigo-500/20 rounded-[60px]">
                        <div className="bg-[#05070a]/80 backdrop-blur-3xl rounded-[59px] p-12 lg:p-24 overflow-hidden relative border border-white/5">
                            {/* Background Grid Node Pulse */}
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }} />

                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                                <div className="space-y-12">
                                    {[
                                        { title: 'Predictive Forensics', detail: 'Analyzing 40k+ data points per expense to neutralize fraud vectors instantly.' },
                                        { title: 'Neural Optimization', detail: 'Autonomous cost-cutting logic that adapts to global market shifts in real-time.' },
                                        { title: 'Contextual Reasoning', detail: 'Large Language Models trained on enterprise fiscal policy for zero-error advisory.' }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: -20, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.2 }}
                                            className="group"
                                        >
                                            <div className="text-[10px] font-black text-cyan-400 tracking-[5px] mb-3 uppercase">Module_0{i + 1}</div>
                                            <h3 className="text-2xl font-black italic mb-4 tracking-tight group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                                            <p className="text-sm text-white/30 font-bold leading-relaxed max-w-sm">{item.detail}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-center">
                                    <div className="relative flex items-center justify-center">
                                        {/* Synthetic Brain SVG */}
                                        <svg viewBox="0 0 200 200" className="w-64 h-64 lg:w-96 lg:h-96">
                                            <defs>
                                                <filter id="cyanGlow">
                                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                </filter>
                                            </defs>

                                            {/* Inner Nodes */}
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <motion.circle
                                                    key={i}
                                                    cx={100 + 40 * Math.cos(i * Math.PI / 4)}
                                                    cy={100 + 40 * Math.sin(i * Math.PI / 4)}
                                                    r="4"
                                                    fill="#06b6d4"
                                                    animate={{
                                                        opacity: [0.2, 1, 0.2],
                                                        scale: [1, 1.5, 1],
                                                        filter: ['none', 'url(#cyanGlow)', 'none']
                                                    }}
                                                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                                                />
                                            ))}

                                            {/* Connections */}
                                            <motion.path
                                                d="M 100 60 Q 140 100 100 140 Q 60 100 100 60"
                                                fill="none" stroke="rgba(6, 182, 212, 0.2)"
                                                strokeWidth="1.5"
                                                animate={{ strokeDashoffset: [0, 100] }}
                                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                                strokeDasharray="5 5"
                                            />

                                            <motion.circle
                                                cx="100" cy="100" r="10"
                                                fill="#06b6d4"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </svg>
                                        {/* Dynamic HUD Overlays */}
                                        <div className="absolute top-0 right-0 p-6 border-t font-mono text-[8px] text-cyan-400">
                                            CORTEX_LOAD: 98.4%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: 'Latency', value: '0.04ms' },
                            { label: 'Precision', value: '99.98%' },
                            { label: 'Neural Nodes', value: '4.2k' },
                            { label: 'Security level', value: 'QS-01' }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-[10px] font-black text-white/20 tracking-[4px] mb-3 uppercase">{stat.label}</div>
                                <div className="text-3xl font-black text-white italic group-hover:text-cyan-400 transition-colors uppercase">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 opacity-50 bg-[#05070a]">
                <div className="max-w-7xl mx-auto px-6 text-center text-[10px] font-black tracking-[4px] text-white/20 uppercase">
                    © 2026 ANTIGRAVITY SYNTHETICS. COGNITIVE COMPLIANCE GUARANTEED.
                </div>
            </footer>
        </PageTransition>
    );
};

export default Intelligence;
