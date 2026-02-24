import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, StopIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { parseVoiceExpense } from '../../services/aiService';
import toast from 'react-hot-toast';

/**
 * VoiceExpenseButton - Captures voice and parses it into expense data.
 * @param {Function} onParsed - Callback receiving { amount, category, description, date }
 */
const VoiceExpenseButton = ({ onParsed }) => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Init Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-IN';

            recognitionRef.current.onresult = async (event) => {
                const transcript = event.results[0][0].transcript;
                setIsListening(false);
                await handleVoiceProcess(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                toast.error(`Voice error: ${event.error}`);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error('Voice recognition not supported in this browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const handleVoiceProcess = async (text) => {
        setIsProcessing(true);
        try {
            toast.loading('AI is parsing your voice...', { id: 'voice-parse' });
            const response = await parseVoiceExpense(text);

            if (response.isFallback) {
                toast.error('AI could not understand clearly. Please try again.', { id: 'voice-parse' });
                return;
            }

            // Expecting JSON-ish text from Phi-3: "Amount: 500, Category: Meals, ..."
            // However, the backend should return actual JSON in result if prompted correctly.
            // Let's assume the result is a JSON string for now as per technical requirements.
            try {
                const data = JSON.parse(response.result);
                onParsed(data);
                toast.success('Expense parsed successfully!', { id: 'voice-parse' });
            } catch (e) {
                // Handle non-JSON result
                toast.error('AI returned invalid data format.', { id: 'voice-parse' });
                console.warn('AI Parsing failed:', response.result);
            }
        } catch (error) {
            toast.error('Failed to connect to AI.', { id: 'voice-parse' });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                type="button"
                onClick={toggleListening}
                disabled={isProcessing}
                className={`p-4 rounded-full transition-all duration-300 transform active:scale-95 ${isListening
                        ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-200'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isListening ? 'Stop Listening' : 'Click to Speak'}
            >
                {isListening ? (
                    <StopIcon className="w-6 h-6" />
                ) : isProcessing ? (
                    <SparklesIcon className="w-6 h-6 animate-spin" />
                ) : (
                    <MicrophoneIcon className="w-6 h-6" />
                )}
            </button>
            <span className="text-xs font-medium text-gray-500">
                {isListening ? 'Listening...' : isProcessing ? 'AI Processing...' : 'Add via Voice'}
            </span>
        </div>
    );
};

export default VoiceExpenseButton;
