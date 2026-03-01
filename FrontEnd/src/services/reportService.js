import api from './api';

const reportService = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/reports/stats');
        return response.data;
    },

    getMonthlyExpenses: async (year) => {
        const response = await api.get(`/admin/reports/monthly?year=${year}`);
        return response.data;
    },

    getCategoryDistribution: async () => {
        const response = await api.get('/admin/reports/category');
        return response.data;
    },

    exportExpensesToCsv: async () => {
        const response = await api.get('/reports/export/csv', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    exportMonthlyExpensesToCsv: async (month, year) => {
        const response = await api.get(`/reports/export/csv/month?month=${month}&year=${year}`, {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `expenses_${year}_${month}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    downloadUserExcel: async () => {
        const response = await api.get('/reports/download/user/excel', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `user-expenses-${new Date().getFullYear()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    downloadTeamExcel: async () => {
        const response = await api.get('/reports/download/team/excel', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `team-report-${new Date().getFullYear()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    downloadAuditPdf: async () => {
        const response = await api.get('/reports/download/audit/pdf', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `audit-report-${new Date().getFullYear()}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};

export default reportService;
