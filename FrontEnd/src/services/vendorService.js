import api from './api';

const vendorService = {
    getSuggestions: async (query) => {
        const response = await api.get('/vendors/suggest', { params: { query } });
        return response.data;
    },

    getInsights: async (vendorName) => {
        const response = await api.get(`/vendors/insights/${vendorName}`);
        return response.data;
    },

    getFrequent: async () => {
        const response = await api.get('/vendors/frequent');
        return response.data;
    },

    checkAmount: async (vendorName, amount) => {
        const response = await api.post('/vendors/check-amount', { vendorName, amount });
        return response.data;
    }
};

export default vendorService;
