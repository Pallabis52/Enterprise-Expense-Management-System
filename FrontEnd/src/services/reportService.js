import api from './api';

const reportService = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/reports/stats');
        return response.data;
    },

    getMonthlyExpenses: async (year) => {
        const response = await api.get(`/admin/reports/monthly?year=${year}`);
        return response.data;
    },

    getCategoryDistribution: async () => {
        const response = await api.get('/admin/reports/category');
        return response.data;
    }
};

export default reportService;
