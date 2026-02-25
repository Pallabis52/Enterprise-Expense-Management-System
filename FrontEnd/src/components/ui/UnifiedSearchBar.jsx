import React, { useState, useRef, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    SparklesIcon,
    MicrophoneIcon,
    StopIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { naturalSearch } from '../../services/aiService';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * UnifiedSearchBar - Ultra-Premium Edition
 * Features a Holographic Voice Assistant UI with Mesh Gradients and Neural Ribbons.
 */
const UnifiedSearchBar = ({
    onResults,
    placeholder = "Search expenses, categories, or ask AI...",
    className = ""
}) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [searchMode, setSearchMode] = useState(null); // 'normal' | 'ai'
    const recognitionRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize Web Speech API
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                setIsListening(false);
                toast.success('Voice captured!', {
                    icon: '🎙️',
                    style: {
                        borderRadius: '12px',
                        background: '#0f172a',
                        color: '#fff',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                    },
                });
            };

            recognition.onerror = (event) => {
                setIsListening(false);
                toast.error(`Voice error: ${event.error}`);
            };

            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error('Voice recognition not supported in this browser.');
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const handleNormalSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setSearchMode('normal');
        try {
            const results = await userService.searchExpenses(query);
            if (onResults) onResults(results, 'normal', query);
            toast.success(`Found ${results.length} expenses`);
        } catch (error) {
            toast.error('Normal search failed');
        } finally {
            setIsSearching(false);
            setSearchMode(null);
        }
    };

    const handleAISearch = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setSearchMode('ai');
        try {
            const response = await naturalSearch(query);
            if (onResults) onResults(response, 'ai', query);
            toast.success('AI Search complete', { icon: '🪄' });
        } catch (error) {
            toast.error('AI search failed');
        } finally {
            setIsSearching(false);
            setSearchMode(null);
        }
    };

    return (
        <div className={`relative w-full group ${className}`}>
            <style>
                {`
                    @keyframes mesh-gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .mesh-bg {
                        background: linear-gradient(-45deg, #4338ca, #7c3aed, #db2777, #2563eb);
                        background-size: 400% 400%;
                        animation: mesh-gradient 15s ease infinite;
                    }
                    .holographic-ribbon {
                        height: 1px;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
                        width: 100%;
                        position: absolute;
                        filter: blur(0.5px);
                    }
                    .neon-pulse {
                        box-shadow: 0 0 20px rgba(255, 255, 255, 0.4), 0 0 40px rgba(99, 102, 241, 0.2);
                    }
                    .assistant-text {
                        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                    }
                `}
            </style>

            <motion.div
                layout
                className={`
                    relative flex items-center gap-2 p-1 rounded-2xl border transition-all duration-700
                    ${isListening
                        ? 'bg-gray-950 border-white/20 shadow-[0_0_80px_rgba(99,102,241,0.15)]'
                        : 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 backdrop-blur-xl shadow-lg shadow-gray-200/20 dark:shadow-none'}
                    focus-within:border-indigo-500 focus-within:shadow-indigo-500/10
                `}
            >
                {/* --- Ultra-Premium Listening Mode UI --- */}
                <AnimatePresence mode="wait">
                    {isListening && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="absolute inset-0 z-30 flex items-center bg-gray-950 mesh-bg rounded-2xl px-4 overflow-hidden"
                        >
                            {/* Glass Overlay for Depth */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                            {/* Holographic Ribbons */}
                            <div className="absolute inset-0 pointer-events-none opacity-30">
                                {[0, 1, 2, 3, 4].map(i => (
                                    <motion.div
                                        key={i}
                                        className="holographic-ribbon"
                                        animate={{
                                            y: [0, -10, 10, 0],
                                            opacity: [0.1, 0.6, 0.1],
                                            scaleX: [1, 1.2, 0.8, 1],
                                            x: ["-100%", "100%"]
                                        }}
                                        transition={{
                                            duration: 3 + i,
                                            repeat: Infinity,
                                            delay: i * 0.5,
                                            ease: "easeInOut"
                                        }}
                                        style={{ top: `${20 + i * 15}%` }}
                                    />
                                ))}
                            </div>

                            {/* Center Assistant Branding */}
                            <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-1">
                                <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                                    <span className="text-[10px] assistant-text font-black text-white/90 uppercase tracking-[0.4em]">
                                        Neural System Active
                                    </span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                                </motion.div>
                                <span className="text-[9px] font-bold text-indigo-200/60 uppercase tracking-widest mt-1">
                                    Listening to your request...
                                </span>
                            </div>

                            {/* Interactive Holographic Orb Button */}
                            <motion.button
                                onClick={toggleListening}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="relative w-12 h-12 flex items-center justify-center group"
                            >
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
                                <div className="absolute inset-0 border border-white/30 rounded-full animate-[spin_4s_linear_infinite]" />
                                <div className="absolute inset-2 bg-gradient-to-tr from-white to-white/50 rounded-full neon-pulse flex items-center justify-center">
                                    <StopIcon className="w-5 h-5 text-indigo-950" />
                                </div>
                            </motion.button>

                            <button
                                onClick={toggleListening}
                                className="ml-4 p-2 text-white/40 hover:text-white transition-colors relative z-10"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- Standard Mode UI --- */}
                <div className="flex items-center pl-1">
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleListening}
                        className={`
                            relative z-10 p-2.5 rounded-xl transition-all duration-300
                            text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                        `}
                    >
                        <MicrophoneIcon className="w-5 h-5 relative z-10" />
                    </motion.button>
                </div>

                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        autoComplete="off"
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && handleNormalSearch()}
                    />
                </div>

                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            type="button"
                            onClick={() => setQuery('')}
                            className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </motion.button>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-1.5 pr-1.5 py-1">
                    <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1" />

                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNormalSearch}
                        disabled={isSearching || !query.trim()}
                        className={`
                            p-2 rounded-xl transition-all duration-200 group/btn
                            ${searchMode === 'normal' && isSearching
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        <MagnifyingGlassIcon className={`w-5 h-5 transition-transform group-hover/btn:scale-110 ${searchMode === 'normal' && isSearching ? 'animate-bounce' : ''}`} />
                    </motion.button>

                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAISearch}
                        disabled={isSearching || !query.trim()}
                        className={`
                            p-2.5 rounded-xl transition-all duration-300 group/ai
                            bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-xl hover:shadow-purple-500/30
                            ${isSearching && searchMode === 'ai' ? 'animate-pulse' : 'hover:-rotate-3'}
                            disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:opacity-50
                        `}
                        title="AI Insights Search"
                    >
                        <SparklesIcon className={`w-5 h-5 transition-all ${searchMode === 'ai' && isSearching ? 'animate-spin' : 'group-hover/ai:scale-110'}`} />
                    </motion.button>
                </div>
            </motion.div>

            {/* Premium AI Status Bottom Label */}
            <AnimatePresence>
                {isSearching && searchMode === 'ai' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -bottom-8 left-0 right-0 flex justify-center items-center gap-3"
                    >
                        <div className="flex gap-1.5">
                            {[0, 150, 300].map(delay => (
                                <motion.div
                                    key={delay}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        backgroundColor: ["#6366f1", "#a855f7", "#6366f1"]
                                    }}
                                    transition={{ duration: 1, repeat: Infinity, delay: delay / 1000 }}
                                    className="w-1.5 h-1.5 rounded-full"
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 uppercase tracking-[0.3em] assistant-text">
                            Performing Deep Neural Analysis
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UnifiedSearchBar;
