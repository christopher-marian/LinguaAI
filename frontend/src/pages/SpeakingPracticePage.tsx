import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Mic, MicOff, Volume2, Award, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

export const SpeakingPracticePage: React.FC = () => {
  const [targetPhrase, setTargetPhrase] = useState('Me gustaría un café con leche, por favor.');
  const [spokenText, setSpokenText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [supported, setSupported] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript);
        evaluateSpeech(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const evaluateSpeech = async (spoken: string) => {
    setLoading(true);
    try {
      const res = await api.post('/api/speaking/evaluate', {
        target_phrase: targetPhrase,
        spoken_phrase: spoken
      });
      setResult(res.data);
    } catch (err) {
      console.error('Failed to evaluate speaking:', err);
    } finally {
      setLoading(false);
    }
  };

  const speakTarget = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(targetPhrase);
      u.lang = 'es-ES';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Mic className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>Speaking & Pronunciation Feedback</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Speak out loud using your microphone and receive instant pronunciation accuracy analysis
        </p>
      </div>

      {!supported && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <span>
            Speech Recognition is not supported natively in this browser environment. You can manually enter what you spoke below to test evaluation feedback!
          </span>
        </div>
      )}

      {/* Target Phrase Box */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-6">
        <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
          Target Sentence to Speak
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          "{targetPhrase}"
        </h2>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={speakTarget}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4 text-brand-600" />
            <span>Listen Reference Audio</span>
          </button>
        </div>

        {/* Microphone Button */}
        <div className="pt-4 flex flex-col items-center gap-3">
          <button
            onClick={startListening}
            disabled={isListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-transform active:scale-95 ${
              isListening
                ? 'bg-rose-600 animate-pulse'
                : 'bg-gradient-to-tr from-brand-600 to-indigo-600 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          <span className="text-xs font-semibold text-slate-400">
            {isListening ? 'Listening... Speak clearly into microphone' : 'Tap microphone to speak'}
          </span>
        </div>

        {/* Manual fallback input for environments without mic support */}
        {!supported && (
          <div className="max-w-md mx-auto pt-4 space-y-2">
            <input
              type="text"
              value={spokenText}
              onChange={(e) => setSpokenText(e.target.value)}
              placeholder="Type simulated spoken text..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
            />
            <button
              onClick={() => evaluateSpeech(spokenText)}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Evaluate Manual Spoken Input
            </button>
          </div>
        )}
      </div>

      {/* Result Report */}
      {result && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Pronunciation Evaluation</span>
            </h3>
            <span className="text-lg font-extrabold text-brand-600 bg-brand-50 dark:bg-brand-950 px-4 py-1 rounded-full">
              Accuracy: {result.accuracy_percentage}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Expected:</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">"{result.expected}"</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">Recognized:</span>
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">"{result.spoken}"</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
            <h4 className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Feedback & XP:
            </h4>
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200">
              {result.feedback} (+15 XP Awarded)
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400">Phonetic Tips</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              {result.phonetic_tips?.map((tip: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
