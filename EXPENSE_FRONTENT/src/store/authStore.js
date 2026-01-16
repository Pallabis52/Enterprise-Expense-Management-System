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
                    // Replace with actual API call
                    // const response = await api.post('/auth/login', { email, password });
                    // const user = response.data;

                    // Mock login for frontend dev
                    const user = { id: '1', name: 'Frontend User', email };

                    set({ user, isAuthenticated: true, isLoading: false });
                    return user;
                } catch (error) {
                    set({ error: error.message || 'Login failed', isLoading: false });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    // const response = await api.post('/auth/register', userData);
                    set({ isLoading: false });
                    // return response.data;
                } catch (error) {
                    set({ error: error.message || 'Registration failed', isLoading: false });
                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    // await api.post('/auth/logout');
                    set({ user: null, isAuthenticated: false, isLoading: false });
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
