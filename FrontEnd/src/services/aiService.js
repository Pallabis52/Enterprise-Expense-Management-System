import axios from 'axios';

// ── Dedicated AI client with extended timeout ─────────────────────────────────
// AI calls can take 20-60 s — use a longer timeout than the default API client.
const aiApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 90_000, // 90 s — matches backend ollama.timeout-seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Forward the auth token on every request (same as main api.js interceptor)
aiApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
// POST /api/user/ai/categorize
export const categorizeExpense = (title, description, amount) =>
    withRetry(() => aiApi.post('/user/ai/categorize', { title, description, amount }));

// ── Feature 2: Rejection Explanation ────────────────────────────────────────
// GET /api/user/ai/explain-rejection/{expenseId}
export const explainRejection = (expenseId) =>
    withRetry(() => aiApi.get(`/user/ai/explain-rejection/${expenseId}`));

// ── Feature 3: Personal Spending Insights ───────────────────────────────────
// GET /api/user/ai/spending-insights
export const getSpendingInsights = () =>
    withRetry(() => aiApi.get('/user/ai/spending-insights'));

// ── Feature 4: Approval Recommendation ─────────────────────────────────────
// GET /api/manager/ai/recommend/{expenseId}
export const getApprovalRecommendation = (expenseId) =>
    withRetry(() => aiApi.get(`/manager/ai/recommend/${expenseId}`));

// ── Feature 5: Risk Scoring ─────────────────────────────────────────────────
// GET /api/manager/ai/risk/{expenseId}
export const getRiskScore = (expenseId) =>
    withRetry(() => aiApi.get(`/manager/ai/risk/${expenseId}`));

// ── Feature 6: Team Spending Summary ────────────────────────────────────────
// GET /api/manager/ai/team-summary
export const getTeamSummary = () =>
    withRetry(() => aiApi.get('/manager/ai/team-summary'));

// ── Feature 7: Fraud Pattern Detection ──────────────────────────────────────
// GET /api/admin/ai/fraud-insights
export const getFraudInsights = () =>
    withRetry(() => aiApi.get('/admin/ai/fraud-insights'));

// ── Feature 8: Budget Overrun Prediction ────────────────────────────────────
// GET /api/admin/ai/budget-prediction/{teamId}
export const getBudgetPrediction = (teamId) =>
    withRetry(() => aiApi.get(`/admin/ai/budget-prediction/${teamId}`));

// ── Feature 9: Policy Violation Detection ───────────────────────────────────
// GET /api/admin/ai/policy-violations/{expenseId}
export const getPolicyViolations = (expenseId) =>
    withRetry(() => aiApi.get(`/admin/ai/policy-violations/${expenseId}`));

// ── Feature 10: Chatbot ──────────────────────────────────────────────────────
// POST /api/{role}/ai/chat
export const chatWithAI = (message, context = '', role = 'user') =>
    withRetry(() => aiApi.post(`/${role}/ai/chat`, { message, context }));

// ── Feature 11: Vendor ROI Analysis ─────────────────────────────────────────
// GET /api/admin/ai/vendor-roi
export const getVendorROI = () =>
    withRetry(() => aiApi.get('/admin/ai/vendor-roi'));

// ── Ollama health check ──────────────────────────────────────────────────────
// GET /api/ai/status
export const getAIStatus = () =>
    aiApi.get('/ai/status').then(r => r.data).catch(() => ({ ollamaAvailable: false, model: 'unknown' }));
