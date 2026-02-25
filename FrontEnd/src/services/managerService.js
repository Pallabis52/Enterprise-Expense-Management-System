import api from './api';

const managerService = {
    // Get expenses for assigned team members
    getTeamExpenses: async (params) => {
        // params: { page, limit, status }
        const response = await api.get('/manager/team/expenses', { params });
        return response.data;
    },

    // Get specific expense details
    getExpenseById: async (id) => {
        // This might need a custom endpoint or reuse of a generic one
        const response = await api.get(`/expenses/getbyid/${id}`);
        return response.data;
    },

    // Approve team expense
    approveExpense: async (id) => {
        const response = await api.put(`/manager/expenses/${id}/approve`);
        return response.data;
    },

    // Reject team expense
    rejectExpense: async (id, reason) => {
        const response = await api.put(`/manager/expenses/${id}/reject`, { reason });
        return response.data;
    },

    // Get assigned team
    getTeam: async () => {
        const response = await api.get('/manager/team');
        return response.data;
    },

    // Get assigned team members
    getTeamMembers: async () => {
        const response = await api.get('/manager/team/members');
        return response.data;
    },

    // Get team reports/stats
    getTeamStats: async () => {
        const response = await api.get('/manager/team/performance');
        return response.data;
    },

    // Feature 1: Forward expense to admin with comment
    forwardToAdmin: async (id, comment) => {
        const response = await api.put(`/manager/expenses/${id}/forward`, { comment });
        return response.data;
    },

    bulkApprove: async (expenseIds, comment = 'Bulk approval') => {
        const response = await api.post('/manager/expenses/bulk-approve', { expenseIds, comment });
        return response.data;
    },

    // Feature 7: Manager dashboard
    getDashboard: async () => {
        const response = await api.get('/manager/dashboard');
        return response.data;
    }
};

export default managerService;
