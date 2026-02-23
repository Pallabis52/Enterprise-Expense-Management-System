import api from './api';

/**
 * Voice command service — wraps the backend voice endpoints.
 * Uses the existing `api` axios instance (JWT auto-attached by interceptor).
 */

/**
 * Send a voice transcript to the backend for AI intent resolution.
 * @param {string} text - The transcript captured from Web Speech API
 * @param {string} [context] - Optional context string
 * @returns {Promise<VoiceResponse>} - { intent, params, reply, data, fallback, processingMs }
 */
export const sendVoiceCommand = async (text, context = '') => {
    const response = await api.post('/voice/command', { text, context });
    return response.data;
};

/**
 * Fetch role-specific example voice phrases for the hints panel.
 * @returns {Promise<{ role: string, hints: string[], tip: string }>}
 */
export const getVoiceHints = async () => {
    const response = await api.get('/voice/hints');
    return response.data;
};
