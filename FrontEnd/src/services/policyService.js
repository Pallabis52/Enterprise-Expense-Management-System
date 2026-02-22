import api from './api';

const policyService = {
    // Admin
    getAllPolicies: async () => {
        const response = await api.get('/admin/policies');
        return response.data;
    },

    createPolicy: async (policyData) => {
        const response = await api.post('/admin/policies', policyData);
        return response.data;
    },

    updatePolicy: async (id, policyData) => {
        const response = await api.put(`/admin/policies/${id}`, policyData);
        return response.data;
    },

    deletePolicy: async (id) => {
        await api.delete(`/admin/policies/${id}`);
    },

    // Manager
    getActivePolicies: async () => {
        const response = await api.get('/manager/policies');
        return response.data;
    },

    createPolicyManager: async (policyData) => {
        const response = await api.post('/manager/policies', policyData);
        return response.data;
    }
};

export default policyService;
