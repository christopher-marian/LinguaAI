import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES, getLanguageLocale } from '../utils/languages';
import { Mic, MicOff, Volume2, Award, CheckCircle, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const SAMPLE_PHRASES: Record<string, string[]> = {
  Spanish: [
    'Me gustaría un café con leche, por favor.',
    '¿Dónde está la estación de tren más cercana?',
    'Mucho gusto en conocerte hoy.',
    'La comida en este restaurante es deliciosa.'
  ],
  French: [
    "Je voudrais un café au lait, s'il vous plaît.",
    "Où se trouve la gare la plus proche ?",
    "Enchanté de faire votre connaissance.",
    "La cuisine ici est vraiment excellente."
  ],
  German: [
    'Ich möchte bitte einen Kaffee mit Milch.',
    'Wo ist der nächste Bahnhof, bitte?',
    'Sehr angenehm, Sie kennenzulernen.',
    'Das Essen in diesem Restaurant schmeckt wunderbar.'
  ],
  Japanese: [
    'こんにちは、お元気ですか？',
    '駅はどこにありますか？',
    'はじめまして、よろしくお願いします。',
    'この料理はとても美味しいです。'
  ],
  Hindi: [
    'नमस्ते, आप कैसे हैं?',
    'कृपया मुझे एक कप चाय दीजिए।',
    'आपसे मिलकर बहुत खुशी हुई।',
    'यह शहर बहुत सुंदर है।'
  ],
  Tamil: [
    'வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?',
    'தயவுசெய்து ஒரு காபி கொடுங்கள்.',
    'உங்களை சந்தித்ததில் மகிழ்ச்சி.',
    'இந்த உணவு மிகவும் சுவையாக இருக்கிறது.'
  ],
  Telugu: [
    'నమస్కారం, మీరు ఎలా ఉన్నారు?',
    'దయచేసి నాకు ఒక కాఫీ ఇవ్వండి.',
    'మిమ్మల్ని కలవడం చాలా సంతోషంగా ఉంది.',
    'ఈ భోజనం చాలా రుచిగా ఉంది.'
  ],
  Malayalam: [
    'നമസ്കാരം, സുഖമാണോ?',
    'ദയവായി എനിക്ക് ഒരു കാപ്പി തരൂ.',
    'നിങ്ങളെ കണ്ടതിൽ സന്തോഷം.',
    'ഈ ഭക്ഷണം വളരെ രുചികരമാണ്.'
  ],
  Kannada: [
    'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?',
    'ದಯವಿಟ್ಟು ನನಗೆ ಒಂದು ಕಾಫಿ ಕೊಡಿ.',
    'ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಿದ್ದಕ್ಕೆ ಸಂತೋಷವಾಗಿದೆ.',
    'ಈ ಊಟ ತುಂಬಾ ರುಚಿಯಾಗಿದೆ.'
  ],
  English: [
    'I would like a cup of coffee with milk, please.',
    'Where is the nearest train station?',
    'Pleased to meet you today.',
    'The food at this restaurant is delicious.'
  ]
};

export const SpeakingPracticePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    () => user?.learning_language || 'Spanish'
  );
  const [targetPhrase, setTargetPhrase] = useState(
    () => (SAMPLE_PHRASES[user?.learning_language || 'Spanish'] || SAMPLE_PHRASES.Spanish)[0]
  );
  const [spokenText, setSpokenText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [supported, setSupported] = useState(true);
  const [loading, setLoading] = useState(false);

  // Sync language with user profile
  useEffect(() => {
    if (user?.learning_language && user.learning_language !== 'Spanish' && selectedLanguage === 'Spanish') {
      setSelectedLanguage(user.learning_language);
      const phrases = SAMPLE_PHRASES[user.learning_language] || SAMPLE_PHRASES.Spanish;
      setTargetPhrase(phrases[0]);
    }
  }, [user]);

  // When language changes, update target phrase
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    const phrases = SAMPLE_PHRASES[lang] || SAMPLE_PHRASES.Spanish;
    setTargetPhrase(phrases[0]);
    setResult(null);
    setSpokenText('');
  };

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
      recognition.lang = getLanguageLocale(selectedLanguage);
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
    if (!spoken || !spoken.trim()) return;
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
      u.lang = getLanguageLocale(selectedLanguage);
      window.speechSynthesis.speak(u);
    }
  };

  const samplePhrases = SAMPLE_PHRASES[selectedLanguage] || SAMPLE_PHRASES.Spanish;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Mic className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>Speaking & Pronunciation Feedback</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Speak out loud using your microphone and receive instant pronunciation accuracy analysis
        </p>
      </div>

      {/* Language Selector Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Practice Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-200"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.name} value={l.name}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Locale:</span>
          <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
            {getLanguageLocale(selectedLanguage)}
          </span>
        </div>
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
          Target Sentence to Speak ({selectedLanguage})
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          "{targetPhrase}"
        </h2>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={speakTarget}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition"
          >
            <Volume2 className="w-4 h-4 text-brand-600" />
            <span>Listen Reference Audio</span>
          </button>
        </div>

        {/* Preset Phrase Selector */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">
            Or choose another practice sentence:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {samplePhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTargetPhrase(phrase);
                  setResult(null);
                  setSpokenText('');
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                  targetPhrase === phrase
                    ? 'bg-brand-50 border-brand-500 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Phrase {idx + 1}
              </button>
            ))}
          </div>
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
            {isListening ? `Listening for ${selectedLanguage}... Speak clearly` : 'Tap microphone to speak'}
          </span>
        </div>

        {/* Manual fallback input for environments without mic support */}
        <div className="max-w-md mx-auto pt-4 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400">
            Manual Voice Simulation / Typing:
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={spokenText}
              onChange={(e) => setSpokenText(e.target.value)}
              placeholder={`Type what you spoke in ${selectedLanguage}...`}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
            />
            <button
              onClick={() => evaluateSpeech(spokenText)}
              disabled={loading || !spokenText.trim()}
              className="px-3 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shrink-0"
            >
              {loading ? 'Evaluating...' : 'Evaluate'}
            </button>
          </div>
        </div>
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
