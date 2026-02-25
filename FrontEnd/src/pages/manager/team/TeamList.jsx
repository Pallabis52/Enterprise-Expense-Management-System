import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useTeamStore from '../../../store/teamStore';
import Skeleton from '../../../components/ui/Skeleton';
import {
    UserIcon,
    EnvelopeIcon,
    BriefcaseIcon,
    UsersIcon,
    ShieldCheckIcon,
    ArrowUpRightIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';
import PageTransition from '../../../components/layout/PageTransition';

const TeamList = () => {
    const { members, fetchTeamMembers, isLoading } = useTeamStore();

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const TeamCard = ({ member, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
        >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />

            <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[32px] p-8 border border-white/60 dark:border-white/10 shadow-xl overflow-hidden">
                {/* ── Card Hero Section ── */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/30 via-transparent to-purple-500/30 rounded-full blur-md opacity-50"
                        />
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-1">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-black text-white border-4 border-white/10">
                                {member.name?.[0] || 'U'}
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-2 bg-emerald-500 rounded-xl shadow-lg border-2 border-white dark:border-slate-900">
                            <ShieldCheckIcon className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight group-hover:text-indigo-500 transition-colors">
                        {member.name}
                    </h3>
                    <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.2em] mt-1 opacity-70">
                        {member.role || 'Operational Agent'}
                    </p>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent my-6" />

                    {/* ── Telemetry Data ── */}
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between group/meta">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                    <EnvelopeIcon className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{member.email}</span>
                            </div>
                            <ArrowUpRightIcon className="w-3 h-3 text-slate-300 group-hover/meta:text-indigo-500 transition-colors" />
                        </div>

                        <div className="flex items-center justify-between group/meta">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                    <IdentificationIcon className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                    Incept: {new Date(member.joinDate || Date.now()).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 w-full py-4 bg-slate-900 dark:bg-white/10 text-white dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] rounded-2xl border border-white/10 hover:bg-slate-800 dark:hover:bg-white/20 transition-all shadow-xl shadow-slate-900/10"
                    >
                        Access Archive
                    </motion.button>
                </div>

                {/* Decorative background element */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
            </div>
        </motion.div>
    );

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-6">

                {/* ── Command Header ── */}
                <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <div className="p-4 rounded-[20px] bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/20">
                                <UsersIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Management Grid</h1>
                                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-[0.3em] mt-3">Personnel & Authority Matrix</p>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-6 px-8 py-5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-white/10 shadow-xl"
                    >
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest leading-none">Active Units</p>
                            <p className="text-3xl font-black text-indigo-500 mt-1 leading-none">{members.length}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <ArrowUpRightIcon className="w-6 h-6" />
                        </div>
                    </motion.div>
                </div>

                {/* ── Personnel Matrix ── */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-[420px] rounded-[32px] bg-white/20 dark:bg-white/5 animate-pulse border border-white/20" />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {members.length > 0 ? (
                                members.map((member, idx) => (
                                    <TeamCard key={member.id} member={member} index={idx} />
                                ))
                            ) : (
                                <div className="col-span-full py-32 text-center bg-white/20 dark:bg-slate-900/20 rounded-[48px] border-2 border-dashed border-white/20 backdrop-blur-md">
                                    <div className="p-6 rounded-3xl bg-indigo-500/10 text-indigo-500 inline-block mb-6">
                                        <UsersIcon className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Negative Grid Match</h3>
                                    <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest mt-2">No operational units detected in current sector</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

export default TeamList;
