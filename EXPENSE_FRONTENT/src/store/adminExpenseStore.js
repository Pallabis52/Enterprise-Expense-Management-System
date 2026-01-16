import { create } from 'zustand';
import adminExpenseService from '../services/adminExpenseService';

const useAdminExpenseStore = create((set, get) => ({
    expenses: [],
    currentExpense: null,
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    },
    filters: {
        status: 'all',
        search: '',
        startDate: null,
        endDate: null
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
            pagination: { ...state.pagination, page: 1 } // Reset to page 1 on filter change
        }));
        get().fetchExpenses();
    },

    setPage: (page) => {
        set((state) => ({ pagination: { ...state.pagination, page } }));
        get().fetchExpenses();
    },

    fetchExpenses: async () => {
        set({ isLoading: true, error: null });
        try {
            const { filters, pagination } = get();
            // Construct params, filtering out empty values
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null && v !== 'all' && v !== ''))
            };

            const data = await adminExpenseService.getAllExpenses(params);

            // Handle response structure (adjust based on actual API response)
            // Assuming: { content: [], totalElements: 0, totalPages: 0 } or similar
            set({
                expenses: data.content || data.expenses || [],
                pagination: {
                    ...pagination,
                    total: data.totalElements || data.total || 0,
                    totalPages: data.totalPages || 0
                },
                isLoading: false
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    approveExpense: async (id) => {
        try {
            await adminExpenseService.approveExpense(id);
            // Optimistic update or refetch
            set((state) => ({
                expenses: state.expenses.map(exp =>
                    exp.id === id ? { ...exp, status: 'APPROVED' } : exp
                )
            }));
            return true;
        } catch (error) {
            set({ error: error.message });
            return false;
        }
    },

    rejectExpense: async (id, reason) => {
        try {
            await adminExpenseService.rejectExpense(id, reason);
            set((state) => ({
                expenses: state.expenses.map(exp =>
                    exp.id === id ? { ...exp, status: 'REJECTED', rejectionReason: reason } : exp
                )
            }));
            return true;
        } catch (error) {
            set({ error: error.message });
            return false;
        }
    },

    setCurrentExpense: (expense) => set({ currentExpense: expense }),
}));

export default useAdminExpenseStore;
