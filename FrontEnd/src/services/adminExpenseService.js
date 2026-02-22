import api from './api';

const adminExpenseService = {
    // Get all expenses 
    getAllExpenses: async (params) => {
        // Updated to use the new paginated AdminController endpoint
        const response = await api.get('/admin/expenses', { params });
        return response.data;
    },

    // Get single expense details
    getExpenseById: async (id) => {
        const response = await api.get(`/expenses/getbyid/${id}`);
        return response.data;
    },

    // Approve expense from Admin
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
        const response = await api.delete(`/expenses/delete/${id}`);
        return response.data;
    },

    // Bulk actions
    bulkApprove: async (ids) => {
        throw new Error("Bulk actions not supported by backend yet");
    }
};

export default adminExpenseService;
