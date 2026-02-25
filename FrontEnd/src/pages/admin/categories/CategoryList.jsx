import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCategoryStore from '../../../store/categoryStore';
import Button from '../../../components/ui/Button';
import Toggle from '../../../components/ui/Toggle';
import CategoryModal from './CategoryModal';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    Squares2X2Icon,
    SparklesIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    UserGroupIcon,
    ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import Skeleton from '../../../components/ui/Skeleton';
import Swal from 'sweetalert2';

const CategoryList = () => {
    const { categories, isLoading, fetchCategories, deleteCategory, toggleCategory } = useCategoryStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Decommission Sector?',
            text: 'Are you sure you want to delete this tactical sector?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm Deletion',
            cancelButtonText: 'Abort',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            await deleteCategory(id);
            Swal.fire({
                title: 'Sector Neutralized',
                text: 'The tactical sector has been removed from the grid.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const handleOpenAdd = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'ADMIN': return <ShieldExclamationIcon className="w-3.5 h-3.5" />;
            case 'MANAGER': return <UserGroupIcon className="w-3.5 h-3.5" />;
            default: return <UserCircleIcon className="w-3.5 h-3.5" />;
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* ── Aether Mesh Header ── */}
            <div className="relative p-10 rounded-[3rem] overflow-hidden bg-gray-900 shadow-2xl border border-white/10 group">
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-primary-500/20 transition-all duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] -ml-40 -mb-40 group-hover:bg-accent-500/20 transition-all duration-1000"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center md:justify-start gap-4"
                        >
                            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg group-hover:rotate-6 transition-transform">
                                <Squares2X2Icon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em]">Operational Parameters</span>
                                <h1 className="text-4xl font-black text-white uppercase tracking-tighter mt-1">Luminous Sectors</h1>
                            </div>
                        </motion.div>
                        <p className="text-gray-400 max-w-md text-sm font-medium leading-relaxed">
                            Configure and harmonize the expense taxonomy with enterprise-grade modularity and tactical visual synchronization.
                        </p>
                    </div>

                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-600 text-white shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all active:scale-95 group font-black uppercase text-xs tracking-widest"
                    >
                        <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Initialize Sector
                    </button>
                </div>
            </div>

            {/* ── Category Intelligence Grid ── */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white dark:border-gray-700/50 shadow-2xl hover:shadow-indigo-500/10 transition-all overflow-hidden"
                            >
                                {/* Holographic Glow */}
                                <div
                                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                                    style={{ backgroundColor: category.color || '#6366f1' }}
                                />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="relative">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-12 transition-transform duration-500"
                                            style={{
                                                backgroundColor: category.color || '#6366f1',
                                                boxShadow: `0 10px 30px -10px ${category.color}80`
                                            }}
                                        >
                                            <span className="text-3xl font-black uppercase">{category.name[0]}</span>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-gray-900 text-white shadow-md">
                                            {getRoleIcon(category.allowedRole)}
                                        </div>
                                    </div>

                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-3 bg-white/50 dark:bg-gray-700/50 hover:bg-primary-500 hover:text-white rounded-xl transition-all border border-gray-100 dark:border-gray-600 shadow-sm"
                                        >
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="p-3 bg-white/50 dark:bg-gray-700/50 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-gray-100 dark:border-gray-600 shadow-sm"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{category.name}</h3>
                                        <SparklesIcon className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2 h-10">
                                        {category.description || "Operational parameters not specified for this tactical sector."}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full animate-pulse"
                                            style={{ backgroundColor: category.color || '#6366f1' }}
                                        />
                                        <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                            {category.allowedRole || 'ALL OPERATIVES'}
                                        </span>
                                    </div>
                                    <Toggle
                                        checked={category.active !== false}
                                        onChange={() => toggleCategory(category.id)}
                                        className="transform scale-90"
                                    />
                                </div>
                            </motion.div>
                        ))}

                        {/* Tactical Add Sector Placeholder */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleOpenAdd}
                            className="flex flex-col items-center justify-center p-8 border-3 border-dashed border-gray-200 dark:border-gray-700 rounded-[2.5rem] hover:border-primary-500/50 hover:bg-primary-500/5 transition-all group min-h-[250px]"
                        >
                            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-inner group-hover:shadow-primary-500/20 mb-4">
                                <PlusIcon className="w-10 h-10" />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] group-hover:text-primary-500">Add Sector Module</span>
                        </motion.button>
                    </AnimatePresence>
                </div>
            )}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingCategory}
            />
        </div>
    );
};

export default CategoryList;
