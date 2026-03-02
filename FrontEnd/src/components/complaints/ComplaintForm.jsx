import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, ShieldQuestion, Mic, MicOff, Cpu, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useEffect, useRef } from 'react';

const ComplaintForm = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('OTHER');
    const [expenseId, setExpenseId] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const suggestionTimer = useRef(null);

    const categories = ['FOOD', 'TRAVEL', 'REIMBURSEMENT', 'POLICY', 'FRAUD', 'OTHER'];

    useEffect(() => {
        if (description.length > 20) {
            if (suggestionTimer.current) clearTimeout(suggestionTimer.current);
            suggestionTimer.current = setTimeout(fetchSuggestions, 1000);
        } else {
            setSuggestions('');
        }
    }, [description]);

    const fetchSuggestions = async () => {
        setIsAiLoading(true);
        try {
            const res = await api.get(`/complaints/suggest?text=${encodeURIComponent(description)}`);
            setSuggestions(res.data);
        } catch (err) {
            console.error('AI Suggestion fail');
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return toast.error('Speech recognition not supported in this browser');

        const recognition = new SpeechRecognition();
        recognition.onstart = () => {
            setIsListening(true);
            toast('AI Listening...', { icon: '🎙️' });
        };
        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            setIsListening(false);
            setLoading(true);
            try {
                await api.post('/complaints/voice', { transcript });
                toast.success('Voice complaint processed by AI');
                onSuccess();
                onClose();
            } catch (err) {
                toast.error('Voice processing failed');
            } finally {
                setLoading(false);
            }
        };
        recognition.onerror = () => setIsListening(false);
        recognition.start();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) return toast.error('Please fill all fields');

        setLoading(true);
        try {
            await api.post('/complaints', {
                title,
                description,
                category,
                expenseId: expenseId ? parseInt(expenseId) : null
            });
            toast.success('Complaint transmission successful');
            setTitle('');
            setDescription('');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Transmission failed: Integrity check error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-xl bg-[#0a0c10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
            >
                {/* Tactical Header */}
                <div className="px-8 py-6 border-b border-white/5 bg-gradient-to-r from-indigo-600/10 to-transparent flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                            <ShieldQuestion className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-black uppercase tracking-tighter text-lg leading-none">Initialize Complaint</h2>
                            <p className="text-[9px] text-white/30 font-black tracking-[4px] uppercase mt-1">Status: Operational</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-white/40" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-[4px] text-white/30 ml-1">Subject Vector</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Reimbursement Divergence"
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-[4px] text-white/30 ml-1">Classification</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium appearance-none"
                            >
                                {categories.map(cat => <option key={cat} value={cat} className="bg-[#0a0c10]">{cat}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-[4px] text-white/30 ml-1">Expense Link</label>
                            <input
                                type="number"
                                value={expenseId}
                                onChange={(e) => setExpenseId(e.target.value)}
                                placeholder="ID (Optional)"
                                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-[10px] uppercase font-black tracking-[4px] text-white/30">Narrative Detail</label>
                            <button
                                type="button"
                                onClick={handleVoice}
                                className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-white/40 hover:text-white'}`}
                            >
                                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the operational anomaly..."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all font-medium resize-none"
                        />
                    </div>

                    <AnimatePresence>
                        {(suggestions || isAiLoading) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 overflow-hidden"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Cpu className="w-3 h-3 text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-400">AI suggested solutions</span>
                                    {isAiLoading && <Loader2 className="w-3 h-3 text-indigo-400 animate-spin ml-auto" />}
                                </div>
                                <div className="text-[11px] text-white/60 leading-relaxed italic">
                                    {suggestions || 'Analyzing neural patterns...'}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[4px] flex items-center justify-center gap-3 transition-all ${loading
                                ? 'bg-white/5 text-white/20'
                                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 active:scale-[0.98]'
                                }`}
                        >
                            {loading ? 'Transmitting...' : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Broadcast Complaint
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Bottom Status Bar */}
                <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-[3px]">
                        <AlertCircle className="w-3 h-3 text-indigo-500" />
                        Encryption: active_lattice_v6
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ComplaintForm;
