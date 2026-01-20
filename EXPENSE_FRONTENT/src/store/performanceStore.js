import { create } from 'zustand';
import performanceService from '../services/performanceService';

const usePerformanceStore = create((set) => ({
    stats: null,
    isLoading: false,
    error: null,

    fetchTeamPerformance: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await performanceService.getTeamPerformance();
            set({ stats: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    }
}));

export default usePerformanceStore;
