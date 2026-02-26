import React, { useState, useEffect } from 'react';
import { getConfidenceScore } from '../../services/aiService';
import { motion } from 'framer-motion';

const config = {
    'High': { color: 'bg-rose-500', text: 'text-rose-500', label: 'High Risk', sub: 'Manual verification recommended' },
    'Medium': { color: 'bg-amber-500', text: 'text-amber-500', label: 'Medium Risk', sub: 'Standard audit review' },
    'Low': { color: 'bg-emerald-500', text: 'text-emerald-500', label: 'Low Risk', sub: 'Verified trustworthy' }
};

const ConfidenceIndicator = ({ expenseId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const res = await getConfidenceScore(expenseId);
                setData(res);
            } catch (err) {
                console.error('Confidence Score Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchScore();
    }, [expenseId]);

    if (loading) {
        return (
            <div className="space-y-2 animate-pulse">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg" />
            </div>
        );
    }

    const { score, riskLevel, breakdown } = data || { score: 0, riskLevel: 'High', breakdown: 'Unable to analyze' };
    const cfg = config[riskLevel] || config.Medium;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cfg.color} animate-pulse`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.text}`}>
                        {cfg.label}
                    </span>
                </div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tabular-nums">
                    {score}% Trust Level
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    className={`h-full rounded-full ${cfg.color} shadow-lg shadow-current/20`}
                />
            </div>

            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60 px-0.5">
                {cfg.sub}
            </p>

            {/* Breakdown Tooltip/Mini-info */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Scoring Breakdown</p>
                <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 italic leading-snug">
                    {breakdown}
                </p>
            </div>
        </div>
    );
};

export default ConfidenceIndicator;
