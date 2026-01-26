import api from './api';

const inviteService = {
    createInvite: async (data) => {
        const response = await api.post('/invites/create', data);
        return response.data;
    },
    validateToken: async (token) => {
        const response = await api.get(`/invites/validate/${token}`);
        return response.data;
    }
};

export default inviteService;
