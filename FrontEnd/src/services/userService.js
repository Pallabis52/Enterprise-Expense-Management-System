import api from './api';

const userService = {
    // Expenses
    getMyExpenses: async (params) => {
        const response = await api.get('/user/expenses', { params });
        return response.data;
    },

    getExpenseById: async (id) => {
        const response = await api.get(`/user/expenses/${id}`);
        return response.data;
    },

    addExpense: async (expenseData) => {
        const response = await api.post('/user/expenses', expenseData);
        return response.data;
    },

    updateExpense: async (id, expenseData) => {
        const response = await api.put(`/user/expenses/${id}`, expenseData);
        return response.data;
    },

    deleteExpense: async (id) => {
        await api.delete(`/user/expenses/${id}`);
    },

    getMyStats: async () => {
        const response = await api.get('/user/expenses/stats');
        return response.data;
    },

    // Profile
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.put('/user/profile', userData);
        return response.data;
    }
};

export default userService;
