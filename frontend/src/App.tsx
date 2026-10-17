import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { DashboardPage } from './pages/DashboardPage';
import { TranslationPage } from './pages/TranslationPage';
import { LessonsPage } from './pages/LessonsPage';
import { LessonDetailsPage } from './pages/LessonDetailsPage';
import { VocabularyPage } from './pages/VocabularyPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { GrammarPracticePage } from './pages/GrammarPracticePage';
import { ReadingPracticePage } from './pages/ReadingPracticePage';
import { WritingPracticePage } from './pages/WritingPracticePage';
import { ListeningPracticePage } from './pages/ListeningPracticePage';
import { SpeakingPracticePage } from './pages/SpeakingPracticePage';
import { AITutorPage } from './pages/AITutorPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { ProgressPage } from './pages/ProgressPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/translation" element={<TranslationPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessons/:id" element={<LessonDetailsPage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/grammar" element={<GrammarPracticePage />} />
          <Route path="/reading" element={<ReadingPracticePage />} />
          <Route path="/writing" element={<WritingPracticePage />} />
          <Route path="/listening" element={<ListeningPracticePage />} />
          <Route path="/speaking" element={<SpeakingPracticePage />} />
          <Route path="/tutor" element={<AITutorPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};
