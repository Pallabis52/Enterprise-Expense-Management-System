import api from './api';

const notificationService = {

    getNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    markAsRead: async (id) => {
        await api.put(`/notifications/${id}/read`);
    },

    markAllAsRead: async () => {
        await api.put('/notifications/read-all');
    }
};

export default notificationService;
