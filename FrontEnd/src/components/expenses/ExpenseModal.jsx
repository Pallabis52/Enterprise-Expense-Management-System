import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import VoiceExpenseButton from '../ai/VoiceExpenseButton';
import { enhanceDescription } from '../../services/aiService';
import { SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ExpenseModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: ''
    });
    const [receiptFile, setReceiptFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleVoiceParsed = (data) => {
        setFormData({
            ...formData,
            title: data.title || data.description || formData.title,
            amount: data.amount || formData.amount,
            category: data.category || formData.category,
            description: data.description || formData.description,
            date: data.date || formData.date
        });
    };

    const handleEnhanceDescription = async () => {
        if (!formData.title || !formData.amount) {
            toast.error('Please enter title and amount first');
            return;
        }
        setIsEnhancing(true);
        try {
            const res = await enhanceDescription(formData.title, formData.amount, formData.category);
            if (!res.isFallback) {
                setFormData({ ...formData, description: res.result });
                toast.success('Description boosted!');
            }
        } catch (err) {
            toast.error('AI enhancement failed');
        } finally {
            setIsEnhancing(false);
        }
    };

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await import('../../services/categoryService').then(m => m.default.getAllCategories());
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                amount: initialData.amount || '',
                date: initialData.date || new Date().toISOString().split('T')[0],
                category: initialData.category || '',
                description: initialData.description || ''
            });
        } else {
            setFormData({
                title: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: categories.length > 0 ? categories[0].name : '',
                description: ''
            });
            setReceiptFile(null);
        }
    }, [initialData, isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = (e, isDraft = false) => {
        if (e) e.preventDefault();
        onSubmit(formData, receiptFile, isDraft);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative group max-w-lg w-full">
                {/* Outer Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 to-accent-600/30 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 dark:border-gray-700/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden transform transition-all animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                    {/* Header with Background Accent */}
                    <div className="relative p-8 pb-6 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                                    {initialData ? 'Refine Expense' : 'New Transaction'}
                                </h3>
                                <p className="text-xs font-bold text-primary-600/60 dark:text-primary-400/60 uppercase tracking-[0.2em] mt-0.5">
                                    Aether Sync Protocol
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:rotate-90 transition-all duration-300"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={(e) => handleSubmit(e, false)} className="px-8 pb-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                        {!initialData && (
                            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-primary-500/5 to-accent-600/5 border border-dashed border-primary-500/20 flex flex-col items-center gap-3 group/voice transition-all duration-300 hover:bg-primary-500/10">
                                <div className="absolute inset-0 bg-white/40 dark:bg-black/10 backdrop-blur-[2px] rounded-3xl -z-10"></div>
                                <VoiceExpenseButton onParsed={handleVoiceParsed} />
                                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest animate-pulse">
                                    Initialize Voice Sync
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                label="Expense Identifier"
                                placeholder="e.g., Quantum Project Lunch"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="bg-white/50 dark:bg-gray-900/50 border-white/20 dark:border-gray-700/30 text-lg font-medium rounded-2xl"
                                required
                            />

                            <div className="grid grid-cols-2 gap-6">
                                <Input
                                    label="Quantum Amount (₹)"
                                    type="number"
                                    min="0"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="bg-white/50 dark:bg-gray-900/50 border-white/20 dark:border-gray-700/30 font-bold text-primary-600 dark:text-primary-400 rounded-2xl"
                                    required
                                />
                                <Input
                                    label="Sync Date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="bg-white/50 dark:bg-gray-900/50 border-white/20 dark:border-gray-700/30 rounded-2xl"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">
                                    Entity Category
                                </label>
                                <div className="relative group/select">
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full h-12 rounded-2xl border border-white/20 dark:border-gray-700/30 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white px-5 transition-all outline-none focus:ring-2 focus:ring-primary-500/30 appearance-none font-medium"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name} className="dark:bg-gray-800">{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-primary-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border-2 border-dashed border-gray-200 dark:border-gray-700 transition-all hover:border-primary-500/50 group/upload cursor-pointer relative overflow-hidden">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm group-hover/upload:scale-110 transition-transform duration-300">
                                        <svg className="w-5 h-5 text-gray-400 group-hover/upload:text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Digital Artifact</p>
                                        <p className="text-[10px] text-gray-400 font-medium">Attach receipt verification</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => setReceiptFile(e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                {receiptFile && (
                                    <div className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {receiptFile.name}
                                    </div>
                                )}
                            </div>

                            <div className="relative group/desc">
                                <div className="flex items-center justify-between px-1 mb-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                        Brief Narrative
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleEnhanceDescription}
                                        disabled={isEnhancing}
                                        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tight transition-all"
                                    >
                                        <SparklesIcon className={`w-3 h-3 ${isEnhancing ? 'animate-spin' : 'animate-bounce'}`} />
                                        {isEnhancing ? 'Synthesizing...' : 'Aether Boost'}
                                    </button>
                                </div>
                                <textarea
                                    rows="2"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-2xl border border-white/20 dark:border-gray-700/30 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white px-5 py-3 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all resize-none font-medium text-sm"
                                    placeholder="Synthesize expense details..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            {!initialData && (
                                <button
                                    type="button"
                                    onClick={() => handleSubmit(null, true)}
                                    className="flex-1 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all tracking-widest uppercase"
                                >
                                    Draft
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all font-bold tracking-widest uppercase"
                            >
                                Abort
                            </button>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-primary-600 hover:from-emerald-400 hover:to-primary-500 text-white shadow-xl shadow-primary-500/25 border-none transform active:scale-95 transition-all text-sm font-bold tracking-widest uppercase"
                            >
                                {initialData ? 'Commit Update' : 'Initialize Sync'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ExpenseModal;
