import React from 'react';

/**
 * VoiceResultPanel — renders the VoiceResponse from the backend.
 *
 * Props:
 *   result (VoiceResponse) — { intent, params, reply, data, fallback, processingMs }
 */
const VoiceResultPanel = ({ result }) => {
    if (!result) return null;

    const { intent, reply, data, fallback, processingMs } = result;

    return (
        <div className={`voice-result-panel ${fallback ? 'voice-result-fallback' : ''}`} role="region" aria-label="Voice command result">

            {/* ── Intent badge ── */}
            <div className="voice-result-header">
                <span className={`voice-intent-badge intent-${(intent || 'UNKNOWN').toLowerCase().replace(/_/g, '-')}`}>
                    {formatIntent(intent)}
                </span>
                {fallback && <span className="voice-fallback-badge">⚠ Offline mode</span>}
                <span className="voice-timing">{processingMs}ms</span>
            </div>

            {/* ── AI reply ── */}
            {reply && (
                <p className="voice-reply-text">{reply}</p>
            )}

            {/* ── Data rendering ── */}
            {data && renderData(data, intent)}
        </div>
    );
};

// ── Intent label formatter ──────────────────────────────────────────────────

function formatIntent(intent) {
    if (!intent) return 'Unknown';
    return intent.replace(/_/g, ' ').toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
}

// ── Smart data renderer ─────────────────────────────────────────────────────

function renderData(data, intent) {
    // Expense list
    if (Array.isArray(data) && data.length > 0 && data[0]?.title !== undefined) {
        return <ExpenseList expenses={data} />;
    }

    // Status count object
    if (data?.pending !== undefined && data?.approved !== undefined) {
        return <StatusSummary data={data} />;
    }

    // Budget list
    if (Array.isArray(data) && data.length > 0 && data[0]?.teamName !== undefined) {
        return <BudgetList budgets={data} />;
    }

    // Expense prefill (ADD_EXPENSE)
    if (data?.action === 'PREFILL_FORM') {
        return <PrefillBanner data={data} />;
    }

    // AI insight text (team summary, fraud, vendor ROI)
    if (data?.insightText) {
        return (
            <div className="voice-insight-box">
                <p className="voice-insight-text">{data.insightText}</p>
            </div>
        );
    }

    // Single approved/rejected expense
    if (data?.id && data?.title) {
        return (
            <div className="voice-expense-card voice-expense-single">
                <span className="vex-title">{data.title}</span>
                <span className={`vex-status status-${data.status?.toLowerCase()}`}>{data.status}</span>
                <span className="vex-amount">₹{Number(data.amount || 0).toLocaleString('en-IN')}</span>
            </div>
        );
    }

    // Error object
    if (data?.error) {
        return <div className="voice-data-error">⚠ {data.error}</div>;
    }

    return null;
}

// ── Sub-components ──────────────────────────────────────────────────────────

const ExpenseList = ({ expenses }) => (
    <div className="voice-expense-list">
        {expenses.slice(0, 5).map((e) => (
            <div key={e.id} className="voice-expense-card">
                <span className="vex-title">{e.title}</span>
                <span className="vex-category">{e.category || '—'}</span>
                <span className={`vex-status status-${e.status?.toLowerCase()}`}>{e.status}</span>
                <span className="vex-amount">₹{Number(e.amount || 0).toLocaleString('en-IN')}</span>
            </div>
        ))}
        {expenses.length > 5 && (
            <p className="voice-list-more">+{expenses.length - 5} more — use the filters below to see all.</p>
        )}
    </div>
);

const StatusSummary = ({ data }) => (
    <div className="voice-status-summary">
        <div className="vss-badge vss-pending">
            <span className="vss-num">{data.pending}</span>
            <span className="vss-label">Pending</span>
        </div>
        <div className="vss-badge vss-approved">
            <span className="vss-num">{data.approved}</span>
            <span className="vss-label">Approved</span>
        </div>
        <div className="vss-badge vss-rejected">
            <span className="vss-num">{data.rejected}</span>
            <span className="vss-label">Rejected</span>
        </div>
    </div>
);

const BudgetList = ({ budgets }) => (
    <div className="voice-budget-list">
        {budgets.slice(0, 5).map((b, i) => {
            const pct = b.budget > 0 ? Math.min(100, Math.round((b.spent / b.budget) * 100)) : 0;
            return (
                <div key={i} className={`voice-budget-item ${b.exceeded ? 'budget-exceeded' : ''}`}>
                    <div className="vb-header">
                        <span className="vb-name">{b.teamName}</span>
                        <span className="vb-pct">{pct}%</span>
                    </div>
                    <div className="vb-bar-track">
                        <div className="vb-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="vb-footer">
                        <span>₹{Number(b.spent || 0).toLocaleString('en-IN')} spent</span>
                        <span>/ ₹{Number(b.budget || 0).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            );
        })}
    </div>
);

const PrefillBanner = ({ data }) => (
    <div className="voice-prefill-banner">
        <p className="vpb-label">📝 Form pre-filled with:</p>
        <ul className="vpb-fields">
            {data.title && <li><strong>Title:</strong> {data.title}</li>}
            {data.amount && <li><strong>Amount:</strong> ₹{data.amount}</li>}
            {data.category && <li><strong>Category:</strong> {data.category}</li>}
        </ul>
        <p className="vpb-hint">Scroll down to review and submit the expense form.</p>
    </div>
);

export default VoiceResultPanel;
