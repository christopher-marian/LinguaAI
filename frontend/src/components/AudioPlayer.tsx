import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { getLanguageLocale } from '../utils/languages';

interface AudioPlayerProps {
  text: string;
  lang?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, lang = 'en-US' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState<number>(1.0);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Browser speech synthesis is not supported in this environment.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageLocale(lang);
    utterance.rate = rate;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const replay = () => {
    speak();
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
      <button
        onClick={isPlaying ? pause : speak}
        className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
        title={isPlaying ? "Pause" : "Play Audio"}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
      </button>

      <button
        onClick={replay}
        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
        title="Replay"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1.5 ml-auto">
        <Volume2 className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 mr-1">Speed:</span>
        {[1.0, 0.75, 0.5].map((speed) => (
          <button
            key={speed}
            onClick={() => setRate(speed)}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
              rate === speed
                ? 'bg-brand-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
};
