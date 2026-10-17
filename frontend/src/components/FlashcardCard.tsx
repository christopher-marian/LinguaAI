import React, { useState } from 'react';
import { Volume2, RotateCw } from 'lucide-react';
import { VocabularyItem } from '../types';

interface FlashcardProps {
  item: VocabularyItem;
  onReview: (id: number, rating: 'Again' | 'Hard' | 'Good' | 'Easy') => void;
}

export const FlashcardCard: React.FC<FlashcardProps> = ({ item, onReview }) => {
  const [flipped, setFlipped] = useState(false);

  const handleReview = (rating: 'Again' | 'Hard' | 'Good' | 'Easy', e: React.MouseEvent) => {
    e.stopPropagation();
    onReview(item.id, rating);
    setFlipped(false);
  };

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(item.word);
      u.lang = 'es-ES';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000 my-4">
      <div
        onClick={() => setFlipped(!flipped)}
        className={`relative w-full h-80 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl cursor-pointer transition-transform duration-500 transform-style-3d p-6 flex flex-col justify-between ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of card */}
        {!flipped ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              {item.category} • {item.difficulty}
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {item.word}
            </h2>
            <div className="flex items-center gap-2 text-slate-400 text-xs mt-6">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click or tap card to reveal translation</span>
            </div>
          </div>
        ) : (
          /* Back of card */
          <div className="flex flex-col justify-between h-full text-center rotate-y-180">
            <div className="space-y-3 my-auto">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                  {item.translation}
                </h3>
                <button
                  onClick={speak}
                  className="p-1.5 rounded-full hover:bg-brand-50 dark:hover:bg-brand-950 text-brand-600"
                  title="Listen"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {item.example && (
                <p className="text-sm italic text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  "{item.example}"
                </p>
              )}
            </div>

            {/* SRS Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={(e) => handleReview('Again', e)}
                className="py-2 px-1 text-xs font-semibold rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400"
              >
                Again
              </button>
              <button
                onClick={(e) => handleReview('Hard', e)}
                className="py-2 px-1 text-xs font-semibold rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400"
              >
                Hard
              </button>
              <button
                onClick={(e) => handleReview('Good', e)}
                className="py-2 px-1 text-xs font-semibold rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400"
              >
                Good
              </button>
              <button
                onClick={(e) => handleReview('Easy', e)}
                className="py-2 px-1 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400"
              >
                Easy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
