import { create } from 'zustand';
import reportService from '../services/reportService';

const useReportStore = create((set) => ({
    stats: null,
    monthlyData: [],
    categoryData: [],
    isLoading: false,
    error: null,

    fetchDashboardData: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetch all data in parallel
            const [stats, monthly, category] = await Promise.all([
                reportService.getDashboardStats(),
                reportService.getMonthlyExpenses(new Date().getFullYear()),
                reportService.getCategoryDistribution()
            ]);

            set({
                stats,
                monthlyData: monthly,
                categoryData: category,
                isLoading: false
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    }
}));

export default useReportStore;
