import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Plane, Map, Database, Shield, Zap, Activity, Globe2 } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import PublicNavbar from './PublicNavbar';

const Global = () => {
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
                        className="flex flex-col items-center text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-8">
                            <Globe2 className="w-4 h-4 text-indigo-400" />
                            <span className="text-[9px] font-black tracking-[4px] uppercase text-indigo-300">Orbital Sync: 100% Verified</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">
                            WITHOUT <span className="text-indigo-500">BORDERS.</span>
                        </h1>
                        <p className="text-white/40 max-w-2xl font-semibold leading-relaxed uppercase tracking-wider text-xs">
                            Financial borders are a legacy primitive. We've built an atomic settlement layer that spans 180+ regions with instantaneous cryptographic finality.
                        </p>
                    </motion.div>

                    {/* Global Data Flow Visualization */}
                    <div className="relative mb-32 h-[400px] lg:h-[600px] flex items-center justify-center overflow-hidden rounded-[80px] bg-white/[0.01] border border-white/5 group">
                        {/* Static/Noise overlay */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

                        {/* Orbital Grid System (SVG) */}
                        <svg viewBox="0 0 800 500" className="w-full h-full opacity-40">
                            {/* Perspective Grid Background */}
                            {Array.from({ length: 12 }).map((_, i) => (
                                <motion.line
                                    key={i}
                                    x1={400} y1={250}
                                    x2={800 * Math.cos(i * Math.PI / 6) + 400}
                                    y2={800 * Math.sin(i * Math.PI / 6) + 250}
                                    stroke="rgba(99, 102, 241, 0.1)"
                                    strokeWidth="0.5"
                                />
                            ))}

                            {/* Orbital Path Connections */}
                            <motion.path
                                d="M 100 250 Q 400 50 700 250 Q 400 450 100 250"
                                fill="none" stroke="rgba(99, 102, 241, 0.3)"
                                strokeWidth="2"
                                animate={{ pathLength: [0, 1, 0] }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                strokeDasharray="10 10"
                            />

                            {/* Floating "Cores" (Nodes) */}
                            {[
                                { x: 100, y: 250, label: 'HKG_01' },
                                { x: 400, y: 50, label: 'LON_X' },
                                { x: 700, y: 250, label: 'NYC_CORE' },
                                { x: 400, y: 450, label: 'SGP_NODE' }
                            ].map((node, i) => (
                                <motion.g key={i}>
                                    <circle cx={node.x} cy={node.y} r="6" fill="#4f46e5" />
                                    <circle cx={node.x} cy={node.y} r="12" fill="none" stroke="#4f46e5" strokeWidth="1" className="animate-pulse" />
                                    <text x={node.x + 15} y={node.y + 5} className="text-[10px] font-black fill-white/20 tracking-widest">{node.label}</text>
                                </motion.g>
                            ))}
                        </svg>

                        {/* Center HUD Information */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-[#05070a]/60 backdrop-blur-3xl p-10 lg:p-16 border border-white/10 rounded-[64px] shadow-2xl"
                            >
                                <div className="text-[10px] font-black text-indigo-400 tracking-[8px] mb-4 uppercase">Global Connectivity</div>
                                <div className="text-4xl md:text-6xl font-black italic tracking-tighter">180+ NODES</div>
                                <div className="mt-8 flex gap-3 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: ['0%', '100%'] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="h-full bg-indigo-500"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Regional Detail Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Atomic Settlement', text: 'Multi-currency liquidity across 40+ currencies without inter-bank latency.' },
                            { title: 'Tax Nexus Integration', detail: 'Automated VAT/GST compliance in 180+ regions with instantaneous auditing.' },
                            { title: 'Distributed Sovereignty', desc: 'Local data sovereignty protocols ensure regional compliance globally.' }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 bg-white/[0.01] border border-white/5 rounded-[48px] group hover:bg-white/[0.03] transition-all cursor-default"
                            >
                                <Globe className="w-10 h-10 text-indigo-400 mb-8 group-hover:rotate-12 transition-transform" />
                                <h3 className="text-xl font-black italic mb-4 tracking-tight uppercase italic">{card.title}</h3>
                                <p className="text-sm text-white/20 font-bold leading-relaxed">{card.text || card.detail || card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 opacity-50 bg-[#05070a]">
                <div className="max-w-7xl mx-auto px-6 text-center text-[10px] font-black tracking-[4px] text-white/20 uppercase">
                    © 2026 ANTIGRAVITY GLOBAL. THE WORLD IS ONE NODE.
                </div>
            </footer>
        </PageTransition>
    );
};

export default Global;
