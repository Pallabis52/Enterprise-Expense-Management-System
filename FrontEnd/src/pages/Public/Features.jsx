import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Cpu, BarChart3, Database, Lock, Globe, Activity, Terminal, LayoutGrid } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import PublicNavbar from './PublicNavbar';

const Features = () => {
    return (
        <PageTransition className="bg-[#05070a] min-h-screen text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                {/* Background Subtle Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-600/5 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-8">
                            <LayoutGrid className="w-4 h-4 text-indigo-400" />
                            <span className="text-[9px] font-black tracking-[4px] uppercase text-indigo-300">System Modules x86</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">
                            CORE <span className="text-indigo-500">FEATURES.</span>
                        </h1>
                        <p className="text-white/40 max-w-2xl font-semibold leading-relaxed">
                            A modular architecture engineered for total financial dominance. Every component is optimized for sub-millisecond execution and cryptographic certainty.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Terminal,
                                title: 'Neural Auditing',
                                desc: 'Real-time forensic analysis of transaction streams using lattice-based detection models.',
                                status: 'OPTIMAL'
                            },
                            {
                                icon: Cpu,
                                title: 'Velocity Engine',
                                desc: 'Sub-nanosecond processing of global expense batches with zero-latency settlement.',
                                status: 'ACTIVE'
                            },
                            {
                                icon: Database,
                                title: 'Unified Ledger',
                                desc: 'A immutable, cryptographic source of truth for all enterprise financial telemetry.',
                                status: 'SYNCED'
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative p-8 bg-white/[0.01] border border-white/5 rounded-3xl hover:bg-white/[0.03] transition-all cursor-default overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <feature.icon className="w-24 h-24" />
                                </div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/10 rounded-xl flex items-center justify-center mb-6">
                                        <feature.icon className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <h3 className="text-xl font-black italic tracking-tight uppercase">{feature.title}</h3>
                                        <span className="text-[8px] font-black bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md tracking-widest">{feature.status}</span>
                                    </div>
                                    <p className="text-sm text-white/30 font-bold leading-relaxed">{feature.desc}</p>
                                </div>
                                <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 group-hover:w-full transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Technical Specification Section */}
                    <div className="mt-32 p-12 bg-white/[0.02] border border-white/10 rounded-[48px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px]" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-black italic mb-8 tracking-tighter">DATA INTEGRITY PROTOCOL</h2>
                                <div className="space-y-6">
                                    {[
                                        'AES-256-GCM Hardware Acceleration',
                                        'Multi-region Hot-Swap Redundancy',
                                        'Zero-Knowledge Proof Verification',
                                        'AI-Driven Anomaly Containment'
                                    ].map((spec, i) => (
                                        <div key={i} className="flex items-center gap-4 group/item">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover/item:scale-150 transition-transform" />
                                            <span className="text-sm font-black text-white/40 tracking-widest uppercase italic group-hover/item:text-white transition-colors">{spec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative flex items-center justify-center">
                                {/* Technical SVG Visual */}
                                <svg viewBox="0 0 200 200" className="w-48 h-48">
                                    <motion.circle
                                        cx="100" cy="100" r="80"
                                        fill="none" stroke="rgba(99, 102, 241, 0.1)"
                                        strokeWidth="1" strokeDasharray="5 5"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    />
                                    <motion.path
                                        d="M 100 20 L 100 180 M 20 100 L 180 100"
                                        stroke="rgba(99, 102, 241, 0.2)"
                                        strokeWidth="0.5"
                                    />
                                    <motion.rect
                                        x="60" y="60" width="80" height="80"
                                        fill="none" stroke="#4f46e5"
                                        strokeWidth="1.5"
                                        animate={{
                                            rotate: [0, 90, 180, 270, 360],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 opacity-50 bg-[#05070a]">
                <div className="max-w-7xl mx-auto px-6 text-center text-[10px] font-black tracking-[4px] text-white/20 uppercase">
                    © 2026 ANTIGRAVITY SYSTEMS. ALL CORE MODULES VERIFIED.
                </div>
            </footer>
        </PageTransition>
    );
};

export default Features;
