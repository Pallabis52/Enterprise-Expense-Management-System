import api from './api';

const adminExpenseService = {
    // Get all expenses with pagination, sorting, and filtering
    getAllExpenses: async (params) => {
        // params: { page, limit, sort, order, status, search, startDate, endDate }
        const response = await api.get('/admin/expenses', { params });
        return response.data;
    },

    // Get single expense details
    getExpenseById: async (id) => {
        const response = await api.get(`/admin/expenses/${id}`);
        return response.data;
    },

    // Approve expense
    approveExpense: async (id) => {
        const response = await api.put(`/admin/expenses/${id}/approve`);
        return response.data;
    },

    // Reject expense
    rejectExpense: async (id, reason) => {
        const response = await api.put(`/admin/expenses/${id}/reject`, { reason });
        return response.data;
    },

    // Delete expense
    deleteExpense: async (id) => {
        const response = await api.delete(`/admin/expenses/${id}`);
        return response.data;
    },

    // Bulk actions
    bulkApprove: async (ids) => {
        const response = await api.put('/admin/expenses/bulk-approve', { ids });
        return response.data;
    }
};

export default adminExpenseService;
