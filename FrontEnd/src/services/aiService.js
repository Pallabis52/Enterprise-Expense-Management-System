// src/services/aiService.js

import axios from "axios";

/* ─────────────────────────────────────────────────────────────
   AXIOS CLIENT (AI)
   ───────────────────────────────────────────────────────────── */

const aiApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api",
    timeout: 90000, // 90s for Ollama responses
    headers: { "Content-Type": "application/json" },
});

/* ─────────────────────────────────────────────────────────────
   REQUEST INTERCEPTOR — ATTACH JWT TOKEN
   ───────────────────────────────────────────────────────────── */

aiApi.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem("token");

        // Robust Fallback: Check Zustand's persistent storage if direct token is missing/empty
        if (!token || token === 'null' || token === 'undefined') {
            try {
                const authStorage = localStorage.getItem('auth-storage');
                if (authStorage) {
                    const parsed = JSON.parse(authStorage);
                    token = parsed.state?.token;
                }
            } catch (err) {
                console.error('[AI-API] Auth Storage Parse Error:', err);
            }
        }

        if (token && token !== 'null' && token !== 'undefined') {
            const cleanToken = token.trim().replace(/[\n\r]/g, '');
            const preview = cleanToken.substring(0, 10) + '...';

            // FORCE headers to be a plain object to avoid AxiosHeaders encapsulation bugs
            const rawHeaders = { ...config.headers };
            rawHeaders['Authorization'] = `Bearer ${cleanToken}`;
            rawHeaders['authorization'] = `Bearer ${cleanToken}`; // Redundancy

            config.headers = rawHeaders;

            console.log(`🚀 [AI-API] Request Sent: ${config.method?.toUpperCase()} ${config.url}`);
            console.log(`🔑 [AI-API] Token Attached: (${preview})`);
        } else {
            // Optional: Only warn for non-auth endpoints to avoid noise during login
            if (!config.url.includes('/auth/') && !config.url.includes('/public/')) {
                console.warn(`[AI-API] CRITICAL FAILURE: No token found for ${config.method?.toUpperCase()} ${config.url}`);
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* ─────────────────────────────────────────────────────────────
   RESPONSE INTERCEPTOR — HANDLE 401 GLOBALLY
   ───────────────────────────────────────────────────────────── */

aiApi.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url;

        if (status === 401) {
            const serverMessage = error.response?.data?.message || "Session expired or token invalid.";
            console.error(`🔒 [AI-API] 401 Unauthorized for ${url}. Server: ${serverMessage}`);

            // Skip suppressGlobalError check for 401s — always force re-login
            import('../utils/premiumAlerts').then(({ premiumWarning }) => {
                premiumWarning('AI Session Security', 'Your session has expired. Please log in again.', null).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("auth-storage");
                        window.location.href = "/login";
                    }
                });
            });
        } else if (status === 403) {
            console.error(`🚫 [AI-API] 403 Forbidden for ${url}. check user roles.`);
        }

        return Promise.reject(error);
    }
);

/* ─────────────────────────────────────────────────────────────
   RETRY HELPER
   ───────────────────────────────────────────────────────────── */

async function withRetry(fn, retries = 1) {
    try {
        const res = await fn();
        return res.data;
    } catch (err) {
        const retryable =
            !err.response ||
            err.code === "ECONNABORTED" ||
            err.response?.status >= 500;

        if (retryable && retries > 0) {
            console.warn("🔁 Retrying AI request...");
            return withRetry(fn, retries - 1);
        }

        console.error("❌ AI request failed:", err.message);
        throw err;
    }
}

/* ─────────────────────────────────────────────────────────────
   AI FEATURE APIS
   ───────────────────────────────────────────────────────────── */

/* USER FEATURES */

// 1️⃣ Categorize expense
export const categorizeExpense = (title, description, amount) =>
    withRetry(() =>
        aiApi.post("/ai/categorize", { title, description, amount })
    );

// 2️⃣ Spending insights
export const getSpendingInsights = () =>
    withRetry(() => aiApi.get("/ai/spending-insights"));

// 2.1️⃣ Explain rejection
export const explainRejection = (expenseId) =>
    withRetry(() => aiApi.get(`/ai/explain-rejection/${expenseId}`));

// 3️⃣ Enhance description
export const enhanceDescription = (title, amount, category) =>
    withRetry(() =>
        aiApi.post("/ai/enhance-description", { title, amount, category })
    );

// 4️⃣ Voice expense parsing
export const parseVoiceExpense = (text) =>
    withRetry(() => aiApi.post("/ai/voice-parse", { text }));

/* MANAGER FEATURES */

// 5️⃣ Team summary
export const getTeamSummary = () =>
    withRetry(() => aiApi.get("/ai/team-summary"));

// 6️⃣ Approval recommendation
export const getApprovalRecommendation = (expenseId) =>
    withRetry(() => aiApi.get(`/ai/recommendation/${expenseId}`));

// 7️⃣ Risk score
export const getRiskScore = (expenseId) =>
    withRetry(() => aiApi.get(`/ai/risk-score/${expenseId}`));

/* ADMIN FEATURES */

// 8️⃣ Fraud insights
export const getFraudInsights = () =>
    withRetry(() => aiApi.get("/ai/fraud-insights"));

// 9️⃣ Audit summary
export const getAuditSummary = () =>
    withRetry(() => aiApi.get("/ai/audit-summary"));

// 🔟 Vendor ROI
export const getVendorROI = () =>
    withRetry(() => aiApi.get("/ai/vendor-roi"));

// 10.1️⃣ Policy violations
export const getPolicyViolations = (expenseId) =>
    withRetry(() => aiApi.get(`/ai/policy-violations/${expenseId}`));

// 10.2️⃣ Budget prediction
export const getBudgetPrediction = (teamId) =>
    withRetry(() => aiApi.get(`/ai/budget-prediction/${teamId}`));

/* COMMON FEATURES */

// 1️⃣1️⃣ AI Chat assistant
export const chatWithAI = (message, role = "USER") =>
    withRetry(() =>
        aiApi.post("/ai/chat", { message, role })
    );

// 1️⃣2️⃣ Natural language search
export const naturalSearch = (query) =>
    withRetry(() => aiApi.get("/ai/search", { params: { query } }));

// 1️⃣3️⃣ Mood insight
export const getMoodInsight = (expenseId) =>
    withRetry(() => aiApi.get(`/ai/mood-insight/${expenseId}`));

// 1️⃣4️⃣ Confidence score
export const getConfidenceScore = (expenseId) =>
    withRetry(() => aiApi.get(`/ai/confidence-score/${expenseId}`));

// 1️⃣5️⃣ Manager voice action
export const managerVoiceAction = (text) =>
    withRetry(() => aiApi.post('/voice/manager-action', { text }));

/* ─────────────────────────────────────────────────────────────
   HEALTH CHECK
   ───────────────────────────────────────────────────────────── */

export const getAIStatus = async () => {
    try {
        const res = await aiApi.get("/ai/status");
        return res.data;
    } catch {
        return { ollamaAvailable: false, status: "offline" };
    }
};