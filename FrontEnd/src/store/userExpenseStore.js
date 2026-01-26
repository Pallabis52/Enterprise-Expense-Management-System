import { create } from 'zustand';
import userService from '../services/userService';

const useUserExpenseStore = create((set, get) => ({
    expenses: [],
    stats: null,
    isLoading: false,
    error: null,
    pagination: {
        totalPages: 0,
        totalElements: 0,
        currentPage: 1
    },

    // Actions
    fetchMyExpenses: async (page = 1, status = 'all') => {
        set({ isLoading: true, error: null });
        try {
            const params = { page, limit: 10 };
            if (status && status !== 'all') params.status = status;

            const data = await userService.getMyExpenses(params);

            set({
                expenses: data.content,
                pagination: {
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: page
                },
                isLoading: false
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchMyStats: async () => {
        try {
            const data = await userService.getMyStats();
            set({ stats: data });
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    },

    addExpense: async (expenseData) => {
        set({ isLoading: true, error: null });
        try {
            await userService.addExpense(expenseData);
            set({ isLoading: false });
            get().fetchMyExpenses(1); // Refresh list
            get().fetchMyStats(); // Refresh stats
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateExpense: async (id, expenseData) => {
        set({ isLoading: true, error: null });
        try {
            await userService.updateExpense(id, expenseData);
            set({ isLoading: false });
            get().fetchMyExpenses(get().pagination.currentPage);
            get().fetchMyStats();
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    deleteExpense: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await userService.deleteExpense(id);
            set({ isLoading: false });
            get().fetchMyExpenses(get().pagination.currentPage);
            get().fetchMyStats();
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    }
}));

export default useUserExpenseStore;
