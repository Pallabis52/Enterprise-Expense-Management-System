import React, { useRef, useEffect } from 'react';
import useVoiceAssistant from '../../hooks/useVoiceAssistant';

// ── Intent badge colours ──────────────────────────────────────────────────────
const INTENT_COLOURS = {
    ADD_EXPENSE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    APPROVE_EXPENSE: 'bg-green-500/20  text-green-300  border-green-500/40',
    REJECT_EXPENSE: 'bg-red-500/20    text-red-300    border-red-500/40',
    SHOW_EXPENSES: 'bg-blue-500/20   text-blue-300   border-blue-500/40',
    SEARCH_EXPENSES: 'bg-blue-500/20   text-blue-300   border-blue-500/40',
    CHECK_STATUS: 'bg-sky-500/20    text-sky-300    border-sky-500/40',
    TEAM_SUMMARY: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    TEAM_QUERY: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    SPENDING_SUMMARY: 'bg-amber-500/20  text-amber-300  border-amber-500/40',
    FRAUD_ALERTS: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    FRAUD_QUERY: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    BUDGET_QUERY: 'bg-cyan-500/20   text-cyan-300   border-cyan-500/40',
    AUDIT_REPORT: 'bg-pink-500/20   text-pink-300   border-pink-500/40',
    VENDOR_ROI: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    RISK_INSIGHTS: 'bg-rose-500/20   text-rose-300   border-rose-500/40',
    AI_CHAT: 'bg-teal-500/20   text-teal-300   border-teal-500/40',
    SEARCH: 'bg-blue-400/20   text-blue-200   border-blue-400/40',
    POLICY_INSIGHTS: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    UNKNOWN: 'bg-gray-500/20   text-gray-300   border-gray-500/40',
};

// Status pill colours
const STATUS_COLOURS = {
    SUCCESS: 'bg-green-500/20   text-green-300   border-green-500/40',
    UNAUTHORIZED: 'bg-red-500/20     text-red-300     border-red-500/40',
    ERROR: 'bg-orange-500/20  text-orange-300  border-orange-500/40',
    UNKNOWN: 'bg-gray-500/20    text-gray-300    border-gray-500/40',
};

// ── Animated waveform bars (CSS only) ────────────────────────────────────────
const Waveform = ({ active }) => (
    <div className="flex items-center gap-[3px] h-8">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
                key={i}
                className="w-[3px] rounded-full transition-all duration-300"
                style={{
                    background: active
                        ? `hsl(${180 + i * 15}, 80%, 60%)`
                        : 'rgba(148,163,184,0.3)',
                    height: active
                        ? `${Math.sin(i * 0.9) * 12 + 16}px`
                        : '6px',
                    animation: active ? `wave ${0.5 + i * 0.1}s ease-in-out infinite alternate` : 'none',
                }}
            />
        ))}
        <style>{`
      @keyframes wave {
        from { transform: scaleY(0.4); }
        to   { transform: scaleY(1.4); }
      }
    `}</style>
    </div>
);

// ── Pulsing ring around mic button ────────────────────────────────────────────
const PulseRing = ({ colour = '#06b6d4' }) => (
    <span
        className="absolute inset-0 rounded-full animate-ping opacity-40"
        style={{ background: colour }}
    />
);

