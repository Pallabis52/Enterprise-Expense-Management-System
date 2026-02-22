import { create } from 'zustand';
import policyService from '../services/policyService';

const usePolicyStore = create((set, get) => ({
    policies: [],
    isLoading: false,
    error: null,

    fetchPolicies: async (isAdmin = false) => {
        set({ isLoading: true, error: null });
        try {
            const data = isAdmin
                ? await policyService.getAllPolicies()
                : await policyService.getActivePolicies();
            set({ policies: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    createPolicy: async (policyData, isManager = false) => {
        set({ isLoading: true, error: null });
        try {
            const newPolicy = isManager
                ? await policyService.createPolicyManager(policyData)
                : await policyService.createPolicy(policyData);

            set((state) => ({
                policies: [...state.policies, newPolicy],
                isLoading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    updatePolicy: async (id, policyData) => {
        set({ isLoading: true, error: null });
        try {
            const updatedPolicy = await policyService.updatePolicy(id, policyData);
            set((state) => ({
                policies: state.policies.map(p => p.id === id ? updatedPolicy : p),
                isLoading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    deletePolicy: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await policyService.deletePolicy(id);
            set((state) => ({
                policies: state.policies.filter(p => p.id !== id),
                isLoading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    }
}));

export default usePolicyStore;
