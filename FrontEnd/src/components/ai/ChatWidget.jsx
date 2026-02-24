import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChatBubbleOvalLeftEllipsisIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const ROLE_PREFIX = {
    USER: 'user',
    MANAGER: 'manager',
    ADMIN: 'admin',
};

const BOT_STARTERS = {
    USER: [
        'Show my spending summary',
        'Check my pending expenses',
        'How to add a new expense?',
    ],
    MANAGER: [
        "How is my team's budget?",
        'Show pending approvals',
        'List top spenders in team',
    ],
    ADMIN: [
        'Summarize company spend',
        'Are there any fraud risks?',
        'Which teams are over budget?',
    ],
};

const ChatWidget = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const role = user?.role || 'USER';
    const rolePrefix = ROLE_PREFIX[role] || 'user';

    // Welcome message on first open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 0,
                    role: 'bot',
                    text: `Hi ${user?.name || 'there'}! 👋 I'm your AI expense assistant. How can I help you today?`,
                }
            ]);
        }
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, user?.name, messages.length]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!isAuthenticated) return null;

    const send = async (text) => {
        const userText = text || input.trim();
        if (!userText || loading) return;
        setInput('');

        const userMsg = { id: Date.now(), role: 'user', text: userText };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const { data } = await api.post(`/${rolePrefix}/ai/chat`, {
                message: userText,
                context: '',
            });
            const botText = data?.result || 'I was unable to process that. Please try rephrasing.';
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, role: 'bot', text: botText, fallback: data?.fallback }
            ]);
        } catch {
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, role: 'bot', text: 'I\'m temporarily offline. Please try again later.', fallback: true }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    const starters = BOT_STARTERS[role] || BOT_STARTERS.USER;

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[380px] h-[520px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 bg-indigo-600 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🤖</span>
                                <div>
                                    <h3 className="text-sm font-semibold">AI Assistant</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-indigo-100 uppercase tracking-wider font-bold">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                                        : msg.fallback
                                            ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-tl-none'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none border border-transparent'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 border border-transparent">
                                        <div className="flex items-center gap-1.5 h-5">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {messages.length < 2 && !loading && (
                                <div className="pt-2 space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest px-1">Suggested</p>
                                    <div className="flex flex-wrap gap-2">
                                        {starters.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => send(s)}
                                                className="px-3 py-2 text-xs text-left bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-medium"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="relative">
                                <textarea
                                    ref={inputRef}
                                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition custom-scrollbar"
                                    placeholder="Message assistant..."
                                    rows={2}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKey}
                                    disabled={loading}
                                />
                                <button
                                    onClick={() => send()}
                                    disabled={loading || !input.trim()}
                                    className="absolute bottom-2.5 right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:bg-gray-400 text-white rounded-lg transition-all"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center p-4 rounded-full shadow-2xl transition-colors ${isOpen
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 animate-in fade-in zoom-in duration-300'
                    }`}
            >
                {isOpen ? (
                    <XMarkIcon className="w-7 h-7" />
                ) : (
                    <div className="relative">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
