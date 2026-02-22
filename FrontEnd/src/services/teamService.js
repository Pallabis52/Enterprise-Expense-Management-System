import api from './api';

const teamService = {
    // Admin: Create a new team
    createTeam: async (name, managerId) => {
        const response = await api.post('/admin/teams', { name, managerId });
        return response.data;
    },

    // Admin: Assign a manager to a team
    assignManager: async (teamId, managerId) => {
        const response = await api.put(`/admin/teams/${teamId}/manager`, { managerId });
        return response.data;
    },

    // Admin: Add a member to a team
    addMember: async (teamId, userId) => {
        const response = await api.put(`/admin/teams/${teamId}/members`, { userId });
        return response.data;
    },

    // Admin: Remove a member from a team
    removeMember: async (teamId, userId) => {
        const response = await api.delete(`/admin/teams/${teamId}/members/${userId}`);
        return response.data;
    },

    // Admin: Get users by role
    getUsersByRole: async (role) => {
        const response = await api.get('/admin/users', { params: { role } });
        return response.data;
    },

    // Admin: Get all teams
    getAllTeams: async () => {
        const response = await api.get('/admin/teams');
        return response.data;
    }
};

export default teamService;
