import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, ShieldExclamationIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { getRiskScore } from '../../services/aiService';

const SmartApprovalBadge = ({ expenseId }) => {
    const [loading, setLoading] = useState(true);
    const [riskData, setRiskData] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const fetchRisk = async () => {
            try {
                const response = await getRiskScore(expenseId);
                if (response && !response.fallback) {
                    // Expecting result format: "[LOW] Reason..." or "[HIGH] Reason..."
                    const text = response.result;
                    const level = text.includes('[HIGH]') ? 'HIGH' : text.includes('[MEDIUM]') ? 'MEDIUM' : 'LOW';
                    setRiskData({ level, message: text });
                }
            } catch (error) {
                console.error('Failed to fetch AI risk score');
            } finally {
                setLoading(false);
            }
        };

        if (expenseId) fetchRisk();
    }, [expenseId]);

    if (loading) return <div className="w-24 h-6 bg-gray-100 animate-pulse rounded"></div>;
    if (!riskData) return null;

    const config = {
        LOW: { color: 'bg-green-100 text-green-700 border-green-200', icon: ShieldCheckIcon, label: 'Low Risk' },
        MEDIUM: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: InformationCircleIcon, label: 'Medium Risk' },
        HIGH: { color: 'bg-red-100 text-red-700 border-red-200', icon: ShieldExclamationIcon, label: 'High Risk' }
    };

    const { color, icon: Icon, label } = config[riskData.level];

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider cursor-help transition-all duration-300 ${color}`}
            >
                <Icon className="w-3.5 h-3.5" />
                {label}
            </div>

            {showTooltip && (
                <div className="absolute z-50 bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-start gap-2">
                        <InformationCircleIcon className="w-4 h-4 text-indigo-400 mt-0.5" />
                        <p className="leading-relaxed">
                            {riskData.message.replace(/\[.*?\]/, '').trim()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartApprovalBadge;
