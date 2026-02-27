import { useState, useEffect, useRef, useCallback } from 'react';
import { sendVoiceCommand, getVoiceHints } from '../services/voiceService';

/**
 * useVoiceAssistant
 *
 * Encapsulates the full voice assistant lifecycle:
 *  - Web Speech API (start / stop / interim results)
 *  - Sending transcript to backend
 *  - Speaking the response aloud via SpeechSynthesis
 *  - Session history (last 10 interactions)
 */
const useVoiceAssistant = () => {
  const [isListening, setIsListening]         = useState(false);
  const [isProcessing, setIsProcessing]       = useState(false);
  const [transcript, setTranscript]           = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [response, setResponse]               = useState(null);
  const [error, setError]                     = useState(null);
  const [hints, setHints]                     = useState([]);
  const [history, setHistory]                 = useState([]);
  const [isSpeaking, setIsSpeaking]           = useState(false);
  const [isSupported, setIsSupported]         = useState(true);

  const recognitionRef = useRef(null);
  const synthRef       = useRef(window.speechSynthesis);

  // ── Browser support check ─────────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous      = false;
    rec.interimResults  = true;
    rec.lang            = 'en-IN';
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsListening(true);
      setError(null);
      setInterimTranscript('');
    };

    rec.onresult = (event) => {
      let interim = '';
      let final   = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimTranscript(interim);
      if (final) setTranscript(final);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access.');
      } else {
        setError(`Voice error: ${event.error}`);
      }
    };

    recognitionRef.current = rec;
  }, []);

  // ── Load role-based hints on mount ────────────────────────────────────────
  useEffect(() => {
    getVoiceHints()
      .then(data => setHints(data.hints || []))
      .catch(() => setHints([]));
  }, []);

  // ── Send transcript to backend when recognition ends ──────────────────────
  useEffect(() => {
    if (!transcript || isListening) return;
    processTranscript(transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isListening]);

  // ── Start / stop listening ────────────────────────────────────────────────
  const toggleListening = useCallback(() => {
    if (!isSupported) {
      setError('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setInterimTranscript('');
      setResponse(null);
      setError(null);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        setError('Could not start microphone. Is it already in use?');
      }
    }
  }, [isListening, isSupported]);

  // ── Manually set a transcript (e.g. from hint chip click) ────────────────
  const setManualTranscript = useCallback((text) => {
    setTranscript(text);
    setInterimTranscript('');
    setResponse(null);
    setError(null);
    processTranscript(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Core processing ───────────────────────────────────────────────────────
  const processTranscript = async (text) => {
    if (!text?.trim()) return;
    setIsProcessing(true);
    setError(null);
    try {
      const res = await sendVoiceCommand(text);
      setResponse(res);

      // Add to session history
      setHistory(prev => [
        {
          transcript: text,
          intent:     res.intent,
          message:    res.message || res.reply,
          timestamp:  new Date(),
          fallback:   res.fallback,
        },
        ...prev.slice(0, 9), // keep last 10
      ]);

      // Speak the response aloud
      speakText(res.message || res.reply);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to process voice command.';
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Text-to-Speech ────────────────────────────────────────────────────────
  const speakText = (text) => {
    if (!text || !synthRef.current) return;
    synthRef.current.cancel();
    const utterance       = new SpeechSynthesisUtterance(text);
    utterance.lang        = 'en-IN';
    utterance.rate        = 0.95;
    utterance.pitch       = 1.0;
    utterance.volume      = 1.0;
    utterance.onstart     = () => setIsSpeaking(true);
    utterance.onend       = () => setIsSpeaking(false);
    utterance.onerror     = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  };

  const reset = () => {
    setTranscript('');
    setInterimTranscript('');
    setResponse(null);
    setError(null);
    stopSpeaking();
  };

  return {
    isListening,
    isProcessing,
    isSpeaking,
    isSupported,
    transcript,
    interimTranscript,
    response,
    error,
    hints,
    history,
    toggleListening,
    setManualTranscript,
    speakText,
    stopSpeaking,
    reset,
  };
};

export default useVoiceAssistant;
