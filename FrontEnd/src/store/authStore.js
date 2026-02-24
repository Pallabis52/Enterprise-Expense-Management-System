import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null, // Unified token storage
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/login', { email, password });
                    // Backend returns: { token, name, email, role }
                    const data = response.data;

                    // Store token for axios interceptors and persistence
                    localStorage.setItem('token', data.token);

                    const user = {
                        name: data.name,
                        email: data.email,
                        role: data.role
                    };

                    set({ user, token: data.token, isAuthenticated: true, isLoading: false });
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
                    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
                    // Ideally call backend to blacklist token if supported
                } catch (error) {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);

export default useAuthStore;
