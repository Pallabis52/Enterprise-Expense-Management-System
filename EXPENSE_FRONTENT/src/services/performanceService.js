import api from './api';

const performanceService = {
    getTeamPerformance: async () => {
        const response = await api.get('/performance/team');
        return response.data;
    }
};

export default performanceService;
