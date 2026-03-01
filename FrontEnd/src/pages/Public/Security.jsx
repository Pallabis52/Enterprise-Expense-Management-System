import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, ShieldCheck, Key, Fingerprint, Database, Zap } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import PublicNavbar from './PublicNavbar';

const Security = () => {
    return (
        <PageTransition className="bg-[#05070a] min-h-screen text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Visual Background: Defensive Lattice */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)',
                    backgroundSize: '100px 100px',
                    transform: 'rotate(15deg) scale(2)'
                }} />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center mb-24"
                    >
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-8">
                            <ShieldCheck className="w-4 h-4 text-indigo-400" />
                            <span className="text-[9px] font-black tracking-[4px] uppercase text-indigo-300">QS-LEVEL Shielding ACTIVE</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">
                            POST-QUANTUM <span className="text-indigo-500">DEFENSE.</span>
                        </h1>
                        <p className="text-white/40 max-w-2xl font-semibold leading-relaxed uppercase tracking-wider text-xs">
                            In an era of computational warfare, we've built a vault that doesn't just protect data—it encrypts the very fabric of financial intent.
                        </p>
                    </motion.div>

                    {/* Shield Visualization Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
                        <div className="relative aspect-square max-w-[500px] mx-auto flex items-center justify-center">
                            {/* Animated Defense Rings */}
                            {[1, 2, 3].map((ring) => (
                                <motion.div
                                    key={ring}
                                    animate={{
                                        rotate: ring % 2 === 0 ? 360 : -360,
                                        scale: [1, 1.05, 1],
                                        opacity: [0.1 * ring, 0.3 * ring, 0.1 * ring]
                                    }}
                                    transition={{ duration: 10 * ring, repeat: Infinity, ease: "linear" }}
                                    className={`absolute inset-${ring * 8} border-[2px] border-indigo-500/${ring * 20} rounded-full ${ring === 2 ? 'border-dashed' : ''}`}
                                />
                            ))}

                            {/* Center Shield Asset */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative z-10 w-[300px] h-[300px] bg-black/40 backdrop-blur-3xl border border-indigo-500/30 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(79,70,229,0.2)]"
                            >
                                <svg viewBox="0 0 100 100" className="w-40 h-40">
                                    <motion.path
                                        d="M 50 10 L 85 25 L 85 60 C 85 85 50 95 50 95 C 50 95 15 85 15 60 L 15 25 Z"
                                        fill="none"
                                        stroke="#4f46e5"
                                        strokeWidth="2"
                                        animate={{ pathLength: [0, 1] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    <Lock className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </svg>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Key, title: 'Lattice Crypto', detail: 'Mathematically shielded against future quantum-scale attacks.' },
                                { icon: Fingerprint, title: 'Biometric Mesh', detail: 'Zero-trust multi-factor authentication for every high-stakes move.' },
                                { icon: Eye, title: 'Zero-Knowledge', desc: 'Verify without disclosure. Your raw financial data stays secret.' },
                                { icon: Database, title: 'Shard_Shield', desc: 'Distributed data sharding across multiple orbital node centers.' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 bg-white/[0.01] border border-white/5 rounded-[40px] group hover:bg-white/[0.03] transition-all cursor-default"
                                >
                                    <item.icon className="w-8 h-8 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-xl font-black italic mb-4 uppercase tracking-tighter">{item.title}</h3>
                                    <p className="text-sm text-white/20 font-bold leading-relaxed">{item.detail || item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Threat Analysis Simulation Area */}
                    <div className="bg-indigo-950/10 border border-indigo-500/20 rounded-[48px] p-12 lg:p-20 relative overflow-hidden group backdrop-blur-3xl">
                        <div className="mb-12 flex items-center justify-between">
                            <h2 className="text-3xl font-black italic tracking-tighter italic">NEURAL THREAT MITIGATION</h2>
                            <div className="flex gap-4">
                                <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-md text-[9px] font-black text-green-400 tracking-[3px] uppercase">
                                    Status: Clear
                                </div>
                                <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[9px] font-black text-indigo-400 tracking-[3px] uppercase">
                                    Protocol: Active
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-12">
                            {[
                                { label: 'Intrusion Counter', value: '42.1k / hr' },
                                { label: 'Bypass attempts', value: '0 DEADLY' },
                                { label: 'Audit Velocity', value: '0.04ms' }
                            ].map((stat, i) => (
                                <div key={i} className="group">
                                    <div className="text-[10px] font-black text-white/20 tracking-[4px] mb-3 uppercase italic">{stat.label}</div>
                                    <div className="text-3xl font-black text-indigo-400 italic group-hover:text-white transition-colors uppercase tracking-tight">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 opacity-50 bg-[#05070a]">
                <div className="max-w-7xl mx-auto px-6 text-center text-[10px] font-black tracking-[4px] text-white/20 uppercase">
                    © 2026 ANTIGRAVITY SECURITY. ALL DATA ENCRYPTED AT REST AND IN FLIGHT.
                </div>
            </footer>
        </PageTransition>
    );
};

export default Security;
