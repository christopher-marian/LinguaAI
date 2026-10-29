import React, { useState, useEffect } from 'react';
import { Volume2, RotateCw, CheckCircle2 } from 'lucide-react';
import { VocabularyItem } from '../types';
import { getLanguageLocale } from '../utils/languages';

interface FlashcardProps {
  item: VocabularyItem;
  onReview: (id: number, rating: 'Again' | 'Hard' | 'Good' | 'Easy') => void;
  isSubmitting?: boolean;
}

export const FlashcardCard: React.FC<FlashcardProps> = ({ item, onReview, isSubmitting = false }) => {
  const [flipped, setFlipped] = useState(false);

  // When active card item changes, reset flip to front side
  useEffect(() => {
    setFlipped(false);
  }, [item.id]);

  const handleReview = (rating: 'Again' | 'Hard' | 'Good' | 'Easy', e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitting) return;
    onReview(item.id, rating);
  };

  const speak = (e: React.MouseEvent, text: string, langName: string) => {
    e.stopPropagation();
    if (!text || !text.trim()) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = getLanguageLocale(langName);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000 my-4">
      <div
        onClick={() => setFlipped(!flipped)}
        className={`relative w-full min-h-[350px] rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl cursor-pointer transition-transform duration-500 transform-style-3d p-6 flex flex-col justify-between select-none ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of card */}
        {!flipped ? (
          <div className="flex flex-col items-center justify-between h-full text-center space-y-6">
            <div className="w-full flex items-center justify-between">
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                {item.language} • {item.category}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {item.difficulty}
              </span>
            </div>

            <div className="space-y-4 my-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {item.word}
              </h2>
              <button
                type="button"
                onClick={(e) => speak(e, item.word, item.language)}
                className="p-2 rounded-full bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-600 dark:text-brand-400 transition-colors inline-flex items-center gap-1.5 text-xs font-bold"
                title={`Listen in ${item.language}`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen ({item.language})</span>
              </button>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mastery: {item.mastery_level}%</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <RotateCw className="w-3.5 h-3.5 text-brand-500" />
                <span>Click to reveal translation</span>
              </div>
            </div>
          </div>
        ) : (
          /* Back of card */
          <div className="flex flex-col justify-between h-full text-center rotate-y-180 space-y-4">
            <div className="w-full flex items-center justify-between">
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                Meaning & Example
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {item.language}
              </span>
            </div>

            <div className="space-y-3 my-auto">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                  {item.translation}
                </h3>
                <button
                  type="button"
                  onClick={(e) => speak(e, item.translation, 'English')}
                  className="p-1.5 rounded-full hover:bg-brand-50 dark:hover:bg-brand-950 text-brand-600"
                  title="Listen in English"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {item.example && (
                <div className="text-xs italic text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <p className="text-left font-medium">"{item.example}"</p>
                  <button
                    type="button"
                    onClick={(e) => speak(e, item.example, item.language)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 shrink-0"
                    title={`Listen example in ${item.language}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* SRS Review Action Buttons */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                How well do you remember this?
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleReview('Again', e)}
                  className="py-2.5 px-1 text-xs font-bold rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 transition-colors disabled:opacity-50"
                  title="Need to review again soon (-15% mastery)"
                >
                  Again
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleReview('Hard', e)}
                  className="py-2.5 px-1 text-xs font-bold rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 transition-colors disabled:opacity-50"
                  title="Hard to remember (+5% mastery)"
                >
                  Hard
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleReview('Good', e)}
                  className="py-2.5 px-1 text-xs font-bold rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 transition-colors disabled:opacity-50"
                  title="Remembered with effort (+15% mastery)"
                >
                  Good
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleReview('Easy', e)}
                  className="py-2.5 px-1 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 transition-colors disabled:opacity-50"
                  title="Easily recalled (+30% mastery)"
                >
                  Easy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