const VoiceAssistant = ({ compact = false }) => {
    const {
        isListening, isProcessing, isSpeaking, isSupported,
        transcript, interimTranscript, response, error, hints, history,
        toggleListening, setManualTranscript, stopSpeaking, reset,
    } = useVoiceAssistant();

    const responseRef = useRef(null);

    // Scroll response into view
    useEffect(() => {
        if (response) responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [response]);

    const displayTranscript = transcript || interimTranscript;
    const message = response?.message || response?.reply;

    return (
        <div className="flex flex-col gap-6">
            {/* ── Mic + Waveform ─────────────────────────────────────────────────── */}
            <div className="flex flex-col items-center gap-4">
                {/* Mic button */}
                <div className="relative flex items-center justify-center">
                    {isListening && <PulseRing colour="#ef4444" />}
                    {isProcessing && <PulseRing colour="#06b6d4" />}
                    {isSpeaking && <PulseRing colour="#8b5cf6" />}
                    <button
                        onClick={toggleListening}
                        disabled={isProcessing || !isSupported}
                        title={isListening ? 'Stop Listening' : 'Click to Speak'}
                        className={`
              relative z-10 w-20 h-20 rounded-full flex items-center justify-center
              transition-all duration-300 shadow-2xl active:scale-95
              ${!isSupported
                                ? 'bg-gray-700 cursor-not-allowed opacity-50'
                                : isListening
                                    ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/50'
                                    : isProcessing
                                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/50 cursor-wait'
                                        : 'bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-violet-500/50'}
            `}
                    >
                        {isProcessing ? (
                            /* Spinner */
                            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : isListening ? (
                            /* Stop icon */
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <rect x="6" y="6" width="12" height="12" rx="2" />
                            </svg>
                        ) : (
                            /* Mic icon */
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zm-1 16.93V20H9v2h6v-2h-2v-2.07A8 8 0 0120 11h-2a6 6 0 01-12 0H4a8 8 0 007 7.93z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Status label */}
                <p className="text-sm font-medium tracking-wide text-center" style={{ color: 'rgba(148,163,184,0.9)' }}>
                    {!isSupported
                        ? '⚠ Voice not supported — use Chrome or Edge'
                        : isListening
                            ? '🎙 Listening… speak now'
                            : isProcessing
                                ? '⚡ Processing your command…'
                                : isSpeaking
                                    ? '🔊 Speaking response…'
                                    : 'Click the mic or tap a hint below'}
                </p>

                {/* Waveform */}
                <Waveform active={isListening} />
            </div>

            {/* ── Live transcript ───────────────────────────────────────────────── */}
            {(displayTranscript || isListening) && (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(148,163,184,0.6)' }}>
                        You said
                    </p>
                    <p className="text-white font-medium text-sm leading-relaxed min-h-[1.5rem]">
                        {displayTranscript || (
                            <span style={{ color: 'rgba(148,163,184,0.5)' }}>Waiting for speech…</span>
                        )}
                    </p>
                </div>
            )}

            {/* ── Error ─────────────────────────────────────────────────────────── */}
            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-300">{error}</p>
                </div>
            )}

            {/* ── Response card ─────────────────────────────────────────────────── */}
            {response && (
                <div ref={responseRef}
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 14.93V18h-2v-1.07A6 6 0 016 11h2a4 4 0 008 0h2a6 6 0 01-5 5.93zM12 14a4 4 0 01-4-4V6a4 4 0 018 0v4a4 4 0 01-4 4z" />
                            </svg>
                            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                                Assistant Response
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Status pill */}
                            {response.status && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLOURS[response.status] || STATUS_COLOURS.UNKNOWN}`}>
                                    {response.status}
                                </span>
                            )}
                            {/* Intent badge */}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${INTENT_COLOURS[response.intent] || INTENT_COLOURS.UNKNOWN}`}>
                                {response.intent}
                            </span>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="px-4 py-4">
                        <p className="text-white text-sm leading-relaxed">
                            {message || 'Command processed successfully.'}
                        </p>
                    </div>

                    {/* Footer actions */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-black/20">
                        <span className="text-xs" style={{ color: 'rgba(148,163,184,0.5)' }}>
                            {response.processingMs ? `${response.processingMs}ms` : ''}
                            {response.fallback ? ' · Keyword fallback' : ''}
                        </span>
                        <div className="flex items-center gap-2">
                            {isSpeaking && (
                                <button onClick={stopSpeaking}
                                    className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                                    Stop speaking
                                </button>
                            )}
                            <button onClick={reset}
                                className="text-xs transition-colors"
                                style={{ color: 'rgba(148,163,184,0.6)' }}>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Hint chips ────────────────────────────────────────────────────── */}
            {hints.length > 0 && (
                <div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(148,163,184,0.5)' }}>
                        Try saying…
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {hints.map((hint, i) => (
                            <button
                                key={i}
                                onClick={() => setManualTranscript(hint)}
                                disabled={isListening || isProcessing}
                                className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/5
                           hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white
                           transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {hint}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── History panel (hidden when compact) ───────────────────────────── */}
            {!compact && history.length > 0 && (
                <div>
                    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(148,163,184,0.5)' }}>
                        Recent Commands
                    </p>
                    <div className="flex flex-col gap-2">
                        {history.map((item, i) => (
                            <div key={i}
                                className="flex items-start justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
                                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                    <p className="text-xs text-slate-300 font-medium truncate">"{item.transcript}"</p>
                                    <p className="text-xs truncate" style={{ color: 'rgba(148,163,184,0.6)' }}>
                                        {item.message}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${INTENT_COLOURS[item.intent] || INTENT_COLOURS.UNKNOWN}`}>
                                        {item.intent}
                                    </span>
                                    <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>
                                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceAssistant;
