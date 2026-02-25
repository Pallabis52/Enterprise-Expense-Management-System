import { create } from 'zustand';
import managerService from '../services/managerService';

const useManagerExpenseStore = create((set, get) => ({
    expenses: [],
    currentExpense: null,
    loading: false,
    isLoading: false,
    error: null,
    dashboard: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    },

    setExpenses: (newExpenses) => {
        set({
            expenses: newExpenses,
            pagination: {
                page: 1,
                limit: 10,
                total: newExpenses.length,
                totalPages: 1
            }
        });
    },

    teamMembers: [],
    filters: {
        status: 'PENDING',
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

    // Legacy fetch (uses filters from state)
    fetchTeamExpenses: async () => {
        set({ isLoading: true, loading: true, error: null });
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
                isLoading: false,
                loading: false
            });
        } catch (error) {
            set({ error: error.message, isLoading: false, loading: false });
        }
    },

    // New fetch with explicit params (used by ManagerExpenseList)
    fetchExpenses: async ({ status, page = 1 } = {}) => {
        set({ loading: true, isLoading: true, error: null });
        try {
            const { pagination } = get();
            const params = { page, limit: pagination.limit };
            if (status) params.status = status;

            const data = await managerService.getTeamExpenses(params);
            set({
                expenses: data.content || data.expenses || [],
                pagination: {
                    ...pagination,
                    page,
                    total: data.totalElements || 0,
                    totalPages: data.totalPages || 0
                },
                loading: false,
                isLoading: false
            });
        } catch (error) {
            set({ error: error.message, loading: false, isLoading: false });
        }
    },

    // Feature 7: Fetch manager dashboard KPIs
    fetchDashboard: async () => {
        try {
            const data = await managerService.getDashboard();
            set({ dashboard: data });
        } catch (error) {
            console.error('Failed to fetch manager dashboard:', error);
        }
    },

    fetchTeamMembers: async () => {
        try {
            const data = await managerService.getTeamMembers();
            set({ teamMembers: data });
        } catch (error) {
            console.error('Failed to fetch team members:', error);
        }
    },

    approveExpense: async (id, comment) => {
        try {
            await managerService.approveExpense(id, comment);
            set((state) => ({
                expenses: state.expenses.map(exp =>
                    exp.id === id ? { ...exp, status: 'APPROVED', approvalComment: comment } : exp
                )
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message });
            throw error;
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
            set({ error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    // Feature 1: Forward expense to admin
    forwardToAdmin: async (id, comment) => {
        try {
            await managerService.forwardToAdmin(id, comment);
            set((state) => ({
                expenses: state.expenses.map(exp =>
                    exp.id === id ? { ...exp, status: 'FORWARDED_TO_ADMIN', approvalComment: comment } : exp
                )
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    setCurrentExpense: (expense) => set({ currentExpense: expense }),
}));

export default useManagerExpenseStore;
