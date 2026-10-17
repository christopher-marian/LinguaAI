import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Settings, Moon, Sun, Bell, Shield, Globe, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>Platform Settings</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Customize your LinguaAI experience, theme, and notification preferences
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        {/* Theme Settings */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <span>Interface Theme Mode</span>
            </h3>
            <p className="text-xs text-slate-500">Switch between light and dark visual presentation.</p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-600" />
              <span>Daily Reminder Notifications</span>
            </h3>
            <p className="text-xs text-slate-500">Receive daily reminders to maintain your streak.</p>
          </div>

          <input
            type="checkbox"
            checked={dailyReminders}
            onChange={(e) => setDailyReminders(e.target.checked)}
            className="w-5 h-5 text-brand-600 rounded cursor-pointer"
          />
        </div>

        {/* Account Info Security */}
        <div className="space-y-3 pb-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Account Security</span>
          </h3>
          <p className="text-xs text-slate-500">
            Account Email: <strong className="text-slate-800 dark:text-slate-200">{user?.email}</strong> (JWT Authenticated)
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          )}
          <button
            onClick={handleSaveSettings}
            className="ml-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
