import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, MoveLeft, Home, Lock, Zap } from 'lucide-react';
import useAuthStore from '../store/authStore';
import PageTransition from '../components/layout/PageTransition';

const AccessDenied = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const handleHome = () => {
        if (!user) {
            navigate('/login');
            return;
        }

        switch (user.role) {
            case 'ADMIN':
                navigate('/admin/dashboard');
                break;
            case 'MANAGER':
                navigate('/manager/dashboard');
                break;
            case 'USER':
                navigate('/user/dashboard');
                break;
            default:
                navigate('/');
        }
    };

    return (
        <PageTransition className="min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden relative font-sans">
            {/* Background Tactical Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.2)]" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent shadow-[0_0_15px_rgba(249,115,22,0.2)]" />

                {/* Animated Scanning Line */}
                <motion.div
                    initial={{ translateY: '-100%' }}
                    animate={{ translateY: '200%' }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent h-1/2 w-full z-0"
                />

                {/* Digital Noise/Dots Grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* Main Content Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-2xl px-6"
            >
                {/* Status Bar Top */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-red-500" />
                        <span className="text-[10px] uppercase tracking-[3px] text-red-500/60 font-black">System Override</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-[2px] text-white/40">Restricted Section</span>
                    </div>
                </div>

                {/* Glass Card Container */}
                <div className="relative group">
                    {/* Glowing Backdrops */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-3xl blur-[20px] opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                    <div className="relative bg-black/60 backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-8 md:p-12 overflow-hidden">
                        {/* Animated Border Header */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                        {/* Error Identifier Overlay */}
                        <div className="absolute top-4 right-6 text-[40px] font-black text-white/[0.02] select-none">
                            ERR_403
                        </div>

                        {/* Icon & Heading */}
                        <div className="flex flex-col items-center mb-8">
                            <motion.div
                                animate={{ rotate: [0, -5, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)] mb-6"
                            >
                                <ShieldAlert className="w-10 h-10 text-red-500" />
                            </motion.div>

                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter text-center mb-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-gradient-x">ACCESS </span>
                                DENIED
                            </h1>

                            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent mb-6" />

                            <p className="text-white/60 text-center max-w-sm leading-relaxed text-sm md:text-base">
                                Your current credentials lack the clearance required for this terminal. Digital protocols have synchronized to prevent unauthorized entry.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={handleHome}
                                className="relative group/btn flex items-center justify-center gap-3 bg-white text-black font-black uppercase text-[12px] tracking-widest py-4 rounded-xl overflow-hidden active:scale-[0.98] transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <Home className="w-4 h-4 relative z-10 group-hover/btn:scale-110 transition-transform" />
                                <span className="relative z-10 group-hover/btn:text-white transition-colors">Return Home</span>
                            </button>

                            <button
                                onClick={() => navigate(-1)}
                                className="group/btn flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-black uppercase text-[12px] tracking-widest py-4 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all"
                            >
                                <MoveLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                                <span>Revert Entry</span>
                            </button>
                        </div>

                        {/* Decorative HUD Elements */}
                        <div className="mt-10 pt-8 border-t border-white/[0.05] flex flex-wrap justify-center gap-4 text-[9px] uppercase tracking-[2px] font-bold text-white/20">
                            <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> Security: Triple-Layered</span>
                            <span className="opacity-40">•</span>
                            <span>Clearance: Level 0 Detected</span>
                            <span className="opacity-40">•</span>
                            <span>Status: Locked</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Ambient Red Glows */}
            <div className="absolute top-[30%] -left-[10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px] animate-pulse"
                style={{ animationDelay: '2s' }} />
        </PageTransition>
    );
};

export default AccessDenied;
