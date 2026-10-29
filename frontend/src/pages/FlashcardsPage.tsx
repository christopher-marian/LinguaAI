import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { VocabularyItem } from '../types';
import { FlashcardCard } from '../components/FlashcardCard';
import { SUPPORTED_LANGUAGES } from '../utils/languages';
import {
  Layers,
  RotateCcw,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Filter,
  AlertCircle,
  RefreshCw,
  Award
} from 'lucide-react';

const CATEGORIES = ['All', 'Daily Life', 'Travel', 'Food', 'Technology', 'Grammar'];

export const FlashcardsPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    () => user?.learning_language || 'All'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Session Statistics
  const [reviewedCount, setReviewedCount] = useState(0);

  // Update language when user profile loads
  useEffect(() => {
    if (user?.learning_language && selectedLanguage === 'All') {
      setSelectedLanguage(user.learning_language);
    }
  }, [user]);

  useEffect(() => {
    fetchCards();
  }, [selectedLanguage, selectedCategory]);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (selectedLanguage && selectedLanguage !== 'All') {
        params.language = selectedLanguage;
      }
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const res = await api.get('/api/vocabulary', { params });
      setItems(res.data);
      setCurrentIndex(0);
      setCompleted(false);
      setReviewedCount(0);
    } catch (err: any) {
      console.error('Failed to load flashcards:', err);
      setError(err?.response?.data?.detail || 'Failed to load flashcards. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: number, rating: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await api.post(`/api/vocabulary/${id}/review`, { rating });
      setReviewedCount((prev) => prev + 1);

      if (currentIndex + 1 < items.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCompleted(true);
      }
    } catch (err) {
      console.error('Review submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextCard = () => {
    if (currentIndex + 1 < items.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleGenerateCards = async () => {
    const targetLang = selectedLanguage !== 'All' ? selectedLanguage : user?.learning_language || 'Spanish';
    const targetTopic = selectedCategory !== 'All' ? selectedCategory : 'Daily Life';

    setGenerating(true);
    setError(null);
    try {
      await api.post('/api/vocabulary/ai-generate', {
        topic: targetTopic,
        language: targetLang,
        count: 5
      });
      // Re-fetch deck after generating
      await fetchCards();
    } catch (err: any) {
      console.error('AI Flashcard generation failed:', err);
      setError(err?.response?.data?.detail || 'Failed to generate vocabulary. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const progressPercentage = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round(((currentIndex + 1) / items.length) * 100);
  }, [currentIndex, items.length]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
          <Layers className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>Interactive Flashcards</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Spaced Repetition System (SRS) for accelerated vocabulary mastery
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Languages</option>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Topic:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-200"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCards}
            disabled={loading}
            title="Reload cards"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleGenerateCards}
            disabled={generating}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'Generating...' : 'AI Generate'}</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center justify-between text-rose-700 dark:text-rose-300 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchCards}
            className="underline font-bold hover:text-rose-900 dark:hover:text-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Loading your vocabulary deck...</p>
        </div>
      ) : generating ? (
        <div className="p-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            AI is Generating Flashcards...
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Creating vocabulary, translations, and contextual examples for{' '}
            <span className="font-bold text-brand-600 dark:text-brand-400">
              {selectedLanguage !== 'All' ? selectedLanguage : 'your target language'}
            </span>
            .
          </p>
        </div>
      ) : completed ? (
        /* Completed Deck State */
        <div className="p-8 sm:p-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Flashcard Session Complete!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You reviewed {reviewedCount || items.length} cards in this session.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-400 font-semibold block">Cards Studied</span>
              <span className="text-xl font-black text-brand-600 dark:text-brand-400">
                {items.length}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-400 font-semibold block">Language</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate block">
                {selectedLanguage}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={fetchCards}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Review Again</span>
            </button>
            <button
              onClick={handleGenerateCards}
              className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs inline-flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Generate More Cards</span>
            </button>
          </div>
        </div>
      ) : items.length === 0 ? (
        /* Empty Deck State */
        <div className="p-8 sm:p-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-5 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              No Flashcards Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              There are no vocabulary cards matching{' '}
              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedLanguage}</span> (
              {selectedCategory}). You can generate brand new ones with AI right now!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleGenerateCards}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate 5 Flashcards with AI</span>
            </button>
            <button
              onClick={() => {
                setSelectedLanguage('All');
                setSelectedCategory('All');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Show All Decks
            </button>
          </div>
        </div>
      ) : (
        /* Active Deck Presentation */
        <div className="space-y-4">
          {/* Navigation and Progress Header */}
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Card {currentIndex + 1} of {items.length}
              </span>
              <span className="hidden sm:inline text-slate-400">• Click card to flip</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevCard}
                disabled={currentIndex === 0}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                title="Previous card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextCard}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                title="Next card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Flashcard Item */}
          <FlashcardCard
            item={items[currentIndex]}
            onReview={handleReview}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
};
