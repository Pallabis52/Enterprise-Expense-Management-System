import React, { useState, useRef, useCallback } from 'react';
import { sendVoiceCommand, getVoiceHints } from '../../services/voiceService';
import VoiceResultPanel from './VoiceResultPanel';
import './VoiceButton.css';

/**
 * VoiceButton — Reusable microphone button component.
 *
 * Props:
 *   role (string)      — 'USER' | 'MANAGER' | 'ADMIN'  (for hint filtering)
 *   onResult (fn)      — optional callback when a result arrives: (voiceResponse) => void
 *   className (string) — extra CSS classes for positioning
 */
const VoiceButton = ({ role = 'USER', onResult, className = '' }) => {
    const [state, setState] = useState('idle'); // idle | listening | processing | result | unsupported
    const [transcript, setTranscript] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [hints, setHints] = useState([]);
    const [showHints, setShowHints] = useState(false);
    const [textFallback, setTextFallback] = useState('');
    const recognitionRef = useRef(null);

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isSupported = !!SpeechRecognition;

    // ── Load hints from backend ───────────────────────────────────────────────
    const loadHints = useCallback(async () => {
        try {
            const data = await getVoiceHints();
            setHints(data.hints || []);
        } catch {
            // hints are decorative — fail silently
        }
    }, []);

    // ── Start listening ───────────────────────────────────────────────────────
    const startListening = useCallback(() => {
        if (!isSupported) return;
        setError('');
        setResult(null);

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onstart = () => setState('listening');

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            sendCommand(text);
        };

        recognition.onerror = (event) => {
            setError(`Mic error: ${event.error}. Please try again.`);
            setState('idle');
        };

        recognition.onend = () => {
            if (state === 'listening') setState('idle');
        };

        recognition.start();
    }, [isSupported, state]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Stop listening early ──────────────────────────────────────────────────
    const stopListening = () => {
        recognitionRef.current?.stop();
        setState('idle');
    };

    // ── Send to backend ───────────────────────────────────────────────────────
    const sendCommand = async (text) => {
        setState('processing');
        try {
            const response = await sendVoiceCommand(text);
            setResult(response);
            setState('result');
            if (onResult) onResult(response);
        } catch {
            setError('Failed to process voice command. Please try again.');
            setState('idle');
        }
    };

    // ── Handle text fallback submit ───────────────────────────────────────────
    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (!textFallback.trim()) return;
        setTranscript(textFallback.trim());
        sendCommand(textFallback.trim());
        setTextFallback('');
    };

    // ── Reset state ───────────────────────────────────────────────────────────
    const reset = () => {
        setState('idle');
        setResult(null);
        setTranscript('');
        setError('');
    };

    // ── Toggle: load hints on first open ─────────────────────────────────────
    const toggleHints = () => {
        if (!showHints && hints.length === 0) loadHints();
        setShowHints(prev => !prev);
    };

    return (
        <div className={`voice-widget ${className}`}>
            {/* ── Main mic button area ── */}
            <div className="voice-controls">
                {isSupported ? (
                    <button
                        className={`voice-mic-btn ${state}`}
                        onClick={state === 'listening' ? stopListening : startListening}
                        disabled={state === 'processing'}
                        title={state === 'listening' ? 'Click to stop' : 'Click to speak'}
                        aria-label="Voice command button"
                    >
                        <span className="mic-icon">
                            {state === 'processing' ? '⏳' : state === 'listening' ? '🔴' : '🎤'}
                        </span>
                        {state === 'listening' && <span className="pulse-ring" />}
                    </button>
                ) : (
                    /* ── Text fallback when mic is not supported ── */
                    <form className="voice-text-fallback" onSubmit={handleTextSubmit}>
                        <input
                            type="text"
                            value={textFallback}
                            onChange={(e) => setTextFallback(e.target.value)}
                            placeholder="Type your command..."
                            className="voice-text-input"
                        />
                        <button type="submit" className="voice-text-submit" disabled={state === 'processing'}>
                            {state === 'processing' ? '...' : '→'}
                        </button>
                    </form>
                )}

                <span className="voice-status-label">
                    {state === 'idle' && 'Ask anything'}
                    {state === 'listening' && 'Listening…'}
                    {state === 'processing' && 'Processing…'}
                    {state === 'result' && 'Done'}
                </span>

                <button
                    className="voice-hints-btn"
                    onClick={toggleHints}
                    title="See example commands"
                    aria-label="Toggle example commands"
                >
                    💡
                </button>

                {result && (
                    <button className="voice-reset-btn" onClick={reset} title="New command">
                        ✕
                    </button>
                )}
            </div>

            {/* ── Transcript display ── */}
            {transcript && state !== 'idle' && (
                <div className="voice-transcript">
                    <span className="voice-transcript-label">You said:</span> "{transcript}"
                </div>
            )}

            {/* ── Error display ── */}
            {error && <div className="voice-error">{error}</div>}

            {/* ── Hints panel ── */}
            {showHints && (
                <div className="voice-hints-panel">
                    <p className="voice-hints-title">Try saying:</p>
                    {hints.length > 0 ? (
                        <ul className="voice-hints-list">
                            {hints.map((hint, i) => (
                                <li
                                    key={i}
                                    className="voice-hint-item"
                                    onClick={() => {
                                        setTranscript(hint);
                                        sendCommand(hint);
                                        setShowHints(false);
                                    }}
                                >
                                    "{hint}"
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="voice-hints-loading">Loading hints…</p>
                    )}
                </div>
            )}

            {/* ── Result panel ── */}
            {result && state === 'result' && (
                <VoiceResultPanel result={result} />
            )}
        </div>
    );
};

export default VoiceButton;
