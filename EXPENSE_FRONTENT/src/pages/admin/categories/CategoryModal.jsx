import React, { useEffect } from 'react';

import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useCategoryStore from '../../../store/categoryStore';

// Simple preset colors if we prefer that over a picker
const PRESET_COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4',
    '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#64748B'
];

const CategoryModal = ({ isOpen, onClose, initialData }) => {
    const { addCategory, updateCategory, isLoading } = useCategoryStore();

    // Using simple state for form to avoid extra dependencies if not needed
    const [formData, setFormData] = React.useState({
        name: '',
        color: '#3B82F6',
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                color: initialData.color || '#3B82F6',
                description: initialData.description || '',
                allowedRole: initialData.allowedRole || 'USER'
            });
        } else {
            setFormData({ name: '', color: '#3B82F6', description: '', allowedRole: 'USER' });
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
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Category" : "Add New Category"}>
            <form onSubmit={handleSubmit} className="space-y-4">

                <Input
                    label="Category Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Travel, Office Supplies"
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Allowed Role
                    </label>
                    <select
                        className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-primary-500 p-2.5"
                        value={formData.allowedRole || ''}
                        onChange={(e) => setFormData({ ...formData, allowedRole: e.target.value || null })}
                    >
                        <option value="">All Roles (Global)</option>
                        <option value="USER">User</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Color Badge
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {PRESET_COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setFormData({ ...formData, color })}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                                    }`}
                                style={{ backgroundColor: color }}
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                        <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-8 h-8 p-0 rounded-full overflow-hidden border-0 cursor-pointer"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea
                        className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-primary-500 min-h-[80px]"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Optional description..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {initialData ? 'Update Category' : 'Create Category'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CategoryModal;
