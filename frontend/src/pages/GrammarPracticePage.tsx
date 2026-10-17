import React, { useState } from 'react';
import api from '../services/api';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';

export const GrammarPracticePage: React.FC = () => {
  const [inputText, setInputText] = useState('I has a book.');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/api/ai/grammar-check', { text: inputText });
      setResult(res.data);
    } catch (err) {
      console.error('Grammar check error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>AI Grammar Correction</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Paste or type any sentence for instant AI grammatical analysis and rule explanations
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. I has a book or He go to school yesterday..."
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none text-sm leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            onClick={handleCheck}
            disabled={loading || !inputText.trim()}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2"
          >
            {loading ? 'Analyzing Grammar...' : 'Check Grammar (+5 XP)'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Text */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Original Text:</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">"{result.original_text}"</p>
            </div>

            {/* Corrected Version */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Corrected Version:
              </span>
              <p className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">"{result.corrected_text}"</p>
            </div>
          </div>

          {/* Grammar Rule Explanation */}
          <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/40 space-y-2">
            <h4 className="text-xs font-bold uppercase text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" /> Grammar Rule & Explanation:
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {result.explanation}
            </p>
          </div>

          {/* Mistakes & Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400">Detected Mistakes</h4>
              <ul className="space-y-1 text-xs text-rose-600 dark:text-rose-400">
                {result.mistakes?.map((m: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-xl">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400">Fluency Improvements</h4>
              <ul className="space-y-1 text-xs text-indigo-600 dark:text-indigo-400">
                {result.suggested_improvements?.map((s: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/30 p-2 rounded-xl">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
