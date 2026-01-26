import { create } from 'zustand';
import inviteService from '../services/inviteService';

const useInviteStore = create((set) => ({
    isLoading: false,
    error: null,
    successMessage: null,

    createInvite: async (data) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            await inviteService.createInvite(data);
            set({ isLoading: false, successMessage: `Invitation sent to ${data.email}!` });
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    clearMessages: () => set({ error: null, successMessage: null })
}));

export default useInviteStore;
