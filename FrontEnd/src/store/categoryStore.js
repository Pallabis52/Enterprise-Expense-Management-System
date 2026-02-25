import { create } from 'zustand';
import categoryService from '../services/categoryService';

const useCategoryStore = create((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await categoryService.getAllCategories();
            set({ categories: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    addCategory: async (categoryData) => {
        set({ isLoading: true });
        try {
            const newCategory = await categoryService.createCategory(categoryData);
            set((state) => ({
                categories: [...state.categories, newCategory],
                isLoading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    updateCategory: async (id, categoryData) => {
        set({ isLoading: true });
        try {
            const updatedCategory = await categoryService.updateCategory(id, categoryData);
            set((state) => ({
                categories: state.categories.map(cat => cat.id === id ? updatedCategory : cat),
                isLoading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    deleteCategory: async (id) => {
        try {
            await categoryService.deleteCategory(id);
            set((state) => ({
                categories: state.categories.filter(cat => cat.id !== id)
            }));
            return true;
        } catch (error) {
            set({ error: error.message });
            return false;
        }
    },

    toggleCategory: async (id) => {
        try {
            const updated = await categoryService.toggleCategoryStatus(id);
            set((state) => ({
                categories: state.categories.map(cat => cat.id === id ? updated : cat)
            }));
            return true;
        } catch (error) {
            set({ error: error.message });
            return false;
        }
    }
}));

export default useCategoryStore;
