import api from './api';

const managerService = {
    // Get expenses for assigned team members
    getTeamExpenses: async (params) => {
        // params: { page, limit, status, search, startDate, endDate }
        const response = await api.get('/manager/expenses', { params });
        return response.data;
    },

    // Get specific expense details
    getExpenseById: async (id) => {
        const response = await api.get(`/manager/expenses/${id}`);
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

    // Bulk actions (Note: Backend may not implement this yet, keeping for future)
    bulkApprove: async (ids) => {
        // const response = await api.put('/manager/expenses/bulk-approve', { ids });
        // return response.data;
        throw new Error("Bulk approve not fully implemented in backend yet");
    },

    // Get assigned team members
    getTeamMembers: async () => {
        const response = await api.get('/manager/team');
        return response.data;
    },

    // Get team reports/stats
    getTeamStats: async (params) => {
        const response = await api.get('/manager/reports/stats', { params });
        return response.data;
    }
};

export default managerService;
