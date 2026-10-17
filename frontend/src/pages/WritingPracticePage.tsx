import React, { useState } from 'react';
import api from '../services/api';
import { PenTool, Sparkles, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const WritingPracticePage: React.FC = () => {
  const [prompt, setPrompt] = useState('Write 100 words about your daily routine and favorite hobbies in your target language.');
  const [submission, setSubmission] = useState('Por la mañana, me levanto a las siete. Tomo un café con leche y estudio español por treinta minutos...');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const wordCount = submission.trim().split(/\s+/).filter(Boolean).length;

  const handleEvaluate = async () => {
    if (!submission.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/api/ai/writing-feedback', {
        prompt,
        submission,
        target_language: 'Spanish'
      });
      setResult(res.data);
    } catch (err) {
      console.error('Writing evaluation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <PenTool className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>AI Writing Practice & Feedback</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Complete writing prompts and receive detailed AI evaluations across 4 fluency dimensions
        </p>
      </div>

      {/* Writing Prompt Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-brand-600 dark:text-brand-400">
          <Sparkles className="w-4 h-4" /> Writing Prompt:
        </div>
        <p className="text-base font-bold text-slate-900 dark:text-white">
          "{prompt}"
        </p>

        <textarea
          rows={6}
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          placeholder="Type your response here..."
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none text-sm leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-semibold text-slate-400">
            Word count: <strong className="text-brand-600">{wordCount}</strong> words
          </span>

          <button
            onClick={handleEvaluate}
            disabled={loading || wordCount < 5}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Evaluating with AI...' : 'Submit Writing (+15 XP)'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Evaluation Report */}
      {result && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>AI Writing Feedback Report</span>
            </h3>
            <span className="text-lg font-extrabold text-brand-600 bg-brand-50 dark:bg-brand-950 px-4 py-1 rounded-full">
              Overall: {result.overall_score}/100
            </span>
          </div>

          {/* Breakdown Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Grammar', score: result.grammar_score },
              { label: 'Vocabulary', score: result.vocabulary_score },
              { label: 'Structure', score: result.structure_score },
              { label: 'Clarity', score: result.clarity_score },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-400 font-bold">{s.label}</div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{s.score}%</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/40 space-y-2">
            <h4 className="text-xs font-bold uppercase text-brand-700 dark:text-brand-300">Detailed Feedback</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {result.feedback}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <h4 className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Polished & Corrected Version:
            </h4>
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200 leading-relaxed">
              {result.corrected_version}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
