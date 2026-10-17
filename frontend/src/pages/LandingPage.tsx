import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Languages,
  BookOpen,
  Brain,
  Mic,
  Trophy,
  CheckCircle2,
  Bot,
  BarChart3,
  Globe2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-semibold mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Next-Generation AI Language Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Master Languages with <span className="bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 bg-clip-text text-transparent">AI Intelligence</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
          Translate, practice, speak and learn smarter with your personal AI-powered language learning platform.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/translation"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-base flex items-center justify-center gap-2 transition-all"
          >
            <Languages className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>Explore Translation</span>
          </Link>
        </div>

        {/* Dashboard Visual Preview */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl p-3 bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-left border border-slate-100 dark:border-slate-700 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-semibold text-slate-400 ml-2">LinguaAI Dashboard Preview</span>
              </div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-3 py-1 rounded-full">Spanish • Intermediate</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/40">
                <div className="text-xs text-brand-600 font-bold uppercase">Daily Streak</div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">🔥 7 Days</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                <div className="text-xs text-emerald-600 font-bold uppercase">Total XP Points</div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">⚡ 340 XP</div>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
                <div className="text-xs text-indigo-600 font-bold uppercase">Overall Mastery</div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">📈 68%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Everything You Need to Become Fluent</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">All essential language skills unified into one powerful AI platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Languages, title: "AI Translation", desc: "Instant high-accuracy translation across 10 global languages." },
              { icon: Brain, title: "Personalized Learning", desc: "Dynamic recommendations based on your weakest skill metrics." },
              { icon: Sparkles, title: "AI Grammar Correction", desc: "Real-time mistake detection with explanations and suggestions." },
              { icon: Mic, title: "Speaking Practice", desc: "Speech recognition accuracy scores with instant phonetic tips." },
              { icon: Bot, title: "AI Language Tutor", desc: "Conversational practice with instant corrections across topics." },
              { icon: BookOpen, title: "Interactive Lessons", desc: "Structured bite-sized modules ending with interactive quizzes." },
              { icon: BarChart3, title: "Progress Tracking", desc: "Radar charts and analytics visualizing your skill growth." },
              { icon: Trophy, title: "Gamification", desc: "Streaks, XP points, levels, and unlocked achievement badges." },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How LinguaAI Works</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Five simple steps to language mastery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { step: "1", title: "Choose Language", desc: "Select your native and target learning language." },
            { step: "2", title: "Interactive Lessons", desc: "Complete structured grammar & vocabulary modules." },
            { step: "3", title: "Practice Skills", desc: "Engage with flashcards, writing & reading tools." },
            { step: "4", title: "Speak with AI", desc: "Chat with the AI Tutor & evaluate pronunciation." },
            { step: "5", title: "Track Progress", desc: "Earn XP, unlock badges, and monitor your level." },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-extrabold mx-auto flex items-center justify-center">
                {item.step}
              </div>
              <h4 className="font-bold text-base">{item.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
