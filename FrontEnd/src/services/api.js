import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
    headers: {
        'Content-Type': 'application/json',
    },
    // withCredentials not needed: auth uses Bearer token in Authorization header (localStorage JWT)
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');

        // Robust Fallback: Check Zustand's persistent storage if direct token is missing/empty
        if (!token || token === 'null' || token === 'undefined') {
            try {
                const authStorage = localStorage.getItem('auth-storage');
                if (authStorage) {
                    const parsed = JSON.parse(authStorage);
                    token = parsed.state?.token;
                }
            } catch (err) {
                console.error('[API] Auth Storage Parse Error:', err);
            }
        }

        if (token && token !== 'null' && token !== 'undefined') {
            const cleanToken = token.trim().replace(/[\n\r]/g, '');
            const tokenPreview = cleanToken.substring(0, 10) + '...';

            console.log(`[API] Attaching Token to ${config.method.toUpperCase()} ${config.url} (${tokenPreview})`);

            // FORCE headers to be a plain object to avoid AxiosHeaders encapsulation bugs
            // Some environments/axios versions struggle with the custom object type
            const rawHeaders = { ...config.headers };
            rawHeaders['Authorization'] = `Bearer ${cleanToken}`;
            rawHeaders['authorization'] = `Bearer ${cleanToken}`; // Case-insensitive redundancy

            config.headers = rawHeaders;

            if (config.url.includes('/voice/')) {
                console.log('[API] HARDENED Voice Headers:', config.headers);
            }
        } else {
            // Optional: Only warn for non-auth endpoints to avoid noise during login/register
            if (!config.url.includes('/auth/')) {
                console.warn(`[API] MISSION CRITICAL: No token found for ${config.method.toUpperCase()} ${config.url}`);
            }
        }

        // Final sanity check for 401 debugging
        if (config.url.includes('/voice/command')) {
            console.log('[API] Final Voice Headers:', config.headers);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

import { premiumWarning, premiumError, showPremiumAlert } from '../utils/premiumAlerts';

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response ? error.response.status : null;
        const message = error.response?.data?.message || 'Something went wrong. Please try again.';

        if (status === 401) {
            // Unauthenticated — skip popup if the caller suppressed it (e.g. for voice background calls)
            if (error.config?.suppressGlobalError) {
                console.warn('[API] 401 Unauthorized (Suppressed Popup) for:', error.config.url);
            } else {
                premiumWarning('Session Expired', 'Please log in again.', null).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('auth-storage');
                        window.location.href = '/login';
                    }
                });
            }
        } else if (status === 403) {
            // Forbidden — skip popup if the caller suppressed it
            if (!error.config?.suppressGlobalError) {
                premiumError('Access Denied', 'You do not have permission to perform this action.');
            }
        } else if (status >= 500) {
            // Server Error
            premiumError('Server Error', 'A server error occurred. Please try again later.');
        } else if (!error.response && error.message === 'Network Error') {
            // Network Error (Server down, CORS, or Crash)
            premiumError('Network Error', 'Unable to connect to the server. Please check your connection or try again later.');
        } else {
            // Other errors (400, 404, etc.)
            // Attempt to show meaningful message if possible
            if (!error.config?.suppressGlobalError) {
                premiumError('Error', message || 'An unexpected error occurred.');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
