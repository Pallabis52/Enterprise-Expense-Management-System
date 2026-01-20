import React, { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useCategoryStore from '../../../store/categoryStore';

const PolicyModal = ({ isOpen, onClose, initialData, onSubmit, isLoading }) => {
    const { categories, fetchCategories } = useCategoryStore();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        maxAmount: '',
        monthlyLimit: '',
        requiresReceipt: false,
        isActive: true,
        allowedCategories: []
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                maxAmount: initialData.maxAmount || '',
                monthlyLimit: initialData.monthlyLimit || '',
                requiresReceipt: initialData.requiresReceipt || false,
                isActive: initialData.isActive ?? true,
                allowedCategories: initialData.allowedCategories || []
            });
        } else {
            setFormData({
                name: '',
                description: '',
                maxAmount: '',
                monthlyLimit: '',
                requiresReceipt: false,
                isActive: true,
                allowedCategories: []
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleCategoryToggle = (catName) => {
        setFormData(prev => {
            const current = prev.allowedCategories || [];
            if (current.includes(catName)) {
                return { ...prev, allowedCategories: current.filter(c => c !== catName) };
            } else {
                return { ...prev, allowedCategories: [...current, catName] };
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Policy" : "Create New Policy"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Policy Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Travel Policy 2024"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                        className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-primary-500 min-h-[60px]"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief detailed description..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Max Amount Per Expense"
                        type="number"
                        value={formData.maxAmount}
                        onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                        placeholder="0.00"
                    />
                    <Input
                        label="Monthly Limit"
                        type="number"
                        value={formData.monthlyLimit}
                        onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                        placeholder="0.00"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.requiresReceipt}
                            onChange={(e) => setFormData({ ...formData, requiresReceipt: e.target.checked })}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Requires Receipt</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Allowed Categories (Select all that apply)</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-xl">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryToggle(cat.name)}
                                className={`px-2 py-1 text-xs rounded-full border transition-colors ${formData.allowedCategories.includes(cat.name)
                                        ? 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" isLoading={isLoading}>{initialData ? 'Update' : 'Create'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default PolicyModal;
