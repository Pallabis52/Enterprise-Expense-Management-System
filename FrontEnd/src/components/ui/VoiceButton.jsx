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

    // ── Send to backend ───────────────────────────────────────────────────────
    const sendCommand = async (text) => {
        if (!text?.trim()) return;
        setState('processing');
        setError('');
        try {
            const response = await sendVoiceCommand(text);
            setResult(response);
            setState('result');
            if (onResult) onResult(response);
        } catch (err) {
            const status = err?.response?.status;
            const message = err?.response?.data?.message || 'Session expired. Please log out and log back in.';

            if (status === 401) {
                setError(message);
            } else if (status === 403) {
                setError('Permission denied for this voice command.');
            } else if (!err?.response) {
                setError('Cannot reach server. Please check your connection.');
            } else {
                setError('Failed to process voice command. Please try again.');
            }
            setState('idle');
        }
    };

    // ── Start listening ───────────────────────────────────────────────────────
    const startListening = useCallback(() => {
        if (!isSupported) return;
        setError('');
        setResult(null);
        setTranscript('');

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = true; // Use interim for real-time feedback
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onstart = () => setState('listening');

        recognition.onresult = (event) => {
            const text = Array.from(event.results)
                .map(res => res[0].transcript)
                .join('');

            setTranscript(text);

            if (event.results[0].isFinal) {
                sendCommand(text);
            }
        };

        recognition.onerror = (event) => {
            if (event.error !== 'no-speech') {
                setError(`Mic error: ${event.error}. Please try again.`);
                setState('idle');
            }
        };

        recognition.onend = () => {
            if (state === 'listening') setState('idle');
        };

        recognition.start();
    }, [isSupported, state, sendCommand]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Stop listening early ──────────────────────────────────────────────────
    const stopListening = () => {
        recognitionRef.current?.stop();
        setState('idle');
    };

    // ── Handle text submit (Manual Typing) ────────────────────────────────────
    const handleManualSubmit = (e) => {
        if (e) e.preventDefault();
        if (state === 'processing') return;
        sendCommand(transcript);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleManualSubmit();
        }
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
        <div className={`voice-widget ${className} ${state}`}>
            <div className="voice-main-bar">
                {/* ── Mic Button ── */}
                <button
                    className={`voice-mic-btn ${state}`}
                    onClick={state === 'listening' ? stopListening : startListening}
                    disabled={state === 'processing'}
                    title={state === 'listening' ? 'Stop listening' : 'Start voice command'}
                    aria-label="Toggle Microphone"
                >
                    <div className="mic-container">
                        {state === 'processing' ? (
                            <span className="voice-spinner" />
                        ) : state === 'listening' ? (
                            <div className="listening-indicator">
                                <span className="dot" />
                                <span className="dot" />
                                <span className="dot" />
                            </div>
                        ) : (
                            <span className="mic-icon">🎤</span>
                        )}
                        {state === 'listening' && <span className="pulse-ring" />}
                    </div>
                </button>

                {/* ── Dual Input Field ── */}
                <div className="voice-input-container">
                    <input
                        type="text"
                        className="voice-command-input"
                        placeholder={state === 'listening' ? 'Listening...' : 'Type a command or use voice...'}
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={state === 'processing'}
                    />

                    {transcript && (
                        <button className="voice-input-clear" onClick={() => setTranscript('')} title="Clear">
                            ✕
                        </button>
                    )}

                    {transcript && state !== 'processing' && state !== 'listening' && (
                        <button
                            className="voice-command-send"
                            onClick={handleManualSubmit}
                            title="Send command"
                        >
                            →
                        </button>
                    )}
                </div>

                <div className="voice-action-group">
                    <button
                        className="voice-action-btn hints"
                        onClick={toggleHints}
                        title="Command Hints"
                    >
                        💡
                    </button>

                    {(result || error || transcript) && (
                        <button className="voice-action-btn reset" onClick={reset} title="Reset">
                            ↺
                        </button>
                    )}
                </div>
            </div>

            {/* ── Error display ── */}
            {error && (
                <div className="voice-error-banner">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{error}</span>
                </div>
            )}

            {/* ── Rendering Panels (Hints/Results) ── */}
            {showHints && (
                <div className="voice-hints-panel">
                    <p className="voice-hints-title">Try Commands Like:</p>
                    <ul className="voice-hints-list">
                        {hints.length > 0 ? (
                            hints.map((hint, i) => (
                                <li key={i} className="voice-hint-item" onClick={() => {
                                    setTranscript(hint);
                                    sendCommand(hint);
                                    setShowHints(false);
                                }}>
                                    "{hint}"
                                </li>
                            ))
                        ) : (
                            <li className="voice-hint-item loading">Loading examples...</li>
                        )}
                    </ul>
                </div>
            )}

            {result && state === 'result' && (
                <VoiceResultPanel result={result} />
            )}
        </div>
    );
};

export default VoiceButton;
