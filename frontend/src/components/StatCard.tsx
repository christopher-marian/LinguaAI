import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'brand'
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.01]">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
