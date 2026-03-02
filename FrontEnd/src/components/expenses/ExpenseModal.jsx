import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, SparklesIcon, BuildingStorefrontIcon, SignalIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import VoiceExpenseButton from '../ai/VoiceExpenseButton';
import { enhanceDescription } from '../../services/aiService';
import vendorService from '../../services/vendorService';
import toast from 'react-hot-toast';
import CustomDropdown from '../ui/CustomDropdown';
import { formatCurrency, cn } from '../../utils/helpers';

const ExpenseModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const [formData, setFormData] = useState({
        title: '',
        vendorName: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: ''
    });
    const [receiptFile, setReceiptFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isEnhancing, setIsEnhancing] = useState(false);

    // Vendor Specific State
    const [vendorSuggestions, setVendorSuggestions] = useState([]);
    const [frequentVendors, setFrequentVendors] = useState([]);
    const [vendorInsights, setVendorInsights] = useState(null);
    const [isSuspicious, setIsSuspicious] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);

    // Fetch frequent vendors and categories on mount
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [catData, freqData] = await Promise.all([
                    import('../../services/categoryService').then(m => m.default.getAllCategories()),
                    vendorService.getFrequent()
                ]);
                setCategories(catData);
                setFrequentVendors(freqData);
            } catch (err) {
                console.error('Failed to fetch metadata', err);
            }
        };
        if (isOpen) fetchMetadata();
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                vendorName: initialData.vendorName || '',
                amount: initialData.amount || '',
                date: initialData.date || new Date().toISOString().split('T')[0],
                category: initialData.category || '',
                description: initialData.description || ''
            });
            if (initialData.vendorName) fetchVendorInsights(initialData.vendorName);
        } else {
            setFormData({
                title: '',
                vendorName: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: categories.length > 0 ? categories[0].name : '',
                description: ''
            });
            setVendorInsights(null);
            setIsSuspicious(false);
            setReceiptFile(null);
        }
    }, [initialData, isOpen, categories]);

    // Handle clicks outside suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchVendorInsights = async (name) => {
        if (!name) return;
        try {
            const insights = await vendorService.getInsights(name);
            if (Object.keys(insights).length > 0) {
                setVendorInsights(insights);
                // Auto-fill category if insight has it
                if (insights.category && !formData.category) {
                    setFormData(prev => ({ ...prev, category: insights.category }));
                }
            } else {
                setVendorInsights(null);
            }
        } catch (err) {
            console.error('Insights failed', err);
        }
    };

    const handleVendorChange = async (val) => {
        setFormData({ ...formData, vendorName: val });
        if (val.length > 1) {
            const suggestions = await vendorService.getSuggestions(val);
            setVendorSuggestions(suggestions);
            setShowSuggestions(true);
        } else {
            setVendorSuggestions([]);
            setShowSuggestions(false);
        }
        // Minimal debounce or just fetch insights
        if (val.length > 2) fetchVendorInsights(val);
    };

    const selectVendor = (val) => {
        setFormData({ ...formData, vendorName: val });
        setShowSuggestions(false);
        fetchVendorInsights(val);
    };

    const handleAmountChange = async (val) => {
        setFormData({ ...formData, amount: val });
        if (formData.vendorName && val) {
            const result = await vendorService.checkAmount(formData.vendorName, val);
            setIsSuspicious(result.suspicious);
        } else {
            setIsSuspicious(false);
        }
    };

    const handleVoiceParsed = (data) => {
        setFormData({
            ...formData,
            title: data.title || data.description || formData.title,
            vendorName: data.vendor || formData.vendorName,
            amount: data.amount || formData.amount,
            category: data.category || formData.category,
            description: data.description || formData.description,
            date: data.date || formData.date
        });
        if (data.vendor) fetchVendorInsights(data.vendor);
    };

    const handleEnhanceDescription = async () => {
        if (!formData.title || !formData.amount) {
            toast.error('Please enter title and amount first');
            return;
        }
        setIsEnhancing(true);
        try {
            const res = await enhanceDescription(formData.title, formData.amount, formData.category);
            if (!res.fallback) {
                setFormData({ ...formData, description: res.result });
                toast.success('Description boosted!');
            } else {
                toast.error(res.result || 'AI enhancement failed');
            }
        } catch (err) {
            toast.error('AI enhancement failed');
        } finally {
            setIsEnhancing(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = (e, isDraft = false) => {
        if (e) e.preventDefault();
        onSubmit(formData, receiptFile, isDraft);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative group max-w-lg w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 to-accent-600/30 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 dark:border-gray-700/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden transform transition-all animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                    <div className="relative p-8 pb-6 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                                    {initialData ? 'Refine Expense' : 'New Transaction'}
                                </h3>
                                <p className="text-xs font-bold text-primary-600/60 dark:text-primary-400/60 uppercase tracking-[0.2em] mt-0.5">
                                    Nexus Protocol Interface
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:rotate-90 transition-all duration-300">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={(e) => handleSubmit(e, false)} className="px-8 pb-8 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                        {!initialData && (
                            <div className="relative p-5 rounded-3xl bg-gradient-to-br from-indigo-500/5 to-purple-600/5 border border-dashed border-indigo-500/20 flex flex-col items-center gap-2 group/voice transition-all duration-300 hover:bg-indigo-500/10">
                                <VoiceExpenseButton onParsed={handleVoiceParsed} />
                                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">Neural Input Active</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Vendor Section */}
                            <div className="relative" ref={suggestionRef}>
                                <Input
                                    label="Vendor / Merchant"
                                    icon={BuildingStorefrontIcon}
                                    placeholder="Where did you spend?"
                                    value={formData.vendorName}
                                    onChange={(e) => handleVendorChange(e.target.value)}
                                    className="bg-white/50 dark:bg-gray-900/50 border-white/20 dark:border-gray-700/30 font-bold rounded-2xl"
                                    required
                                />
                                {showSuggestions && vendorSuggestions.length > 0 && (
                                    <div className="absolute z-[120] left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                        {vendorSuggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => selectVendor(s)}
                                                className="w-full px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                                            >
                                                <BuildingStorefrontIcon className="w-4 h-4 text-indigo-500" /> {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {!formData.vendorName && frequentVendors.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {frequentVendors.map((v, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => selectVendor(v)}
                                                className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700/50 text-[10px] font-black text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all uppercase tracking-tighter"
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Vendor Insights Display */}
                            {vendorInsights && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 grid grid-cols-2 gap-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                            <ClockIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Avg Spend</p>
                                            <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{formatCurrency(vendorInsights.avgAmount)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                            <SignalIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Suggested</p>
                                            <p className="text-sm font-black text-purple-600 dark:text-purple-400 mt-0.5">{vendorInsights.suggestedRange}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <Input
                                label="Expense Title"
                                placeholder="Quantum Project Lunch"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="bg-white/50 dark:bg-gray-900/50 border-white/20 dark:border-gray-700/30 rounded-2xl"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Input
                                        label="Quantum Amount (₹)"
                                        type="number"
                                        min="0"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        error={isSuspicious ? "Anomaly: significantly higher than usual" : null}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        className={cn(
                                            "bg-white/50 dark:bg-gray-900/50 border-white/20 dark:border-gray-700/30 font-bold rounded-2xl",
                                            isSuspicious && "text-rose-500 border-rose-500"
                                        )}
                                        required
                                    />
                                    {isSuspicious && (
                                        <p className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1">
                                            <ExclamationCircleIcon className="w-3 h-3" /> High deviation detected
                                        </p>
                                    )}
                                </div>
                                <Input
                                    label="Sync Date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="bg-white/50 dark:bg-gray-900/50 border-white/20 dark:border-gray-700/30 rounded-2xl"
                                    required
                                />
                            </div>

                            <CustomDropdown
                                label="Entity Category"
                                options={categories.map(cat => ({
                                    label: cat.name,
                                    value: cat.name,
                                    description: `Fiscal Category: ${cat.id}`
                                }))}
                                value={formData.category}
                                onChange={(val) => setFormData({ ...formData, category: val })}
                                className="z-[110]"
                            />

                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border-2 border-dashed border-gray-200 dark:border-gray-700 transition-all hover:border-indigo-500/50 group/upload cursor-pointer relative overflow-hidden">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm group-hover/upload:scale-110 transition-transform duration-300 text-gray-400 group-hover/upload:text-indigo-500">
                                        <BuildingStorefrontIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Digital Artifact</p>
                                        <p className="text-[10px] text-gray-400 font-medium">Attach receipt verification</p>
                                    </div>
                                    <input type="file" accept="image/*,.pdf" onChange={(e) => setReceiptFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                                {receiptFile && (
                                    <div className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                        {receiptFile.name}
                                    </div>
                                )}
                            </div>

                            <div className="relative group/desc">
                                <div className="flex items-center justify-between px-1 mb-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Brief Narrative</label>
                                    <button type="button" onClick={handleEnhanceDescription} disabled={isEnhancing} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tight transition-all">
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
                                <button type="button" onClick={() => handleSubmit(null, true)} className="flex-1 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-[10px] font-black text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all tracking-[0.2em] uppercase">Draft</button>
                            )}
                            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-[10px] font-black text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all tracking-[0.2em] uppercase">Abort</button>
                            <Button type="submit" isLoading={isLoading} className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-50 text-white shadow-xl shadow-indigo-500/25 border-none transform active:scale-95 transition-all text-xs font-black tracking-[0.2em] uppercase">
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
