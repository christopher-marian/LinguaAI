import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Lesson } from '../types';
import { BookOpen, Award, CheckCircle, ArrowLeft, HelpCircle } from 'lucide-react';

export const LessonDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/api/lessons/${id}`);
        setLesson(res.data);
      } catch (err) {
        console.error('Failed to load lesson:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleComplete = async () => {
    try {
      await api.post(`/api/lessons/${id}/complete`);
      setCompleted(true);
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    }
  };

  if (loading || !lesson) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <Link
        to="/lessons"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Lessons
      </Link>

      {/* Header card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
            {lesson.category}
          </span>
          <span className="text-xs font-semibold text-slate-400">{lesson.level} Level</span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {lesson.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {lesson.description}
        </p>
      </div>

      {/* Content Viewer */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 prose dark:prose-invert max-w-none">
        <div className="whitespace-pre-line text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {lesson.content}
        </div>
      </div>

      {/* Completion & Quiz Action */}
      <div className="p-6 rounded-3xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Earn +{lesson.xp_reward} XP upon completion</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Complete this lesson to update your overall level and skill score.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/quizzes"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-brand-600" />
            <span>Take Lesson Quiz</span>
          </Link>

          <button
            onClick={handleComplete}
            disabled={completed}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
              completed
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{completed ? 'Completed!' : 'Mark Completed'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
