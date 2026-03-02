import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Plus, RefreshCcw, MessageSquare, CheckCircle, X } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';
import PageTransition from '../../components/layout/PageTransition';
import ComplaintList from '../../components/complaints/ComplaintList';
import ComplaintForm from '../../components/complaints/ComplaintForm';

const ComplaintManagementPage = () => {
    const { user } = useAuthStore();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [response, setResponse] = useState('');
    const [isResponding, setIsResponding] = useState(false);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            let endpoint = '/api/complaints/my';
            if (user?.role === 'ADMIN') endpoint = '/api/complaints/all';
            else if (user?.role === 'MANAGER') endpoint = '/api/complaints/team';

            const res = await api.get(endpoint);
            setComplaints(res.data);
        } catch (error) {
            toast.error('Sector scan failed: Data stream corrupted');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [user?.role]);

    const handleRespond = async (e) => {
        e.preventDefault();
        if (!response) return toast.error('Response intelligence required');

        setIsResponding(true);
        try {
            await api.post(`/api/complaints/respond/${selectedComplaint.id}`, { response });
            toast.success('Intelligence broadcast successful');
            setResponse('');
            setSelectedComplaint(null);
            fetchComplaints();
        } catch (error) {
            toast.error('Response failed: Authorization override');
        } finally {
            setIsResponding(false);
        }
    };

    const handleClose = async (id) => {
        try {
            await api.post(`/api/complaints/close/${id}`);
            toast.success('Complaint vector neutralized');
            fetchComplaints();
        } catch (error) {
            toast.error('Neutralization failed');
        }
    };

    return (
        <PageTransition className="space-y-12 pb-20">
            {/* Tactical Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8 px-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                            <ShieldAlert className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                            COMPLAINT <span className="text-indigo-500">OPS.</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-black tracking-[5px] text-white/30 uppercase ml-1 relative">
                        Sector Status: Monitoring Active
                        <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchComplaints}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all border border-white/5 active:rotate-180 duration-500"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                    {(user?.role === 'USER' || user?.role === 'MANAGER') && (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[11px] tracking-[4px] px-10 py-5 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all flex items-center gap-3 group active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Initialize Complaint
                        </button>
                    )}
                </div>
            </div>

            {/* Operational HUD */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
                <div className="lg:col-span-3 space-y-8">
                    {loading ? (
                        <div className="py-40 flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[5px] text-white/20">Syncing Intelligence Stream...</p>
                        </div>
                    ) : (
                        <ComplaintList
                            complaints={complaints}
                            userRole={user?.role}
                            onRespond={setSelectedComplaint}
                        />
                    )}
                </div>

                {/* Tactical Stats Panel */}
                <div className="space-y-8">
                    <div className="bg-[#0a0c10] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 font-black text-[8px] text-white/10 tracking-[3px]">BETA_V6</div>
                        <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[4px] mb-8">Operational Summary</h4>

                        <div className="space-y-6">
                            {[
                                { label: 'Total Vectors', count: complaints.length, color: 'text-white' },
                                { label: 'Active (Open)', count: complaints.filter(c => c.status === 'OPEN').length, color: 'text-blue-400' },
                                { label: 'In Analysis', count: complaints.filter(c => c.status === 'IN_PROGRESS').length, color: 'text-amber-400' },
                                { label: 'Neutralized', count: complaints.filter(c => c.status === 'CLOSED').length, color: 'text-white/20' }
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-end justify-between border-b border-white/5 pb-4 last:border-0">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[3px]">{stat.label}</span>
                                    <span className={`text-xl font-black italic ${stat.color}`}>{String(stat.count).padStart(2, '0')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-3xl">
                        <p className="text-[10px] font-medium text-indigo-200/40 italic leading-relaxed">
                            "System-wide integrity is maintained through proactive feedback loops. Every complaint is a data point for structural optimization."
                        </p>
                    </div>
                </div>
            </div>

            {/* Complaint Initialize Modal */}
            <ComplaintForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={fetchComplaints}
            />

            {/* Response Intelligence Modal */}
            <AnimatePresence>
                {selectedComplaint && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-2xl bg-[#0a0c10] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative"
                        >
                            <div className="px-10 py-8 border-b border-white/5 bg-gradient-to-tr from-indigo-600/10 to-transparent flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-black uppercase tracking-tighter text-xl leading-none">Intel Broadcast</h2>
                                        <p className="text-[9px] text-white/30 font-black tracking-[4px] uppercase mt-1">ID: {selectedComplaint.id}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedComplaint(null)} className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
                                    <X className="w-6 h-6 text-white/30" />
                                </button>
                            </div>

                            <form onSubmit={handleRespond} className="p-10 space-y-8">
                                <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[32px] space-y-4">
                                    <div className="text-[9px] font-black text-white/20 uppercase tracking-[4px]">Original Complaint Intel</div>
                                    <p className="text-white/60 text-sm leading-relaxed italic font-medium">"{selectedComplaint.description}"</p>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-black tracking-[5px] text-white/20 ml-1">Response Intelligence</label>
                                    <textarea
                                        value={response}
                                        onChange={(e) => setResponse(e.target.value)}
                                        placeholder="Formulate strategic response..."
                                        rows={5}
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-[32px] px-8 py-6 text-white placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all font-medium resize-none"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isResponding}
                                        className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[11px] tracking-[4px] rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isResponding ? 'Transmitting...' : 'Broadcast Intelligence'}
                                    </button>
                                    {user?.role === 'ADMIN' && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleClose(selectedComplaint.id);
                                                setSelectedComplaint(null);
                                            }}
                                            className="px-8 py-5 border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-black uppercase text-[10px] tracking-[4px] rounded-2xl hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Neutralize Path
                                        </button>
                                    )}
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default ComplaintManagementPage;
