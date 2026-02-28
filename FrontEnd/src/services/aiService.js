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
            const cleanToken = token.trim();
            const preview = cleanToken.substring(0, 10) + '...';
            console.log(`[AI-API] Attaching token (${preview}) to ${config.method?.toUpperCase()} ${config.url}`);

            // Apply to headers using standard and modern methods for bulletproof compatibility
            if (config.headers.set) {
                config.headers.set('Authorization', `Bearer ${cleanToken}`);
            } else {
                config.headers.Authorization = `Bearer ${cleanToken}`;
            }
        } else {
            console.warn(`[AI-API] MISSION CRITICAL: No token found for ${config.method?.toUpperCase()} ${config.url}`);
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
        if (error.response?.status === 401) {
            console.error("🔒 Unauthorized — redirecting to login");
            localStorage.removeItem("token");
            window.location.href = "/login";
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