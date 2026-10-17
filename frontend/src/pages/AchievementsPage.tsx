import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Achievement } from '../types';
import { Trophy, Lock, CheckCircle2, Sparkles, Flame, Brain, BookOpen, Mic, Languages } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  BookOpen: BookOpen,
  Brain: Brain,
  Flame: Flame,
  Sparkles: Sparkles,
  Trophy: Trophy,
  Mic: Mic,
  Languages: Languages
};

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await api.get('/api/achievements');
      setAchievements(res.data);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-500" />
            <span>Badges & Achievements</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Unlock badges as you complete lessons, practice speaking, and build streaks
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-extrabold text-sm flex items-center gap-2">
          <span>{unlockedCount} of {achievements.length} Badges Unlocked</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => {
            const IconComponent = ICON_MAP[ach.icon] || Trophy;
            return (
              <div
                key={ach.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  ach.unlocked
                    ? 'bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-700/60 shadow-md'
                    : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        ach.unlocked
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 shadow-sm'
                          : 'bg-slate-200 text-slate-400 dark:bg-slate-800'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {ach.unlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {ach.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-semibold text-slate-400">
                  Requirement: {ach.requirement}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
