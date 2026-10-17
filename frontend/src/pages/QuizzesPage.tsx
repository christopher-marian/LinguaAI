import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Quiz, Question } from '../types';
import { HelpCircle, CheckCircle, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';

export const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/quizzes');
      setQuizzes(res.data);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (id: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/quizzes/${id}`);
      setActiveQuiz(res.data);
      setAnswers({});
      setSubmissionResult(null);
    } catch (err) {
      console.error('Failed to start quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (qId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    try {
      const res = await api.post(`/api/quizzes/${activeQuiz.id}/submit`, { answers });
      setSubmissionResult(res.data);
    } catch (err) {
      console.error('Quiz submit failed:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <HelpCircle className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          <span>Interactive Quiz Center</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Test your vocabulary and grammar knowledge to earn XP and level up
        </p>
      </div>

      {!activeQuiz ? (
        /* Quiz List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((q) => (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                  {q.difficulty}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {q.question_count} Interactive Questions
                </p>
              </div>

              <button
                onClick={() => startQuiz(q.id)}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
              >
                <span>Start Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : submissionResult ? (
        /* Quiz Summary Screen */
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Quiz Completed!
          </h2>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <div className="text-xs text-slate-400 font-semibold">Score</div>
              <div className="text-xl font-extrabold text-brand-600">{submissionResult.score}%</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <div className="text-xs text-slate-400 font-semibold">Correct</div>
              <div className="text-xl font-extrabold text-emerald-600">{submissionResult.correct_count} / {submissionResult.total_questions}</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <div className="text-xs text-slate-400 font-semibold">XP Earned</div>
              <div className="text-xl font-extrabold text-amber-500">+{submissionResult.xp_earned} XP</div>
            </div>
          </div>

          {/* Detailed Explanations */}
          <div className="text-left space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase text-slate-400">Question Review & Explanations</h4>
            {Object.entries(submissionResult.explanations).map(([qId, exp]: any) => (
              <div key={qId} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  {exp.correct ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500" />
                  )}
                  <span>Correct Answer: {exp.correct_answer}</span>
                </div>
                <p className="text-slate-500 italic pl-6">{exp.explanation}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setActiveQuiz(null);
              setSubmissionResult(null);
            }}
            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md"
          >
            Back to Quizzes
          </button>
        </div>
      ) : (
        /* Active Quiz Question Flow */
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <h3 className="font-extrabold text-lg">{activeQuiz.title}</h3>
            <span className="text-xs font-bold text-brand-600 px-3 py-1 bg-brand-50 rounded-full">
              {Object.keys(answers).length} of {activeQuiz.questions.length} Answered
            </span>
          </div>

          <div className="space-y-6">
            {activeQuiz.questions.map((q: Question, idx: number) => (
              <div key={q.id} className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Q{idx + 1}. {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswerSelect(q.id, opt)}
                      className={`p-3 rounded-xl border text-xs text-left font-semibold transition-all ${
                        answers[q.id] === opt
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length < activeQuiz.questions.length}
              className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
