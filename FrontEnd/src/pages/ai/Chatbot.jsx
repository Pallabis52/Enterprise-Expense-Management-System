import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import PageTransition from '../../components/layout/PageTransition';

const ROLE_PREFIX = {
    USER: 'user',
    MANAGER: 'manager',
    ADMIN: 'admin',
};

const BOT_STARTERS = {
    USER: [
        'Show my spending summary',
        'What are my top expense categories?',
        'How many pending expenses do I have?',
    ],
    MANAGER: [
        "How is my team's budget this month?",
        'Which employee has the highest spend?',
        'List pending approvals for this week',
    ],
    ADMIN: [
        'Summarize company spend this month',
        'Which teams are over budget?',
        'Are there any fraud risk expenses?',
    ],
};

const Chatbot = () => {
    const { user } = useAuthStore();
    const role = user?.role || 'USER';
    const rolePrefix = ROLE_PREFIX[role] || 'user';

    const [messages, setMessages] = useState([
        {
            id: 0,
            role: 'bot',
            text: `Hi ${user?.name || 'there'}! 👋 I'm your AI expense assistant. Ask me anything about your expenses, approvals, or budgets.`,
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
                { id: Date.now() + 1, role: 'bot', text: 'I\'m temporarily offline. Please try again in a moment.', fallback: true }
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
        <PageTransition>
            <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        💬 AI Chatbot
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Ask questions about expenses, approvals, budgets, and more
                    </p>
                </div>

                {/* Quick starters */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {starters.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => send(s)}
                            className="px-3 py-1.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Message list */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                    <span className="text-base">🤖</span>
                                </div>
                            )}
                            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-sm'
                                : msg.fallback
                                    ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-tl-sm'
                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-tl-sm'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-2 flex-shrink-0">
                                <span className="text-base">🤖</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl rounded-tl-sm px-4 py-3">
                                <div className="flex items-center gap-1.5 h-5">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="mt-3 flex gap-2">
                    <textarea
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        placeholder="Ask me anything about your expenses…"
                        rows={2}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        disabled={loading}
                    />
                    <button
                        onClick={() => send()}
                        disabled={loading || !input.trim()}
                        className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                    >
                        Send
                    </button>
                </div>
                <p className="mt-1.5 text-xs text-gray-400 text-center">Press Enter to send · Shift+Enter for new line</p>
            </div>
        </PageTransition>
    );
};

export default Chatbot;
