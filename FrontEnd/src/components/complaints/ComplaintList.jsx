import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageSquare, ShieldCheck, AlertTriangle, ArrowRight, User, Hash, Zap, Heart, AlertCircle, TrendingUp } from 'lucide-react';

const ComplaintList = ({ complaints, onRespond, userRole }) => {

    const getStatusStyle = (status) => {
        switch (status) {
            case 'SUBMITTED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'UNDER_REVIEW': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'ESCALATED': return 'bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse';
            default: return 'bg-white/5 text-white/40 border-white/10';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'CRITICAL': return 'text-red-500';
            case 'HIGH': return 'text-orange-500';
            case 'MEDIUM': return 'text-amber-500';
            case 'LOW': return 'text-emerald-500';
            default: return 'text-white/40';
        }
    };

    const getSentimentIcon = (sentiment) => {
        switch (sentiment) {
            case 'ANGRY': return <AlertCircle className="w-3 h-3 text-red-400" />;
            case 'POSITIVE': return <Heart className="w-3 h-3 text-emerald-400" />;
            default: return <Zap className="w-3 h-3 text-indigo-400" />;
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
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[2px] uppercase border ${getStatusStyle(complaint.status)}`}>
                                        {complaint.status}
                                    </span>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                        <TrendingUp className={`w-3 h-3 ${getPriorityColor(complaint.priority)}`} />
                                        <span className={`text-[9px] font-black tracking-[2px] uppercase ${getPriorityColor(complaint.priority)}`}>
                                            {complaint.priority}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                        {getSentimentIcon(complaint.sentiment)}
                                        <span className="text-[9px] font-black tracking-[2px] uppercase text-white/40">
                                            {complaint.sentiment}
                                        </span>
                                    </div>
                                    {complaint.isDuplicate && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                                            <AlertTriangle className="w-3 h-3 text-red-400" />
                                            <span className="text-[9px] font-black tracking-[2px] uppercase text-red-400">Duplicate</span>
                                        </div>
                                    )}
                                    <span className="text-[9px] font-black text-white/10 tracking-[3px] uppercase ml-auto">ID: {complaint.id}</span>
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-indigo-400 transition-colors flex items-center gap-3">
                                    {complaint.title}
                                    {complaint.category && <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">{complaint.category}</span>}
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
                                    {complaint.expenseId && (
                                        <div className="flex items-center gap-1.5 ml-auto">
                                            <Hash className="w-3 h-3 text-indigo-500" />
                                            EXP_ID: {complaint.expenseId}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {(userRole === 'ADMIN' || userRole === 'MANAGER') && complaint.status !== 'RESOLVED' && (
                                    <button
                                        onClick={() => onRespond(complaint)}
                                        className="px-6 py-3 bg-white/5 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[3px] transition-all flex items-center gap-2 group/btn active:scale-95 border border-white/10"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        Provide Intelligence
                                    </button>
                                )}
                                {complaint.riskScore > 0 && (
                                    <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                                        <div className="text-[9px] font-black text-white/20 uppercase tracking-[2px]">Risk Factor</div>
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${complaint.riskScore > 70 ? 'bg-red-500' : complaint.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${complaint.riskScore}%` }}
                                            />
                                        </div>
                                        <div className="text-[10px] font-black text-white">{complaint.riskScore}%</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lifecycle Timeline */}
                        <div className="flex items-center gap-8 px-4 py-8 mb-6 overflow-x-auto no-scrollbar">
                            {[
                                { label: 'Submitted', status: 'SUBMITTED', active: true },
                                { label: 'In Review', status: 'UNDER_REVIEW', active: ['UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'ESCALATED'].includes(complaint.status) },
                                { label: 'Finalized', status: 'RESOLVED', active: ['RESOLVED', 'REJECTED'].includes(complaint.status) }
                            ].map((step, sidx) => (
                                <React.Fragment key={step.label}>
                                    <div className="flex flex-col items-center gap-2 transition-all min-w-fit">
                                        <div className={`w-4 h-4 rounded-full border-2 ${step.active ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'border-white/10 bg-white/5'}`} />
                                        <span className={`text-[8px] font-black uppercase tracking-[2px] ${step.active ? 'text-white' : 'text-white/20'}`}>{step.label}</span>
                                    </div>
                                    {sidx < 2 && (
                                        <div className={`h-[1px] min-w-[30px] flex-1 ${step.active ? 'bg-indigo-500/50' : 'bg-white/5'}`} />
                                    )}
                                </React.Fragment>
                            ))}
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
