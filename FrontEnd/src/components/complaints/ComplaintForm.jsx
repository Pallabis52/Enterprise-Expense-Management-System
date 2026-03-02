import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, ShieldQuestion } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ComplaintForm = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) return toast.error('Please fill all fields');

        setLoading(true);
        try {
            await api.post('/api/complaints', { title, description });
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

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-[4px] text-white/30 ml-1">Narrative Detail</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the operational anomaly..."
                            rows={4}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all font-medium resize-none"
                        />
                    </div>

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
