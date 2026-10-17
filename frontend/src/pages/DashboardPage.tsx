import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { StatCard } from '../components/StatCard';
import {
  BookOpen,
  Award,
  Flame,
  CheckCircle,
  Brain,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Trophy,
  Activity
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/api/users/dashboard');
        setDashboardData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { quiz_avg, vocab_learned, lessons_completed, overall_progress, skills_progress, lesson_in_progress, recommendations } = dashboardData;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-brand-600 to-indigo-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-brand-500/15">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold">
            <span>Target: {user?.learning_language} ({user?.level})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-brand-100 text-xs sm:text-sm">
            Ready to continue your journey to fluency in {user?.learning_language}?
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
          <div className="text-center px-2">
            <div className="text-xs text-brand-100 font-semibold uppercase">Daily Goal</div>
            <div className="text-lg font-bold">15 / 20 min</div>
          </div>
          <Target className="w-6 h-6 text-amber-300" />
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Current Level" value={user?.level || 'Beginner'} subtitle={`${user?.learning_language}`} icon={Brain} />
        <StatCard title="Total XP" value={`${user?.points} XP`} subtitle="Ranked Top 5%" icon={Award} />
        <StatCard title="Streak" value={`${user?.streak} Days`} subtitle="Daily Activity 🔥" icon={Flame} />
        <StatCard title="Overall Progress" value={`${int(overall_progress)}%`} subtitle="Skill Mastery" icon={TrendingUp} />
      </div>

      {/* Main Grid: Recommended & Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Continue Learning + Recommended For You */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span>Continue Learning</span>
              </h2>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-full">
                In Progress
              </span>
            </div>

            {lesson_in_progress && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                      {lesson_in_progress.category}
                    </span>
                    <span className="text-xs text-slate-500">{lesson_in_progress.estimated_time} mins</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {lesson_in_progress.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {lesson_in_progress.description}
                  </p>
                </div>

                <Link
                  to={`/lessons/${lesson_in_progress.id}`}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 shrink-0 flex items-center justify-center gap-1.5"
                >
                  <span>Resume Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Recommended For You */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Recommended For You</h2>
                  <p className="text-xs text-slate-500">{recommendations?.reason}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {recommendations?.recommended_lessons?.map((rec: any) => (
                <Link
                  key={rec.id}
                  to={`/lessons/${rec.id}`}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-all group space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-brand-600 dark:text-brand-400">{rec.category}</span>
                    <span>{rec.estimated_time} min</span>
                  </div>
                  <h4 className="font-extrabold text-sm group-hover:text-brand-600 transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{rec.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Skill Breakdown Progress Bars */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Skill Progress</span>
            </h2>

            <div className="space-y-3.5 pt-1">
              {Object.entries(skills_progress).map(([skill, pct]: any) => (
                <div key={skill} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{skill}</span>
                    <span className="text-brand-600 font-bold">{int(pct)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function int(val: any) {
  return Math.round(Number(val) || 0);
}
