import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageSquare, ShieldCheck, AlertTriangle, ArrowRight, User } from 'lucide-react';

const ComplaintList = ({ complaints, onRespond, userRole }) => {

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'IN_PROGRESS': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'CLOSED': return 'bg-white/5 text-white/30 border-white/10';
            default: return 'bg-white/5 text-white/40 border-white/10';
        }
    };

    if (!complaints || complaints.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                <AlertTriangle className="w-12 h-12 mb-4 text-indigo-500" />
                <p className="text-[10px] font-black uppercase tracking-[5px]">No complaints detected in current sector</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {complaints.map((complaint, idx) => (
                <motion.div
                    key={complaint.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#0a0c10] border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all group"
                >
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[2px] uppercase border ${getStatusStyle(complaint.status)}`}>
                                        {complaint.status}
                                    </span>
                                    <span className="text-[9px] font-black text-white/20 tracking-[3px] uppercase">ID: {complaint.id}</span>
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-indigo-400 transition-colors">
                                    {complaint.title}
                                </h3>
                                <div className="flex items-center gap-4 text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3 h-3 text-indigo-500" />
                                        {complaint.createdBy}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 text-indigo-500" />
                                        {new Date(complaint.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {(userRole === 'ADMIN' || userRole === 'MANAGER') && complaint.status !== 'CLOSED' && (
                                <button
                                    onClick={() => onRespond(complaint)}
                                    className="px-6 py-3 bg-white/5 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[3px] transition-all flex items-center gap-2 group/btn active:scale-95 border border-white/10"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    Provide Intelligence
                                </button>
                            )}
                        </div>

                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl mb-6">
                            <p className="text-white/60 leading-relaxed text-sm font-medium">
                                {complaint.description}
                            </p>
                        </div>

                        {complaint.response && (
                            <div className="relative pl-8 border-l border-indigo-500/30 space-y-4">
                                <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[4px]">Official Response</span>
                                </div>
                                <p className="text-indigo-100/70 text-sm leading-relaxed font-semibold italic">
                                    "{complaint.response}"
                                </p>
                                <div className="text-[8px] text-white/20 font-black uppercase tracking-[3px]">
                                    Response by: {complaint.assignedTo || 'System_Core'}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </motion.div>
            ))}
        </div>
    );
};

export default ComplaintList;
