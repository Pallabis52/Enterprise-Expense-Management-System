import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for HttpOnly cookies
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // If you were using localStorage for tokens (not recommended if using HttpOnly cookies), you'd attach it here.
        // For now, we assume HttpOnly cookies are handled by the browser automatically.
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            // window.location.href = '/login'; // use with caution in SPA
        }
        return Promise.reject(error);
    }
);

export default api;
