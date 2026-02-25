import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, SparklesIcon, XMarkIcon, MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';
import { naturalSearch } from '../../services/aiService';
import toast from 'react-hot-toast';

/**
 * AISearchBar - Natural language search for expenses.
 * @param {Function} onFilterChange - Callback receiving the filter criteria { category, status, minAmount, maxAmount, dateRange }
 */
const SUGGESTED_QUERIES = [
    "Rejected travel above 500",
    "Highest category this month",
    "Pending approvals for 2024",
    "Audit food and dinner"
];

const AISearchBar = ({ onFilterChange }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-IN';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setIsListening(false);
                setQuery(transcript);
                handleSearch(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                setIsListening(false);
                toast.error(`Voice error: ${event.error}`);
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error('Voice recognition not supported.');
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const handleSearch = async (e) => {
        if (e && typeof e !== 'string') e.preventDefault();
        const searchQuery = typeof e === 'string' ? e : query;
        if (!searchQuery.trim()) return;

        if (typeof e === 'string') setQuery(searchQuery);

        setIsSearching(true);
        try {
            const response = await naturalSearch(searchQuery);

            if (response.isFallback) {
                toast.error('AI Search unavailable — using manual search.');
                onFilterChange({ title: searchQuery });
                return;
            }

            try {
                const filters = JSON.parse(response.result);
                onFilterChange(filters);
                toast.success('Search filters applied!', {
                    icon: '🪄',
                    duration: 2000
                });
            } catch (err) {
                toast.error('AI result parsing failed.');
                onFilterChange({ title: searchQuery });
            }
        } catch (error) {
            toast.error('AI search failed.');
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        onFilterChange({});
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto group">
            {/* Animated Glow Wrapper */}
            <div className={`ai-glow p-[2px] rounded-2xl transition-all duration-500 ${isFocused || isListening ? 'scale-[1.01] shadow-2xl' : 'shadow-lg'}`}>
                <form
                    onSubmit={handleSearch}
                    className={`relative flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 ${isFocused || isListening
                        ? 'bg-white dark:bg-gray-800'
                        : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md'
                        }`}
                >
                    <div className="flex-shrink-0">
                        {isSearching ? (
                            <SparklesIcon className="h-6 w-6 text-indigo-500 animate-spin" />
                        ) : (
                            <MagnifyingGlassIcon className={`h-6 w-6 transition-colors duration-300 ${isFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
                        )}
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        placeholder={isListening ? "Listening..." : "Ask AI: 'Show my rejected travel expenses above 500'..."}
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg"
                        disabled={isSearching}
                    />

                    <div className="flex items-center gap-2">
                        {query && !isSearching && !isListening && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={toggleListening}
                            className={`p-1.5 rounded-full transition-all duration-300 ${isListening
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                                }`}
                            title="Voice Search"
                        >
                            {isListening ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
                        </button>

                        <button
                            type="submit"
                            disabled={isSearching || !query.trim()}
                            className={`px-4 py-1.5 rounded-xl text-sm font-bold tracking-tight transition-all duration-300 ${query.trim()
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 scale-100 hover:scale-105 active:scale-95'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isSearching ? '...' : 'Enter'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Suggested Chips */}
            <div className={`mt-3 flex flex-wrap gap-2 justify-center transition-all duration-500 px-4 ${isFocused ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold w-full text-center mb-1">Suggested for you</span>
                {SUGGESTED_QUERIES.map((q, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => handleSearch(q)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:shadow-md active:scale-95"
                    >
                        {q}
                    </button>
                ))}
            </div>

            {/* Scanning Indicator */}
            {isSearching && (
                <div className="absolute -bottom-10 left-0 right-0 overflow-hidden pointer-events-none">
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    <div className="text-center mt-2">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] animate-pulse">
                            Neural Processing...
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AISearchBar;
