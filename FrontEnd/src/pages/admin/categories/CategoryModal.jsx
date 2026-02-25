import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useCategoryStore from '../../../store/categoryStore';
import {
    TagIcon,
    SwatchIcon,
    QueueListIcon,
    ShieldCheckIcon,
    XMarkIcon,
    SparklesIcon,
    UserIcon,
    UserGroupIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

const PRESET_COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4',
    '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#64748B'
];

const ROLES = [
    { value: 'USER', label: 'Tier 1: Operative', icon: <UserIcon />, color: 'text-blue-500' },
    { value: 'MANAGER', label: 'Tier 2: Commander', icon: <UserGroupIcon />, color: 'text-purple-500' },
    { value: 'ADMIN', label: 'Tier 3: Architect', icon: <ShieldCheckIcon />, color: 'text-emerald-500' }
];

const TacticalRoleSelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedRole = ROLES.find(r => r.value === value) || ROLES[0];

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-14 bg-white/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 flex items-center justify-between group/select transition-all hover:ring-2 hover:ring-emerald-500/20 shadow-sm"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl bg-gray-100 dark:bg-white/5 ${selectedRole.color}`}>
                        {React.cloneElement(selectedRole.icon, { className: "w-5 h-5" })}
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{selectedRole.label}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 8, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[100] w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-3xl border border-gray-100 dark:border-white/10 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden"
                    >
                        <div className="p-3 space-y-2">
                            {ROLES.map((role) => (
                                <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(role.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group/opt ${value === role.value
                                        ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30'
                                        : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    <div className={`p-2.5 rounded-xl transition-colors ${value === role.value ? 'bg-white dark:bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-gray-50 dark:bg-white/5 group-hover/opt:bg-white group-hover/opt:text-emerald-500'
                                        }`}>
                                        {React.cloneElement(role.icon, { className: "w-5 h-5" })}
                                    </div>
                                    <div className="flex flex-col items-start translate-y-[1px]">
                                        <span className={`text-[11px] font-black uppercase tracking-widest leading-none mb-1 ${value === role.value ? 'text-emerald-500' : ''}`}>
                                            {role.label.split(':')[0]}
                                        </span>
                                        <span className="text-sm font-bold opacity-80">{role.label.split(':')[1].trim()}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CategoryModal = ({ isOpen, onClose, initialData }) => {
    const { addCategory, updateCategory, isLoading } = useCategoryStore();
    const [formData, setFormData] = useState({
        name: '',
        color: '#6366F1',
        description: '',
        allowedRole: 'USER'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                color: initialData.color || '#6366F1',
                description: initialData.description || '',
                allowedRole: initialData.allowedRole || 'USER'
            });
        } else {
            setFormData({ name: '', color: '#6366F1', description: '', allowedRole: 'USER' });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let success = false;
        if (initialData) {
            success = await updateCategory(initialData.id, formData);
        } else {
            success = await addCategory(formData);
        }
        if (success) onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="p-0 bg-transparent shadow-none max-w-5xl"
        >
            <div className="relative overflow-hidden rounded-[3.5rem] bg-white/70 dark:bg-gray-950/70 backdrop-blur-[45px] border border-white/40 dark:border-white/10 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.5)]">
                {/* ── Wide Horizon Header ── */}
                <div className="relative px-12 py-10 bg-gray-900 overflow-hidden border-b border-white/5">
                    {/* Background Visuals */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-gray-950 to-accent-950 opacity-80" />
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -mt-48" />

                    {/* Scanning Bar Animation */}
                    <motion.div
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-primary-500/5 to-transparent pointer-events-none"
                    />

                    <div className="relative z-10 flex justify-between items-center">
                        <div className="flex items-center gap-8">
                            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 shadow-2xl">
                                <SparklesIcon className="w-8 h-8 text-primary-400 animate-pulse" />
                            </div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-[1px] bg-primary-500" />
                                    <span className="text-[9px] font-black text-primary-400 uppercase tracking-[0.6em]">Module Deployment Sequence</span>
                                </div>
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                                    {initialData ? 'Sync Parameters' : 'Deploy Sector'}
                                </h2>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-5 rounded-3xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all ring-1 ring-white/10 group/close"
                        >
                            <XMarkIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    </div>
                </div>

                {/* ── Mission Control Hub ── */}
                <form onSubmit={handleSubmit} className="p-10 bg-white/10 dark:bg-black/40">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* ── Column 1: Identification & Chromatics ── */}
                        <div className="space-y-10">
                            {/* Sector Identity Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative p-8 rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-2xl group/section"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-500 ring-1 ring-primary-500/30">
                                        <TagIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Identity Protocol</h3>
                                </div>

                                <div className="space-y-8">
                                    <div className="relative group/input">
                                        <label className="block text-[10px] font-black text-primary-500 uppercase tracking-widest mb-3 ml-1">Designation</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full h-14 bg-white/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 transition-all outline-none shadow-sm"
                                            placeholder="Enter Sector Name"
                                            required
                                        />
                                    </div>

                                    <div className="relative group/input">
                                        <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 ml-1">Security Tier</label>
                                        <div className="z-[50]">
                                            <TacticalRoleSelector
                                                value={formData.allowedRole || 'USER'}
                                                onChange={(val) => setFormData({ ...formData, allowedRole: val })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Chromatic Signature Sync */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="relative p-8 rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-2xl group/section"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 rounded-2xl bg-accent-500/10 text-accent-500 ring-1 ring-accent-500/30">
                                        <SwatchIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Chromatic Signature</h3>
                                </div>

                                <div className="flex flex-wrap gap-6 items-center justify-between">
                                    <div className="flex-grow grid grid-cols-5 gap-3">
                                        {PRESET_COLORS.map(color => (
                                            <motion.button
                                                key={color}
                                                type="button"
                                                whileHover={{ scale: 1.2, rotate: 10 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setFormData({ ...formData, color })}
                                                className={`h-10 rounded-[1rem] transition-all relative overflow-hidden group/color ${formData.color === color
                                                    ? 'ring-2 ring-white ring-offset-4 ring-offset-accent-500'
                                                    : 'opacity-40 hover:opacity-100'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <div className="relative group/picker">
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="w-16 h-16 p-1 rounded-[1.5rem] cursor-pointer bg-white/50 dark:bg-gray-800/50 shadow-2xl border border-white/40 group-hover/picker:scale-110 transition-transform"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* ── Column 2: Narrative & Actions ── */}
                        <div className="flex flex-col h-full space-y-10">
                            {/* Operational Narrative */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex-grow relative p-8 rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-2xl group/section"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30">
                                        <QueueListIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Operational Narrative</h3>
                                </div>

                                <textarea
                                    className="w-full h-[calc(100%-80px)] min-h-[160px] bg-white/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-[2rem] px-8 py-6 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 transition-all outline-none resize-none shadow-inner"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Detail the logistical scope of this sector..."
                                />
                            </motion.div>

                            {/* Action Control Hub */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex gap-6"
                            >
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-6 rounded-[2rem] bg-gray-100 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-black uppercase text-[11px] tracking-[0.4em] hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/30 transition-all active:scale-95 shadow-xl"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-[2] relative py-6 rounded-[2rem] overflow-hidden group/submit shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 animate-gradient-x" />
                                    <div className="absolute inset-0 opacity-0 group-hover/submit:opacity-100 bg-white/10 transition-opacity" />

                                    <div className="relative z-10 flex items-center justify-center gap-4 text-white font-black uppercase text-[11px] tracking-[0.4em]">
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                                <span>Confirm Deployment</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CategoryModal;
