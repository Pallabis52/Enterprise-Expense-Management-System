import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Menu, X, ChevronRight, Zap, BarChart3, Globe, Lock } from 'lucide-react';

const PublicNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-black text-xl tracking-tighter leading-none">ANTIGRAVITY</span>
                        <span className="text-[10px] text-indigo-400 font-bold tracking-[3px] uppercase mt-1">Enterprise Ops</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'Intelligence', 'Security', 'Global'].map((item) => (
                        <Link
                            key={item}
                            to={`/${item.toLowerCase()}`}
                            className="text-white/60 hover:text-white text-sm font-bold tracking-widest uppercase transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-white/80 hover:text-white text-sm font-bold tracking-widest uppercase px-6 py-2 transition-all"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="relative group overflow-hidden bg-white text-black font-black uppercase text-[12px] tracking-widest px-8 py-3 rounded-xl transition-all active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 group-hover:text-white transition-colors">Get Started</span>
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-white/10 p-6 flex flex-col gap-6"
                >
                    {['Features', 'Intelligence', 'Security', 'Global'].map((item) => (
                        <Link
                            key={item}
                            to={`/${item.toLowerCase()}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-white/60 text-lg font-bold tracking-widest uppercase"
                        >
                            {item}
                        </Link>
                    ))}
                    <div className="h-[1px] bg-white/10 w-full" />
                    <div className="flex flex-col gap-4">
                        <button onClick={() => navigate('/login')} className="bg-white/5 text-white py-4 rounded-xl font-bold uppercase tracking-widest">Login</button>
                        <button onClick={() => navigate('/register')} className="bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest">Register</button>
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default PublicNavbar;
