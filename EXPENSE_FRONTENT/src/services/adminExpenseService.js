import api from './api';

const adminExpenseService = {
    // Get all expenses 
    getAllExpenses: async (params) => {
        // Backend now at /api/expenses/get
        // BaseURL is /api, so relative path is /expenses/get
        const response = await api.get('/expenses/get');
        return response.data;
    },

    // Get single expense details
    getExpenseById: async (id) => {
        const response = await api.get(`/expenses/getbyid/${id}`);
        return response.data;
    },

    // Approve expense from Admin
    approveExpense: async (id) => {
        const response = await api.put(`/expenses/approve/${id}/ADMIN`);
        return response.data;
    },

    // Reject expense
    rejectExpense: async (id, reason) => {
        // Fallback to Manager endpoint or implementing specific admin reject
        const response = await api.put(`/manager/expenses/${id}/reject`, { reason });
        return response.data;
    },

    // Delete expense
    deleteExpense: async (id) => {
        const response = await api.delete(`/expenses/delete/${id}`);
        return response.data;
    },

    // Bulk actions
    bulkApprove: async (ids) => {
        throw new Error("Bulk actions not supported by backend yet");
    }
};

export default adminExpenseService;
