import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { VocabularyItem } from '../types';
import { Library, Search, Volume2, Filter, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['All', 'Daily Life', 'Travel', 'Education', 'Technology', 'Food', 'Work', 'Communication'];
const DIFFICULTIES = ['All', 'Beginner', 'Elementary', 'Intermediate', 'Advanced'];

export const VocabularyPage: React.FC = () => {
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVocab();
  }, [category, difficulty, search]);

  const fetchVocab = async () => {
    setLoading(true);
    try {
      let url = `/api/vocabulary?category=${category}&difficulty=${difficulty}&`;
      if (search) url += `search=${search}`;
      const res = await api.get(url);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch vocabulary:', err);
    } finally {
      setLoading(false);
    }
  };

  const speak = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'es-ES';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Library className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>Vocabulary Bank</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Explore target vocabulary categorized by real-world topics
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search word or translation..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vocabulary Card Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No vocabulary items found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((v) => (
            <div
              key={v.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                    {v.category}
                  </span>
                  <button
                    onClick={() => speak(v.word)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-brand-600"
                    title="Pronounce Word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {v.word}
                  </h3>
                  <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                    {v.translation}
                  </span>
                </div>

                {v.example && (
                  <p className="text-xs italic text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl">
                    "{v.example}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{v.difficulty}</span>
                <div className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mastery: {v.mastery_level}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
