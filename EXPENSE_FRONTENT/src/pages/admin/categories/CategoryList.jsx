import React, { useEffect, useState } from 'react';
import useCategoryStore from '../../../store/categoryStore';
import Button from '../../../components/ui/Button';
import Toggle from '../../../components/ui/Toggle';
import CategoryModal from './CategoryModal';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Skeleton from '../../../components/ui/Skeleton';

const CategoryList = () => {
    const { categories, isLoading, fetchCategories, deleteCategory } = useCategoryStore();
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
        if (window.confirm('Are you sure you want to delete this category?')) {
            await deleteCategory(id);
        }
    };

    const handleOpenAdd = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage expense categories and colors.</p>
                </div>
                <Button onClick={handleOpenAdd}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Category
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                        >
                            <div
                                className="absolute top-0 right-0 w-24 h-24 bg-current opacity-5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"
                                style={{ color: category.color }}
                            />

                            <div className="flex justify-between items-start mb-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg"
                                    style={{ backgroundColor: category.color }}
                                >
                                    <span className="text-xl font-bold">{category.name[0]}</span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{category.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 h-10">
                                {category.description || "No description."}
                            </p>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-400 uppercase">Status</span>
                                {/* Placeholder toggle action - could be real later */}
                                <Toggle checked={true} onChange={() => { }} className="transform scale-75 origin-right" />
                            </div>
                        </div>
                    ))}

                    {/* Add New Card Placeholder */}
                    <button
                        onClick={handleOpenAdd}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-gray-400 hover:text-primary-500"
                    >
                        <PlusIcon className="w-12 h-12 mb-2 opacity-50" />
                        <span className="font-medium">Create New Category</span>
                    </button>
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
