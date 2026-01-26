import { create } from 'zustand';
import managerService from '../services/managerService';

const useManagerExpenseStore = create((set, get) => ({
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
        status: 'PENDING', // Default to pending for approvals
        search: '',
        startDate: null,
        endDate: null,
        employeeId: 'all'
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
            pagination: { ...state.pagination, page: 1 }
        }));
        get().fetchTeamExpenses();
    },

    setPage: (page) => {
        set((state) => ({ pagination: { ...state.pagination, page } }));
        get().fetchTeamExpenses();
    },

    fetchTeamExpenses: async () => {
        set({ isLoading: true, error: null });
        try {
            const { filters, pagination } = get();
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null && v !== 'all' && v !== ''))
            };

            const data = await managerService.getTeamExpenses(params);

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
            await managerService.approveExpense(id);
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
            await managerService.rejectExpense(id, reason);
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

export default useManagerExpenseStore;
