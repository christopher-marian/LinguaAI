import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, Award, Flame, BookOpen, Clock, Brain } from 'lucide-react';
import { StatCard } from '../components/StatCard';

export const ProgressPage: React.FC = () => {
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/api/progress');
        setProgressData(res.data);
      } catch (err) {
        console.error('Failed to load progress analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading || !progressData) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { points, streak, quiz_avg, vocab_count, total_practice_minutes, weekly_activity, radar_skill_data } = progressData;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>Learning Analytics & Progress</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Visualize your weekly activity, skill breakdown, and fluency metrics
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total XP Earned" value={`${points} XP`} subtitle="Lifetime Points" icon={Award} />
        <StatCard title="Current Streak" value={`${streak} Days`} subtitle="Active Learner 🔥" icon={Flame} />
        <StatCard title="Words Mastered" value={vocab_count} subtitle="Vocabulary Bank" icon={Brain} />
        <StatCard title="Total Practice Time" value={`${total_practice_minutes} mins`} subtitle="Dedicated Time" icon={Clock} />
      </div>

      {/* Recharts Diagrams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Bar Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold">Weekly Activity (Minutes & XP)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly_activity}>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none' }}
                />
                <Bar dataKey="minutes" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6 Skill Radar Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold">Comprehensive Skill Radar</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar_skill_data}>
                <PolarGrid stroke="#94a3b8" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Skill Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
