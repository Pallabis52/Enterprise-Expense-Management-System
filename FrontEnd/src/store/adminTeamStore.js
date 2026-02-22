import { create } from 'zustand';
import teamService from '../services/teamService';

const useAdminTeamStore = create((set, get) => ({
    teams: [],
    isLoading: false,
    error: null,

    fetchTeams: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await teamService.getAllTeams();
            set({ teams: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    createTeam: async (name, managerId) => {
        set({ isLoading: true, error: null });
        try {
            await teamService.createTeam(name, managerId);
            await get().fetchTeams();
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    assignManager: async (teamId, managerId) => {
        set({ isLoading: true, error: null });
        try {
            await teamService.assignManager(teamId, managerId);
            await get().fetchTeams();
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    addMember: async (teamId, userId) => {
        set({ isLoading: true, error: null });
        try {
            await teamService.addMember(teamId, userId);
            await get().fetchTeams();
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    removeMember: async (teamId, userId) => {
        set({ isLoading: true, error: null });
        try {
            await teamService.removeMember(teamId, userId);
            await get().fetchTeams();
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },
    managers: [],
    availableUsers: [],

    fetchManagers: async () => {
        try {
            const data = await teamService.getUsersByRole('MANAGER');
            set({ managers: data });
        } catch (error) {
            set({ error: error.message });
        }
    },

    fetchAvailableUsers: async () => {
        try {
            const data = await teamService.getUsersByRole('USER');
            set({ availableUsers: data });
        } catch (error) {
            set({ error: error.message });
        }
    }
}));

export default useAdminTeamStore;
