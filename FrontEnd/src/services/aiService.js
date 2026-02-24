import axios from 'axios';

// ── Dedicated AI client with extended timeout ─────────────────────────────────
// AI calls can take 20-60 s — use a longer timeout than the default API client.
const aiApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api',
    timeout: 90_000, // 90 s — matches backend ollama.timeout-seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Forward the auth token on every request (same as main api.js interceptor)
aiApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Standard Header Auth
        config.headers.Authorization = `Bearer ${token}`;
        const preview = token.substring(0, 10) + '...';
        console.log(`[AI-API] Attaching token (${preview}) to ${config.method.toUpperCase()} ${config.url}`);
    } else {
        console.warn(`[AI-API] NO TOKEN FOUND for ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
});

// ── Retry helper ─────────────────────────────────────────────────────────────
/**
 * Wraps an Axios call and retries it once on network-level or 5xx errors.
 * Cache hits on the backend will always resolve instantly regardless.
 *
 * @param {() => Promise} fn - Factory that returns the Axios promise
 * @param {number} retries   - How many extra attempts (default 1)
 */
async function withRetry(fn, retries = 1) {
    try {
        const res = await fn();
        return res.data;
    } catch (err) {
        const isRetryable =
            !err.response ||                        // network error
            err.code === 'ECONNABORTED' ||          // timeout
            (err.response && err.response.status >= 500);

        if (retries > 0 && isRetryable) {
            console.warn('[AI] Retrying after error:', err.message);
            return withRetry(fn, retries - 1);
        }
        throw err;
    }
}

// ── Feature 1: Expense Categorization ───────────────────────────────────────
export const categorizeExpense = (title, description, amount) =>
    withRetry(() => aiApi.post('/ai/categorize', { title, description, amount }));

// ── Feature 2: Rejection Explanation ────────────────────────────────────────
export const explainRejection = (expenseId) =>
    withRetry(() => aiApi.get(`/ai/explain-rejection/${expenseId}`));

// ── Feature 3: Personal Spending Insights ───────────────────────────────────
export const getSpendingInsights = () =>
    withRetry(() => aiApi.get('/ai/spending-insights'));

// ── Feature 4: Approval Recommendation ─────────────────────────────────────
export const getApprovalRecommendation = (expenseId) =>
    withRetry(() => aiApi.get(`/ai/recommendation/${expenseId}`));

// ── Feature 5: Risk Scoring ─────────────────────────────────────────────────
export const getRiskScore = (expenseId) =>
    withRetry(() => aiApi.get(`/ai/risk-score/${expenseId}`));

// ── Feature 6: Team Spending Summary ────────────────────────────────────────
export const getTeamSummary = () =>
    withRetry(() => aiApi.get('/ai/team-summary'));

// ── Feature 7: Fraud Pattern Detection ──────────────────────────────────────
export const getFraudInsights = () =>
    withRetry(() => aiApi.get('/ai/fraud-insights'));

// ── Feature 8: Budget Overrun Prediction ────────────────────────────────────
export const getBudgetPrediction = (teamId) =>
    withRetry(() => aiApi.get(`/ai/budget-prediction/${teamId}`));

// ── Feature 9: Policy Violation Detection ───────────────────────────────────
export const getPolicyViolations = (expenseId) =>
    withRetry(() => aiApi.get(`/ai/policy-violations/${expenseId}`));

// ── Feature 10: Chatbot ──────────────────────────────────────────────────────
export const chatWithAI = (message, context = '', role = 'user') =>
    withRetry(() => aiApi.post('/ai/chat', { message, context, role }));

// ── Feature 11: Vendor ROI Analysis ─────────────────────────────────────────
export const getVendorROI = () =>
    withRetry(() => aiApi.get('/ai/vendor-roi'));

// ── Ollama health check ──────────────────────────────────────────────────────
// GET /api/ai/status
export const getAIStatus = () =>
    aiApi.get('/ai/status').then(r => r.data).catch(() => ({ ollamaAvailable: false, model: 'unknown' }));
