import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BookMarked, CheckCircle, HelpCircle, Award } from 'lucide-react';

export const ReadingPracticePage: React.FC = () => {
  const [passages, setPassages] = useState<any[]>([]);
  const [selectedPassage, setSelectedPassage] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPassages = async () => {
      try {
        const res = await api.get('/api/practice/reading');
        setPassages(res.data);
        if (res.data.length > 0) setSelectedPassage(res.data[0]);
      } catch (err) {
        console.error('Failed to load reading passages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPassages();
  }, []);

  const handleOptionSelect = (qId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmitComprehension = () => {
    if (!selectedPassage) return;
    let correct = 0;
    selectedPassage.questions.forEach((q: any) => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });
    const finalScore = (correct / selectedPassage.questions.length) * 100;
    setScore(finalScore);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <BookMarked className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>Reading Comprehension Practice</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Read authentic passages and answer comprehension questions to build reading fluency
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Passage Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400">Passages</h3>
            {passages.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPassage(p);
                  setAnswers({});
                  setScore(null);
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  selectedPassage?.id === p.id
                    ? 'bg-brand-50 border-brand-500 dark:bg-brand-950/60 font-bold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-xs text-brand-600 font-semibold mb-1">{p.level}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</div>
              </button>
            ))}
          </div>

          {/* Reading & Questions Area */}
          <div className="md:col-span-2 space-y-6">
            {selectedPassage && (
              <>
                {/* Passage card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {selectedPassage.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {selectedPassage.content}
                  </p>
                </div>

                {/* Questions */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                  <h4 className="text-base font-bold flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-brand-600" />
                    <span>Comprehension Questions</span>
                  </h4>

                  {selectedPassage.questions.map((q: any) => (
                    <div key={q.id} className="space-y-3 pt-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string) => (
                          <button
                            key={opt}
                            onClick={() => handleOptionSelect(q.id, opt)}
                            className={`p-3 rounded-xl border text-xs text-left transition-all font-semibold ${
                              answers[q.id] === opt
                                ? 'bg-brand-600 text-white border-brand-600'
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    {score !== null ? (
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <CheckCircle className="w-5 h-5" />
                        <span>Score: {score}% (+15 XP Earned)</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Answer all questions to submit</span>
                    )}

                    <button
                      onClick={handleSubmitComprehension}
                      disabled={Object.keys(answers).length < selectedPassage.questions.length}
                      className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50"
                    >
                      Submit Answers
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
