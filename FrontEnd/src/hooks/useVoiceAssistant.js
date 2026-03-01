import { useState, useEffect, useRef, useCallback } from 'react';
import { sendVoiceCommand, getVoiceHints } from '../services/voiceService';
import { showVoiceSearchModal } from '../utils/VoiceModal';


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
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [hints, setHints] = useState([]);
  const [history, setHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // ── Browser support check ─────────────────────────────────────────────────
  // ── Browser support check (legacy initialization removed) ─────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
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

  // ── Start listening via VoiceModal ────────────────────────────────────────
  const toggleListening = useCallback(async () => {
    if (!isSupported) {
      setError('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setTranscript('');
    setInterimTranscript('');
    setResponse(null);
    setError(null);
    setIsListening(true);

    try {
      const result = await showVoiceSearchModal();
      if (result) {
        setTranscript(result); // This will trigger processTranscript via useEffect
      }
    } catch (e) {
      if (e !== 'No speech detected' && !e.includes('aborted')) {
        setError(e);
      }
    } finally {
      setIsListening(false);
    }
  }, [isSupported]);

  // ── Manually set a transcript (e.g. from hint chip click) ────────────────
  const setManualTranscript = useCallback((text) => {
    setTranscript(text);
    setInterimTranscript('');
    setResponse(null);
    setError(null);
    // processTranscript(text); // REMOVED: setTranscript(text) already triggers the useEffect
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
          intent: res.intent,
          message: res.message || res.reply,
          timestamp: new Date(),
          fallback: res.fallback,
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
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
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
