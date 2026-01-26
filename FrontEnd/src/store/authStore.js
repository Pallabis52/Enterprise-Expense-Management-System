import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/login', { email, password });
                    // Backend returns: { token, name, email, role }
                    const data = response.data;

                    // Store token for axios interceptors (if setup)
                    localStorage.setItem('token', data.token);

                    const user = {
                        name: data.name,
                        email: data.email,
                        role: data.role
                    };

                    set({ user, isAuthenticated: true, isLoading: false });
                    return user;
                } catch (error) {
                    const msg = error.response?.data?.message || 'Login failed';
                    set({ error: msg, isLoading: false });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/register', userData);
                    set({ isLoading: false });
                    return response.data;
                } catch (error) {
                    set({ error: error.message || 'Registration failed', isLoading: false });
                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    localStorage.removeItem('token');
                    set({ user: null, isAuthenticated: false, isLoading: false });
                    // Ideally call backend to blacklist token if supported
                } catch (error) {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage', // unique name
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // only persist user and auth status
        }
    )
);

export default useAuthStore;
