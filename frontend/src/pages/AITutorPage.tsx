import React, { useState } from 'react';
import api from '../services/api';
import { Bot, Send, User, Sparkles, Lightbulb } from 'lucide-react';

const TOPICS = ['Daily conversation', 'Travel', 'Job interview', 'College', 'Food', 'Shopping', 'Technology'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const LANGUAGES = ['Spanish', 'French', 'German', 'Japanese', 'Hindi', 'Tamil', 'Telugu'];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  corrections?: string;
  cultural_tip?: string;
}

export const AITutorPage: React.FC = () => {
  const [topic, setTopic] = useState('Daily conversation');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [language, setLanguage] = useState('Spanish');
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `¡Hola! Soy tu tutor de IA. Estoy encantado de conversar contigo sobre ${topic}. ¿De qué te gustaría hablar hoy?`,
      cultural_tip: 'Greeting enthusiastically is common in conversational practice.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMsg = inputMsg;
    setInputMsg('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);

    setLoading(true);
    try {
      const res = await api.post('/api/ai/tutor', {
        message: userMsg,
        topic,
        difficulty,
        language,
        history: newMessages.map(m => ({ role: m.role, content: m.content }))
      });

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: res.data.reply,
          corrections: res.data.corrections,
          cultural_tip: res.data.cultural_tip
        }
      ]);
    } catch (err) {
      console.error('Tutor error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Header & Settings Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base">Conversational AI Tutor</h1>
            <p className="text-xs text-slate-500">Interactive live conversation in {language}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto text-xs font-semibold">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Log Window */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-2xl ${
              m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === 'user'
                  ? 'bg-slate-900 text-white dark:bg-slate-700'
                  : 'bg-brand-600 text-white'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-2">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                {m.content}
              </div>

              {/* Extra Tutor Hints */}
              {m.role === 'assistant' && (m.corrections || m.cultural_tip) && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  {m.corrections && (
                    <div className="flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{m.corrections}</span>
                    </div>
                  )}
                  {m.cultural_tip && (
                    <div className="flex items-start gap-1.5 font-medium">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>Tip: {m.cultural_tip}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold p-2">
            <Bot className="w-4 h-4 animate-bounce text-brand-600" />
            <span>AI Tutor is typing a reply...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex items-center gap-3">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={`Type message in ${language}...`}
          className="flex-1 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading || !inputMsg.trim()}
          className="p-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
