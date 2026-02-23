import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * SearchVoiceInput — A premium search bar with a built-in microphone button.
 *
 * Props:
 *   value        {string}   — controlled input value
 *   onChange     {Function} — called with (newValue: string) when text changes
 *   onVoiceResult {Function} — optional callback with (transcript: string) when voice finishes
 *   placeholder  {string}
 *   className    {string}
 */
const SearchVoiceInput = ({
    value = '',
    onChange,
    onVoiceResult,
    placeholder = 'Search…',
    className = '',
}) => {
    const [micState, setMicState] = useState('idle'); // idle | listening | error
    const [hasSupport, setHasSupport] = useState(true);
    const recognitionRef = useRef(null);
    const inputRef = useRef(null);

    // Check Web Speech API availability once
    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) setHasSupport(false);
    }, []);

    const stopRecognition = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setMicState('idle');
    }, []);

    const startListening = useCallback(() => {
        if (!hasSupport || micState === 'listening') {
            stopRecognition();
            return;
        }

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onstart = () => setMicState('listening');

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (onChange) onChange(transcript);
            if (onVoiceResult) onVoiceResult(transcript);
            setMicState('idle');
            inputRef.current?.focus();
        };

        recognition.onerror = () => {
            setMicState('error');
            setTimeout(() => setMicState('idle'), 1500);
        };

        recognition.onend = () => {
            if (micState === 'listening') setMicState('idle');
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [hasSupport, micState, onChange, onVoiceResult, stopRecognition]);

    const handleMicClick = () => {
        if (micState === 'listening') {
            stopRecognition();
        } else {
            startListening();
        }
    };

    const handleClear = () => {
        if (onChange) onChange('');
        inputRef.current?.focus();
    };

    // Ripple animation colours per state
    const micColour = {
        idle: 'text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400',
        listening: 'text-indigo-600 dark:text-indigo-400',
        error: 'text-red-500',
    }[micState];

    return (
        <div className={`relative group ${className}`}>
            {/* Search icon — left */}
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <MagnifyingGlassIcon
                    className={`h-4 w-4 transition-colors duration-200 ${micState === 'listening'
                            ? 'text-indigo-500'
                            : 'text-gray-400 group-focus-within:text-indigo-500'
                        }`}
                />
            </div>

            {/* Text input */}
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                placeholder={micState === 'listening' ? '🎤 Listening…' : placeholder}
                className={`
          block w-full rounded-xl border bg-white/60 dark:bg-gray-800/60
          pl-10 pr-20 py-2.5 text-sm text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          border-gray-200 dark:border-gray-700
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
          focus:outline-none backdrop-blur-sm
          transition-all duration-200
          ${micState === 'listening'
                        ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-400/25'
                        : ''}
          ${micState === 'error'
                        ? 'border-red-400 dark:border-red-500 ring-2 ring-red-400/20'
                        : ''}
        `}
            />

            {/* Right-side icon cluster */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-0.5">
                {/* Clear button (only when there's text) */}
                {value && micState === 'idle' && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150"
                        title="Clear search"
                    >
                        <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                )}

                {/* Mic button */}
                {hasSupport && (
                    <button
                        type="button"
                        onClick={handleMicClick}
                        title={
                            micState === 'listening'
                                ? 'Stop listening'
                                : micState === 'error'
                                    ? 'Mic error — click to retry'
                                    : 'Search by voice'
                        }
                        className={`
              relative p-1.5 rounded-lg transition-all duration-200
              hover:bg-indigo-50 dark:hover:bg-indigo-900/30
              ${micState === 'listening' ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}
              ${micState === 'error' ? 'bg-red-50 dark:bg-red-900/20' : ''}
            `}
                    >
                        {/* Pulse ring while listening */}
                        {micState === 'listening' && (
                            <>
                                <span className="absolute inset-0 rounded-lg animate-ping bg-indigo-400/30" />
                                <span className="absolute inset-0 rounded-lg animate-pulse bg-indigo-300/20" />
                            </>
                        )}

                        {/* Mic SVG (not using heroicon so we can have a solid variant) */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={micState === 'listening' ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth={micState === 'listening' ? '0' : '1.8'}
                            className={`h-4 w-4 relative z-10 transition-colors duration-200 ${micColour}`}
                        >
                            {micState === 'error' ? (
                                // X mark for error state
                                <>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                                </>
                            ) : (
                                <>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                                    />
                                </>
                            )}
                        </svg>
                    </button>
                )}
            </div>

            {/* Listening tooltip badge */}
            {micState === 'listening' && (
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-50">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-xs font-medium shadow-lg">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        Listening — speak now
                    </span>
                </div>
            )}
        </div>
    );
};

export default SearchVoiceInput;
