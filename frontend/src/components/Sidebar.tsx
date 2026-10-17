import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Languages,
  BookOpen,
  Library,
  Layers,
  Sparkles,
  BookMarked,
  PenTool,
  Headphones,
  Mic,
  Bot,
  HelpCircle,
  TrendingUp,
  Trophy,
  User,
  Settings
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Translation', path: '/translation', icon: Languages },
  { name: 'Lessons', path: '/lessons', icon: BookOpen },
  { name: 'Vocabulary', path: '/vocabulary', icon: Library },
  { name: 'Flashcards', path: '/flashcards', icon: Layers },
  { name: 'Grammar AI', path: '/grammar', icon: Sparkles },
  { name: 'Reading', path: '/reading', icon: BookMarked },
  { name: 'Writing AI', path: '/writing', icon: PenTool },
  { name: 'Listening', path: '/listening', icon: Headphones },
  { name: 'Speaking AI', path: '/speaking', icon: Mic },
  { name: 'AI Tutor', path: '/tutor', icon: Bot },
  { name: 'Quizzes', path: '/quizzes', icon: HelpCircle },
  { name: 'Progress', path: '/progress', icon: TrendingUp },
  { name: 'Achievements', path: '/achievements', icon: Trophy },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Learning Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-semibold shadow-sm border border-brand-200/50 dark:border-brand-800/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
