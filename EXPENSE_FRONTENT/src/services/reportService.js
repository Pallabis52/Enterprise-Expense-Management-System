import api from './api';

const reportService = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/reports/stats');
        return response.data;
    },

    getMonthlyExpenses: async (year) => {
        const response = await api.get('/admin/reports/monthly', { params: { year } });
        return response.data;
    },

    getCategoryDistribution: async (filter) => {
        // filter: { startDate, endDate }
        const response = await api.get('/admin/reports/category-distribution', { params: filter });
        return response.data;
    }
};

export default reportService;
