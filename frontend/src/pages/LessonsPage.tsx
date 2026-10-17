import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Lesson } from '../types';
import { BookOpen, Clock, Award, Filter, ArrowRight } from 'lucide-react';

export const LessonsPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [level, setLevel] = useState<string>('All');
  const [category, setCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, [level, category]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      let url = '/api/lessons?';
      if (level !== 'All') url += `level=${level}&`;
      if (category !== 'All') url += `category=${category}&`;
      const res = await api.get(url);
      setLessons(res.data);
    } catch (err) {
      console.error('Failed to load lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>Structured Lessons</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Learn step-by-step through interactive modules ending with quizzes
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
          <Filter className="w-4 h-4" /> Filter By:
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Elementary">Elementary</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
          >
            <option value="All">All Categories</option>
            <option value="Vocabulary">Vocabulary</option>
            <option value="Grammar">Grammar</option>
            <option value="Listening">Listening</option>
            <option value="Speaking">Speaking</option>
          </select>
        </div>
      </div>

      {/* Lessons Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No lessons matching selected filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-full font-bold bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                    {lesson.category}
                  </span>
                  <span className="font-semibold text-slate-400">{lesson.level}</span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {lesson.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {lesson.estimated_time} mins
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                    <Award className="w-3.5 h-3.5" />
                    +{lesson.xp_reward} XP
                  </span>
                </div>

                <Link
                  to={`/lessons/${lesson.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1"
                >
                  <span>Start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
