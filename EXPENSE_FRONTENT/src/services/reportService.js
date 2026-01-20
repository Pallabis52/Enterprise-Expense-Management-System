import api from './api';

const reportService = {
    getDashboardStats: async () => {
        // Mocking Dashboard Stats for now as backend lacks dedicated endpoint
        // In real app, create AdminController.getStats()
        // Here we just fetch all expenses to show *something* works, or return safe defaults
        try {
            // Just a ping to ensure token works
            await api.get('/expenses/get');
            return {
                totalExpenses: 125000,
                pendingApprovals: 5,
                approvedCount: 45,
                rejectedCount: 2
            };
        } catch (e) {
            return { totalExpenses: 0, pendingApprovals: 0, approvedCount: 0, rejectedCount: 0 };
        }
    },

    getMonthlyExpenses: async (year) => {
        // Backend has /expenses/getbymonthandyear/{month}/{year}
        // To get full year, we'd need to loop (inefficient) or add new endpoint.
        // For now, return mock data to prevent charts from crashing
        return [
            { month: 'Jan', amount: 4000 },
            { month: 'Feb', amount: 3000 },
            { month: 'Mar', amount: 2000 },
            { month: 'Apr', amount: 2780 },
            { month: 'May', amount: 1890 },
            { month: 'Jun', amount: 2390 },
            { month: 'Jul', amount: 3490 },
        ];
    },

    getCategoryDistribution: async (filter) => {
        // Backend has /expenses/category/{category} but no aggregations.
        // Mocking response
        return [
            { name: 'Travel', value: 400 },
            { name: 'Food', value: 300 },
            { name: 'Office', value: 300 },
            { name: 'Software', value: 200 },
        ];
    }
};

export default reportService;
