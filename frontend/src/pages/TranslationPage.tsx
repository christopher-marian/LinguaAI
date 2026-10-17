import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Languages, ArrowLeftRight, Copy, Check, Trash2, History, Sparkles } from 'lucide-react';

const LANGUAGES = [
  'English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'French', 'Spanish', 'German', 'Japanese'
];

export const TranslationPage: React.FC = () => {
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [inputText, setInputText] = useState('Welcome to LinguaAI language platform!');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/translation/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/api/translate', {
        source_language: sourceLang,
        target_language: targetLang,
        text: inputText
      });
      setTranslatedText(res.data.translated_text);
      fetchHistory();
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
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

      {/* Main Translation Interface */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden p-6 space-y-6">
        {/* Language Selectors */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400">From:</span>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swapLanguages}
            className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-transform active:scale-95"
            title="Swap Languages"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400">To:</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Input / Output Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Input */}
          <div className="flex flex-col space-y-2">
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none text-sm leading-relaxed resize-none"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>{inputText.length} characters</span>
              <button
                onClick={() => setInputText('')}
                className="hover:text-rose-500 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

          {/* Translated Output */}
          <div className="flex flex-col space-y-2">
            <div className="relative w-full h-full min-h-[160px] p-4 rounded-2xl border border-brand-200 dark:border-brand-900/40 bg-brand-50/50 dark:bg-brand-950/30 text-slate-900 dark:text-white text-sm leading-relaxed">
              {loading ? (
                <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-brand-600" />
                  <span>Translating with AI...</span>
                </div>
              ) : translatedText ? (
                <p>{translatedText}</p>
              ) : (
                <span className="text-slate-400 italic">Translation will appear here...</span>
              )}

              {translatedText && (
                <button
                  onClick={copyToClipboard}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 border border-slate-200 dark:border-slate-700 shadow-sm"
                  title="Copy Translation"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
            className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Translate Now (+5 XP)</span>
          </button>
        </div>
      </div>

      {/* History List */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-brand-600" />
            <span>Recent Translation History</span>
          </h3>

          <div className="space-y-3">
            {history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 text-slate-400 font-bold">
                    <span>{item.source_language}</span>
                    <span>→</span>
                    <span className="text-brand-600 dark:text-brand-400">{item.target_language}</span>
                  </div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">"{item.source_text}"</p>
                </div>
                <div className="font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 p-2 rounded-xl border border-brand-100 dark:border-brand-900">
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
