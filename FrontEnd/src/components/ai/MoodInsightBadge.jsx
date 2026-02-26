import React, { useState, useEffect } from 'react';
import { getMoodInsight } from '../../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';

const moodConfig = {
    'stress': { emoji: '😟', label: 'Stress Spending', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    'celebration': { emoji: '😄', label: 'Celebration', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    'urgent': { emoji: '🚨', label: 'Urgent', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    'routine': { emoji: '📊', label: 'Routine', color: 'text-slate-500', bg: 'bg-slate-500/10' },
    'unknown': { emoji: '❓', label: 'Analysis Pending', color: 'text-gray-400', bg: 'bg-gray-400/10' }
};

const MoodInsightBadge = ({ expenseId }) => {
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            try {
                const data = await getMoodInsight(expenseId);
                setInsight(data);
            } catch (err) {
                console.error('Mood Insight Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInsight();
    }, [expenseId]);

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 animate-pulse">
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
        );
    }

    const config = moodConfig[insight?.mood?.toLowerCase()] || moodConfig.unknown;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} border border-current/10 transition-all cursor-help`}
        >
            <span className="text-sm">{config.emoji}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                {config.label}
            </span>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-2">Behavior Analysis</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white mb-2">{insight?.explanation}</p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1">Suggestion</p>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">"{insight?.suggestion}"</p>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-900 rotate-45 border-r border-b border-slate-100 dark:border-slate-800 -mt-1.5" />
            </div>
        </motion.div>
    );
};

export default MoodInsightBadge;
