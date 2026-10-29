import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AudioPlayer } from '../components/AudioPlayer';
import { Headphones, CheckCircle, HelpCircle, Award } from 'lucide-react';

export const ListeningPracticePage: React.FC = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedEx, setSelectedEx] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListening = async () => {
      try {
        const res = await api.get('/api/practice/listening');
        setExercises(res.data);
        if (res.data.length > 0) setSelectedEx(res.data[0]);
      } catch (err) {
        console.error('Failed to load listening exercises:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListening();
  }, []);

  const handleSelectAnswer = (qId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = () => {
    if (!selectedEx) return;
    let correct = 0;
    selectedEx.questions.forEach((q: any) => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });
    setScore((correct / selectedEx.questions.length) * 100);
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Headphones className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>Listening Practice Module</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Listen to native dialogue playback with speed controls and test comprehension
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Exercise list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400">Audio Scenarios</h3>
            {exercises.map((ex) => (
              <button
                key={ex.id}
                onClick={() => {
                  setSelectedEx(ex);
                  setAnswers({});
                  setSubmitted(false);
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  selectedEx?.id === ex.id
                    ? 'bg-brand-50 border-brand-500 dark:bg-brand-950/60 font-bold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-xs text-brand-600 font-semibold mb-1">{ex.level}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{ex.title}</div>
              </button>
            ))}
          </div>

          {/* Active Audio Exercise */}
          <div className="md:col-span-2 space-y-6">
            {selectedEx && (
              <>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {selectedEx.title}
                    </h3>
                    <span className="text-xs font-bold text-brand-600 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950">
                      {selectedEx.level}
                    </span>
                  </div>

                  {/* Speech Player */}
                  <AudioPlayer text={selectedEx.target_sentence} lang={selectedEx.language || user?.learning_language || 'es-ES'} />
                </div>

                {/* Comprehension Quiz */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                  <h4 className="text-base font-bold flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-brand-600" />
                    <span>Listening Questions</span>
                  </h4>

                  {selectedEx.questions.map((q: any) => (
                    <div key={q.id} className="space-y-3 pt-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string) => (
                          <button
                            key={opt}
                            onClick={() => handleSelectAnswer(q.id, opt)}
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
                    {submitted ? (
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <CheckCircle className="w-5 h-5" />
                        <span>Score: {score}% (+15 XP)</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Select answers and submit</span>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={Object.keys(answers).length < selectedEx.questions.length}
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
