import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { VocabularyItem } from '../types';
import { FlashcardCard } from '../components/FlashcardCard';
import { Layers, RotateCcw, CheckCircle } from 'lucide-react';

export const FlashcardsPage: React.FC = () => {
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/vocabulary');
      setItems(res.data);
      setCurrentIndex(0);
      setCompleted(false);
    } catch (err) {
      console.error('Failed to load flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: number, rating: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    try {
      await api.post(`/api/vocabulary/${id}/review`, { rating });
      if (currentIndex + 1 < items.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCompleted(true);
      }
    } catch (err) {
      console.error('Review failed:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in text-center">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
          <Layers className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>Interactive Flashcards</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Spaced Repetition System (SRS) for long-term vocabulary retention
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : completed || items.length === 0 ? (
        <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Flashcard Session Completed!
          </h2>
          <p className="text-sm text-slate-500">
            You've reviewed all cards in your current deck queue.
          </p>
          <button
            onClick={fetchCards}
            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 hover:bg-brand-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Deck</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-4">
            <span>Card {currentIndex + 1} of {items.length}</span>
            <span>{Math.round(((currentIndex + 1) / items.length) * 100)}% Progress</span>
          </div>

          <FlashcardCard item={items[currentIndex]} onReview={handleReview} />
        </div>
      )}
    </div>
  );
};
