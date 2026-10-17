export interface User {
  id: number;
  name: string;
  email: string;
  native_language: string;
  learning_language: string;
  level: string;
  points: number;
  streak: number;
  created_at: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  level: string;
  language: string;
  category: string;
  content: string;
  estimated_time: number;
  xp_reward: number;
  order_index: number;
}

export interface VocabularyItem {
  id: number;
  word: string;
  translation: string;
  example: string;
  language: string;
  category: string;
  difficulty: string;
  mastery_level: number;
}

export interface Quiz {
  id: number;
  title: string;
  difficulty: string;
  question_count: number;
  lesson_id?: number;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  explanation?: string;
}

export interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
  earned_at?: string;
}

export interface TranslationHistoryItem {
  id: number;
  source_language: string;
  target_language: string;
  source_text: string;
  translated_text: string;
  created_at: string;
}
