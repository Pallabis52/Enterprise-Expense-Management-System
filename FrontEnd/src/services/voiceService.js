import api from './api';

/**
 * Voice command service — wraps the backend voice endpoints.
 * Uses the existing `api` axios instance (JWT auto-attached by interceptor).
 *
 * suppressGlobalError:true — errors are handled inline by VoiceButton,
 * so the global api.js SweetAlert popup does NOT fire for voice calls.
 */

/**
 * Send a voice transcript to the backend for AI intent resolution.
 * @param {string} text - The transcript captured from Web Speech API
 * @param {string} [context] - Optional context string
 * @returns {Promise<VoiceResponse>} - { intent, params, reply, data, fallback, processingMs }
 */
export const sendVoiceCommand = async (text, context = '') => {
    const response = await api.post('/voice/command', { text, context }, {
        suppressGlobalError: true   // VoiceButton renders inline errors — no popup
    });
    return response.data;
};

/**
 * Manager-specific voice action (Approve/Reject).
 * POST /api/voice/manager-action
 */
export const managerVoiceAction = async (text) => {
    const response = await api.post('/voice/manager-action', { text }, {
        suppressGlobalError: true
    });
    return response.data;
};

/**
 * Fetch role-specific example voice phrases for the hints panel.
 * @returns {Promise<{ role: string, hints: string[], tip: string }>}
 */
export const getVoiceHints = async () => {
    const response = await api.get('/voice/hints', {
        suppressGlobalError: true   // hints panel fails silently
    });
    return response.data;
};
