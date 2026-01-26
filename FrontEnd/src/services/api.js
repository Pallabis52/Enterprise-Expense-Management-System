import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for HttpOnly cookies
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

import Swal from 'sweetalert2';

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response ? error.response.status : null;
        const message = error.response?.data?.message || 'Something went wrong. Please try again.';

        if (status === 401) {
            // Unauthenticated
            Swal.fire({
                icon: 'warning',
                title: 'Session Expired',
                text: 'Please log in again.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Log In'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            });
        } else if (status === 403) {
            // Forbidden
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'You do not have permission to perform this action.',
            });
        } else if (status >= 500) {
            // Server Error
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'A server error occurred. Please try again later.',
            });
        } else if (!error.response && error.message === 'Network Error') {
            // Network Error (Server down, CORS, or Crash)
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Unable to connect to the server. Please check your connection or try again later.',
            });
        } else {
            // Other errors (400, 404, etc.)
            // Attempt to show meaningful message if possible
            if (!error.config?.suppressGlobalError) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: message || 'An unexpected error occurred.',
                });
            }
        }
        return Promise.reject(error);
    }
);

export default api;
