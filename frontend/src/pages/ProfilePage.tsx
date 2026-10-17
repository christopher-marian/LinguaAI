import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User as UserIcon, Mail, Globe, Award, Flame, Save, Check } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [nativeLanguage, setNativeLanguage] = useState(user?.native_language || 'English');
  const [learningLanguage, setLearningLanguage] = useState(user?.learning_language || 'Spanish');
  const [level, setLevel] = useState(user?.level || 'Beginner');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/api/users/me', {
        name,
        native_language: nativeLanguage,
        learning_language: learningLanguage,
        level
      });
      updateUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <UserIcon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>User Profile</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your account information, language preferences, and view stats
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold">Total XP</div>
            <div className="text-lg font-extrabold text-brand-600">{user?.points} XP</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold">Streak</div>
            <div className="text-lg font-extrabold text-amber-500">🔥 {user?.streak} Days</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold">Level</div>
            <div className="text-lg font-extrabold text-emerald-600">{user?.level}</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Native Language</label>
              <select
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
              >
                {['English', 'Hindi', 'Tamil', 'Telugu', 'French', 'Spanish', 'German', 'Japanese'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Learning Target</label>
              <select
                value={learningLanguage}
                onChange={(e) => setLearningLanguage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
              >
                {['Spanish', 'French', 'German', 'Japanese', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'English'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Learning Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
            >
              {['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'].map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {saved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile updated successfully!
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
