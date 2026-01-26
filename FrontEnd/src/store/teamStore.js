import { create } from 'zustand';
import managerService from '../services/managerService';

const useTeamStore = create((set) => ({
    members: [],
    isLoading: false,
    error: null,
    stats: null,

    fetchTeamMembers: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await managerService.getTeamMembers();
            set({ members: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchTeamStats: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const data = await managerService.getTeamStats(filters);
            set({ stats: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    }
}));

export default useTeamStore;
