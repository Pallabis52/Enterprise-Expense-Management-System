import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RotateCcw, ShieldAlert } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    console.error('System Trajectory Error:', error);

    return (
        <PageTransition className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 text-white overflow-hidden relative">
            {/* Background Glitch Effect */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />

                {/* Tactical Grid */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to right, rgba(239, 68, 68, 0.05) 1px, transparent 1px), 
                                      linear-gradient(to bottom, rgba(239, 68, 68, 0.05) 1px, transparent 1px)`,
                    backgroundSize: '100px 100px',
                    perspective: '1000px',
                    transform: 'rotateX(45deg) scale(2)',
                    maskImage: 'linear-gradient(to bottom, white, transparent)'
                }} />
            </div>

            <div className="relative z-10 max-w-2xl w-full">
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex p-5 rounded-3xl bg-red-500/10 border border-red-500/20 mb-10 shadow-2xl shadow-red-500/20"
                    >
                        <ShieldAlert className="w-16 h-16 text-red-500" />
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 italic">
                            CORE <span className="text-red-500">FAULT.</span>
                        </h1>
                        <p className="text-[10px] font-black tracking-[8px] uppercase text-red-400/60 mb-8">
                            Critical Systems Breach Detected
                        </p>

                        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 mb-12 text-left relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-white/20">ERROR_LOG_V6</div>
                            <h3 className="text-xs font-black text-white/40 mb-4 uppercase tracking-[4px]">Diagnostic Intelligence</h3>
                            <p className="text-red-400 font-mono text-sm leading-relaxed mb-4 italic">
                                "{error.statusText || error.message || 'Unknown internal trajectory deviation.'}"
                            </p>
                            <div className="h-1 w-full bg-red-500/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-red-500"
                                    animate={{ width: ['0%', '100%'] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full sm:w-auto bg-white text-black font-black uppercase text-[11px] tracking-[4px] px-10 py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reboot System
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full sm:w-auto border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-[5px] px-10 py-5 rounded-xl flex items-center justify-center gap-3 transition-all"
                            >
                                <Home className="w-4 h-4" />
                                Return to Base
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-[8px] font-black text-white/10 uppercase tracking-[10px]">
                        Protocol Antigravity Prime // Fault Containment Active
                    </p>
                </div>
            </div>
        </PageTransition>
    );
};

export default ErrorPage;
