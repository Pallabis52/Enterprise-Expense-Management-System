import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Cpu, Rocket, ArrowRight, Activity, Database, Fingerprint, Lock, Globe } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import PublicNavbar from './PublicNavbar';

const LandingPage = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();

    // Parallax and scroll effects
    const backgroundY = useTransform(scrollY, [0, 500], [0, 30]);

    return (
        <PageTransition className="bg-[#05070a] min-h-screen text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-20">
                {/* Image-Free Cinematic Background: "Quantum Grid Nexus" */}
                <motion.div
                    style={{ y: backgroundY }}
                    className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
                >
                    {/* Deep Space Gradient Center Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] opacity-40" />

                    {/* Perspective Grid Line System (Pure CSS) */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px), 
                                          linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px)`,
                        backgroundSize: '80px 80px',
                        perspective: '1000px',
                        transform: 'rotateX(60deg) translateY(-150px) scale(2)',
                        maskImage: 'linear-gradient(to bottom, white, transparent)'
                    }} />

                    {/* Infinite Floating Data Nodes (SVG Particle Mesh) */}
                    <svg className="absolute inset-0 w-full h-full opacity-20">
                        <pattern id="dotPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill="#4f46e5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#dotPattern)" />

                        {/* Animated Connections */}
                        <motion.path
                            d="M 100 200 L 400 500 L 800 300"
                            stroke="rgba(99, 102, 241, 0.2)"
                            strokeWidth="1"
                            fill="none"
                            animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />
                    </svg>
                </motion.div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Mission Directives */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-3xl"
                        >
                            <Activity className="w-4 h-4 text-indigo-400" />
                            <span className="text-[9px] font-black tracking-[4px] uppercase text-indigo-300">Operational Intel v6.0</span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-10 text-white">
                            DEFY <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 animate-gradient-x underline decoration-indigo-500/20">GRAVITY.</span>
                        </h1>

                        <p className="text-lg text-white/50 mb-12 max-w-lg leading-relaxed font-semibold">
                            Enterprise expense forensics at the scale of thought. Zero-latency optimization, cryptographic auditing, and neural capital flow.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto bg-white text-black font-black uppercase text-[11px] tracking-[5px] px-12 py-5 rounded-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-xl"
                            >
                                Initiate Protocol
                                <Rocket className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto flex items-center justify-center gap-4 text-white/40 hover:text-white font-black uppercase text-[10px] tracking-[6px] transition-all group"
                            >
                                Core Access
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform text-indigo-500" />
                            </button>
                        </div>

                        {/* Tactical Status Grid */}
                        <div className="mt-16 grid grid-cols-3 gap-8 border-l-2 border-indigo-500/50 pl-8 py-4 bg-white/[0.01] rounded-r-2xl max-w-md">
                            {[
                                { id: 'FLUX', status: 'Optimal' },
                                { id: 'SYNC', status: 'Active' },
                                { id: 'LOAD', status: '0.2ms' }
                            ].map((stat) => (
                                <div key={stat.id} className="group cursor-default">
                                    <div className="text-[9px] font-black text-white/20 tracking-[4px] mb-1">{stat.id}</div>
                                    <div className="text-sm font-black text-white/80 group-hover:text-indigo-400 transition-colors uppercase italic">{stat.status}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: "The Neural Financial Core" */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative aspect-square w-full max-w-[500px] mx-auto flex items-center justify-center">
                            {/* Orbiting HUD Rings */}
                            {[1, 2].map((ring) => (
                                <motion.div
                                    key={ring}
                                    animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                                    transition={{ duration: 15 * ring, repeat: Infinity, ease: "linear" }}
                                    className={`absolute inset-${ring * 10} border-[1px] border-indigo-500/${ring * 10} rounded-full ${ring === 2 ? 'border-dashed' : ''}`}
                                />
                            ))}

                            {/* Center Core HUD Asset */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative z-10 w-[350px] h-[450px] bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[48px] p-8 overflow-hidden shadow-2xl group"
                            >
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay pointer-events-none" />

                                <div className="h-full flex flex-col justify-between relative z-20">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[9px] font-black text-indigo-400 tracking-[4px]">NEURAL_CORE_X9</span>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                                <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Active</span>
                                            </div>
                                        </div>
                                        <Database className="w-5 h-5 text-indigo-400/50" />
                                    </div>

                                    {/* Animated Vector Graphics Area */}
                                    <div className="flex-1 flex items-center justify-center p-6">
                                        <svg viewBox="0 0 200 200" className="w-40 h-40">
                                            <motion.path
                                                d="M 100 40 L 150 70 L 150 130 L 100 160 L 50 130 L 50 70 Z"
                                                fill="rgba(79, 70, 229, 0.05)"
                                                stroke="#4f46e5"
                                                strokeWidth="1"
                                                animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
                                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                            <circle cx="100" cy="100" r="3" fill="#06b6d4" className="animate-pulse" />
                                        </svg>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-end justify-between">
                                            <div className="space-y-3">
                                                <div className="text-[8px] font-black text-white/20 tracking-[3px]">SIGNAL_THROUGHPUT</div>
                                                <div className="flex gap-1 h-6 items-end">
                                                    {[1, 5, 2, 8, 4, 3].map((h, i) => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ height: [`${h * 10}%`, `${(h + 2) % 10 * 10}%`, `${h * 10}%`] }}
                                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                                            className="w-[2px] bg-indigo-500/30 rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <Fingerprint className="w-10 h-10 text-indigo-400/30" />
                                        </div>
                                        <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-black tracking-[3px] text-white/10 uppercase">
                                            <span>SYNC_READY</span>
                                            <span className="text-indigo-500/50">99.1%</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Metadata Card */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -bottom-6 -left-6 bg-indigo-600 text-white p-5 rounded-2xl shadow-xl z-20"
                            >
                                <div className="text-[8px] font-black tracking-[3px] uppercase mb-1 opacity-70">Status</div>
                                <div className="text-lg font-black italic">VERIFIED</div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features: High-Tech Grid */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-indigo-500 font-black tracking-[8px] uppercase text-[11px] mb-4"
                        >
                            Core Architecture
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">THE PROTOCOLS.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: Shield, title: 'Compliance Nexus', desc: 'Predictive auditing threads that neutralize liability before disclosure.' },
                            { icon: Cpu, title: 'AI Forensics', desc: 'Automated thermal analysis of every byte of financial telemetry.' },
                            { icon: Globe, title: 'Global Settlement', desc: 'Atomic cross-border liquidity across 180+ encrypted regions.' },
                            { icon: Lock, title: 'Post-Quantum security', desc: 'End-to-end lattice-based encryption shielding critical assets.' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ translateY: -8, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] group transition-all relative overflow-hidden"
                            >
                                <div className="w-14 h-14 bg-indigo-600/10 border border-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600/20 transition-all">
                                    <item.icon className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-black mb-4 tracking-tight group-hover:text-indigo-300 transition-colors uppercase italic">{item.title}</h3>
                                <p className="text-sm text-white/30 leading-relaxed font-bold group-hover:text-white/50 transition-colors">
                                    {item.desc}
                                </p>
                                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 group-hover:w-full transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Neural CTA Wrapper */}
            <section className="py-40 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="p-16 md:p-24 rounded-[64px] bg-gradient-to-br from-indigo-900/40 via-black to-black border border-indigo-500/20 text-center relative overflow-hidden group"
                    >
                        <div className="absolute -inset-10 bg-indigo-600/10 blur-[100px] opacity-0 group-hover:opacity-100 transition duration-1000" />

                        <div className="relative">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-[0.9] text-white">
                                ASCEND TO <br />
                                <span className="text-indigo-400">SUPREMACY.</span>
                            </h2>
                            <p className="text-lg text-white/30 mb-14 max-w-xl mx-auto font-black italic uppercase tracking-widest">
                                The future of capital management is neural.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => navigate('/register')}
                                className="bg-white text-black font-black uppercase text-[12px] tracking-[6px] px-16 py-6 rounded-2xl shadow-xl"
                            >
                                Initiate Sync
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Ultra-Minimal Tech Footer */}
            <footer className="py-20 border-t border-white/5 bg-[#05070a]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                            <Shield className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-black text-lg tracking-tighter">ANTIGRAVITY</span>
                            <span className="text-[8px] font-black text-white/20 tracking-[4px] uppercase whitespace-nowrap">Intelligence Suite</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        {['Docs', 'Nodes', 'Privacy'].map((item) => (
                            <a key={item} href="#" className="text-[9px] uppercase font-black tracking-[4px] text-white/20 hover:text-white transition-all">{item}</a>
                        ))}
                    </div>

                    <div className="text-[9px] font-black tracking-[4px] text-white/10 uppercase italic">
                        © 2026. Secured by Antigravity Lattice.
                    </div>
                </div>
            </footer>
        </PageTransition>
    );
};

export default LandingPage;
