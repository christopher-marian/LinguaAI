import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { VocabularyItem } from '../types';
import { SUPPORTED_LANGUAGES, getLanguageLocale } from '../utils/languages';
import {
  Library,
  Search,
  Volume2,
  Filter,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = ['All', 'Daily Life', 'Travel', 'Education', 'Technology', 'Food', 'Work', 'Grammar'];
const DIFFICULTIES = ['All', 'Beginner', 'Elementary', 'Intermediate', 'Advanced'];

export const VocabularyPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    () => user?.learning_language || 'All'
  );
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update language when user profile loads
  useEffect(() => {
    if (user?.learning_language && selectedLanguage === 'All') {
      setSelectedLanguage(user.learning_language);
    }
  }, [user]);

  useEffect(() => {
    fetchVocab();
  }, [selectedLanguage, category, difficulty, search]);

  const fetchVocab = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (selectedLanguage && selectedLanguage !== 'All') {
        params.language = selectedLanguage;
      }
      if (category && category !== 'All') {
        params.category = category;
      }
      if (difficulty && difficulty !== 'All') {
        params.difficulty = difficulty;
      }
      if (search && search.trim()) {
        params.search = search.trim();
      }

      const res = await api.get('/api/vocabulary', { params });
      setItems(res.data);
    } catch (err: any) {
      console.error('Failed to fetch vocabulary:', err);
      setError(err?.response?.data?.detail || 'Failed to load vocabulary.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAiVocab = async () => {
    const targetLang = selectedLanguage !== 'All' ? selectedLanguage : user?.learning_language || 'Spanish';
    const targetTopic = category !== 'All' ? category : 'Daily Life';

    setGenerating(true);
    setError(null);
    try {
      await api.post('/api/vocabulary/ai-generate', {
        topic: targetTopic,
        language: targetLang,
        count: 5
      });
      await fetchVocab();
    } catch (err: any) {
      console.error('Failed to generate vocabulary:', err);
      setError(err?.response?.data?.detail || 'AI vocabulary generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const speak = (word: string, languageName?: string) => {
    if (!word || !word.trim()) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = getLanguageLocale(languageName || selectedLanguage || 'Spanish');
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Library className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            <span>Vocabulary Bank</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Explore target vocabulary categorized by real-world topics across all supported languages
          </p>
        </div>

        <button
          onClick={handleGenerateAiVocab}
          disabled={generating}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 transition disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          <span>{generating ? 'Generating Words...' : 'AI Generate Words'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center justify-between text-rose-700 dark:text-rose-300 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchVocab} className="underline font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search word or translation..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap gap-2.5 w-full lg:w-auto items-center">
          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Languages</option>
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.name} value={l.name}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Topic: {c}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                Level: {d}
              </option>
            ))}
          </select>

          <button
            onClick={fetchVocab}
            title="Refresh list"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Vocabulary Card Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="p-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            No vocabulary items match your filters for{' '}
            <span className="font-bold text-slate-700 dark:text-slate-200">{selectedLanguage}</span>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleGenerateAiVocab}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Words with AI</span>
            </button>
            <button
              onClick={() => {
                setSelectedLanguage('All');
                setCategory('All');
                setDifficulty('All');
                setSearch('');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((v) => (
            <div
              key={v.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                      {v.language}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {v.category}
                    </span>
                  </div>
                  <button
                    onClick={() => speak(v.word, v.language)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-brand-600 dark:text-brand-400 transition"
                    title={`Pronounce in ${v.language}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {v.word}
                  </h3>
                  <span className="text-sm font-bold text-brand-600 dark:text-brand-400 text-right">
                    {v.translation}
                  </span>
                </div>

                {v.example && (
                  <p className="text-xs italic text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
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
