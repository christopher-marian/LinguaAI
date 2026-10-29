import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Languages,
  ArrowLeftRight,
  Copy,
  Check,
  Trash2,
  History,
  Sparkles,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageLocale } from '../utils/languages';

export const TranslationPage: React.FC = () => {
  const { user } = useAuth();
  const [sourceLang, setSourceLang] = useState<string>(() => user?.native_language || 'English');
  const [targetLang, setTargetLang] = useState<string>(() => user?.learning_language || 'Spanish');
  const [inputText, setInputText] = useState('Welcome to LinguaAI language platform!');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  // Update languages if user profile loads after mount
  useEffect(() => {
    if (user?.learning_language && targetLang === 'Spanish' && user.learning_language !== 'Spanish') {
      setTargetLang(user.learning_language);
    }
    if (user?.native_language && sourceLang === 'English' && user.native_language !== 'English') {
      setSourceLang(user.native_language);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/translation/history');
      setHistory(res.data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter text to translate.');
      return;
    }

    if (sourceLang === targetLang) {
      setTranslatedText(inputText.trim());
      setErrorMessage(null);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.post('/api/translate', {
        source_language: sourceLang,
        target_language: targetLang,
        text: inputText.trim()
      });
      setTranslatedText(res.data.translated_text || '');
      fetchHistory();
    } catch (err: any) {
      console.error('Translation error:', err);
      const msg = err.response?.data?.detail || 'Translation service is temporarily unavailable. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    const prevInput = inputText;
    const prevTranslated = translatedText;

    setSourceLang(prevTarget);
    setTargetLang(prevSource);

    // If there is translated text, swap the texts too
    if (prevTranslated.trim()) {
      setInputText(prevTranslated);
      setTranslatedText(prevInput);
    }
    setErrorMessage(null);
  };

  const copyToClipboard = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = (text: string, langName: string) => {
    if (!text || !text.trim()) return;
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported by your browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageLocale(langName);
    window.speechSynthesis.speak(utterance);
  };

  const handleHistorySelect = (item: any) => {
    setSourceLang(item.source_language);
    setTargetLang(item.target_language);
    setInputText(item.source_text);
    setTranslatedText(item.translated_text);
    setErrorMessage(null);
  };

  const clearAll = () => {
    setInputText('');
    setTranslatedText('');
    setErrorMessage(null);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Languages className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            <span>AI Translation Module</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Translate text instantly between 10 global languages with AI precision
          </p>
        </div>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300 font-semibold animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Translation Interface */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden p-6 space-y-6">
        {/* Language Selectors */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400 shrink-0">From:</span>
            <select
              value={sourceLang}
              onChange={(e) => {
                setSourceLang(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={swapLanguages}
            className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-transform active:scale-95 shadow-sm"
            title="Swap Languages"
            type="button"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400 shrink-0">To:</span>
            <select
              value={targetLang}
              onChange={(e) => {
                setTargetLang(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input / Output Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Input */}
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <textarea
                rows={6}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter text to translate..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none text-sm leading-relaxed resize-none"
              />
              {inputText.trim() && (
                <button
                  type="button"
                  onClick={() => speakText(inputText, sourceLang)}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700"
                  title="Listen to original"
                >
                  <Volume2 className="w-4 h-4 text-brand-600" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>{inputText.length} characters</span>
              <button
                type="button"
                onClick={clearAll}
                className="hover:text-rose-500 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

          {/* Translated Output */}
          <div className="flex flex-col space-y-2">
            <div className="relative w-full h-full min-h-[160px] p-4 rounded-2xl border border-brand-200 dark:border-brand-900/40 bg-brand-50/50 dark:bg-brand-950/30 text-slate-900 dark:text-white text-sm leading-relaxed">
              {loading ? (
                <div className="flex items-center justify-center h-full min-h-[130px] text-slate-400 gap-2">
                  <Sparkles className="w-5 h-5 animate-spin text-brand-600" />
                  <span className="font-semibold text-xs text-brand-600">Translating to {targetLang}...</span>
                </div>
              ) : translatedText ? (
                <p className="whitespace-pre-wrap">{translatedText}</p>
              ) : (
                <span className="text-slate-400 italic">Translation in {targetLang} will appear here...</span>
              )}

              {translatedText && !loading && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakText(translatedText, targetLang)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 border border-slate-200 dark:border-slate-700 shadow-sm"
                    title={`Listen in ${targetLang}`}
                  >
                    <Volume2 className="w-4 h-4 text-brand-600" />
                  </button>

                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 border border-slate-200 dark:border-slate-700 shadow-sm"
                    title="Copy Translation"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
            className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Translating...' : 'Translate Now (+5 XP)'}</span>
          </button>
        </div>
      </div>

      {/* History List */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-brand-600" />
              <span>Recent Translation History</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Click any entry to reload</span>
          </div>

          <div className="space-y-3">
            {history.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => handleHistorySelect(item)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer hover:border-brand-400 transition-colors"
                title="Click to reload this translation"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 text-slate-400 font-bold">
                    <span>{item.source_language}</span>
                    <span>→</span>
                    <span className="text-brand-600 dark:text-brand-400">{item.target_language}</span>
                  </div>
                  <p className="font-medium text-slate-800 dark:text-slate-200 truncate">"{item.source_text}"</p>
                </div>
                <div className="font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 p-2 rounded-xl border border-brand-100 dark:border-brand-900 truncate">
                  "{item.translated_text}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
