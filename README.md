# LinguaAI – AI-Powered Language Translation and Learning Platform

> **“Learn. Speak. Translate. Master.”**

LinguaAI is a comprehensive, production-grade full-stack web application designed to solve the problem of language learners having to juggle multiple disjointed applications for translation, vocabulary building, grammar correction, listening comprehension, pronunciation evaluation, speaking practice, and conversational tutoring.

Built as an advanced AI-powered educational platform, LinguaAI centralizes all core language-learning modalities into one cohesive, modern, and gamified experience with real-time feedback, analytics, and intelligent adaptive recommendations.

---

## 1. Project Description

Language acquisition requires simultaneous development across multiple core disciplines:
* **Translation**: Bridging understanding between native and target languages.
* **Vocabulary Acquisition**: Building word recall with spaced repetition (SRS).
* **Grammar Mastery**: Learning linguistic rules with instant AI explanations and error analysis.
* **Reading & Listening**: Engaging with natural passages and spoken dialogue.
* **Speaking & Pronunciation**: Practicing speech with phonetic accuracy scoring and voice feedback.
* **AI Conversational Tutoring**: Real-time interactive dialogue with adaptive AI guidance.
* **Gamification & Progress**: Maintaining daily streaks, earning XP points, leveling up, and unlocking achievements.

LinguaAI unifies these capabilities into an intuitive SaaS-inspired web application featuring a dual-mode AI engine (OpenAI API integration with an intelligent mock/fallback engine when no API key is supplied).

---

## 2. Key Features

- **AI Translation Module**: Bidirectional translation across 10 global languages (English, Tamil, Hindi, Telugu, Malayalam, Kannada, French, Spanish, German, Japanese) with swap, character counter, clipboard copy, and translation history.
- **AI Grammar Correction**: Contextual error detection, grammatical rationale, rule explanations, and fluency recommendations.
- **AI Conversational Tutor**: Real-time chat with simulated native speakers covering topics like travel, job interviews, college, and daily life, complete with conversational tips and corrections.
- **AI Writing Evaluation**: Assesses open-ended writing prompts across four quantitative metrics (Grammar, Vocabulary, Structure, Clarity) and provides a polished revision.
- **Interactive Speech Recognition & Pronunciation**: Browser Web Speech API integration that evaluates spoken phrases against phonetic references and provides accuracy percentages and pronunciation tips.
- **Listening Practice**: Native audio playback using Text-to-Speech with adjustable speeds (0.5x, 0.75x, 1.0x) paired with comprehension questions.
- **Spaced Repetition Flashcards**: Interactive 3D flip card system with SRS grading (`Again`, `Hard`, `Good`, `Easy`) and automatic mastery level adjustments.
- **Structured Lessons & Interactive Quizzes**: Topic-based lessons (Beginner to Advanced) with multiple-choice, fill-in-the-blank, and translation questions.
- **Comprehensive Analytics & Radar Charts**: Interactive visualizations built with Recharts displaying weekly study minutes, XP growth, and a 6-dimension skill radar chart (Vocabulary, Grammar, Reading, Writing, Listening, Speaking).
- **Gamification Engine**: Daily streaks, XP points system, level progression (Beginner, Elementary, Intermediate, Upper Intermediate, Advanced), and unlockable achievement badges.
- **Adaptive Recommendations**: Algorithm analyzes a learner's weakest skill scores and dynamically suggests targeted lessons.
- **Dark & Light Mode**: User preference toggling with persistent theme state.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT interceptors
- **Data Visualization**: Recharts (Bar Charts, Radar Charts)
- **Audio APIs**: Web Speech API (`SpeechSynthesis` & `webkitSpeechRecognition`)

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM & Database**: SQLAlchemy with SQLite (PostgreSQL migration ready)
- **Validation**: Pydantic v2
- **Authentication**: JWT (JSON Web Tokens) with `pyjwt` & `bcrypt` password hashing
- **Server**: Uvicorn ASGI server

### AI Layer
- **OpenAI Integration**: `openai` SDK (GPT-3.5-Turbo / GPT-4)
- **Smart Fallback Engine**: Rule-based grammatical engine and multi-language dictionary for demonstration without requiring an external API key.

---

## 4. Folder Structure

```
LinguaAI/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app initialization, CORS, lifespan seeding
│   │   ├── database.py          # SQLAlchemy engine, session maker, SQLite/PostgreSQL setup
│   │   ├── models/
│   │   │   └── schema.py        # SQLAlchemy database models
│   │   ├── schemas/
│   │   │   └── pydantic_models.py # Pydantic request & response schemas
│   │   ├── auth/
│   │   │   └── security.py      # JWT token creation, validation, bcrypt hashing
│   │   ├── services/
│   │   │   └── learning_service.py # Gamification, XP, level calculation & recommendations
│   │   ├── ai/
│   │   │   └── ai_service.py    # OpenAI service layer & smart offline fallback engine
│   │   └── routes/              # Modular REST API endpoints
│   │       ├── auth_routes.py
│   │       ├── user_routes.py
│   │       ├── translation_routes.py
│   │       ├── lesson_routes.py
│   │       ├── vocabulary_routes.py
│   │       ├── quiz_routes.py
│   │       ├── ai_routes.py
│   │       ├── practice_routes.py
│   │       ├── progress_routes.py
│   │       └── achievement_routes.py
│   ├── seed.py                  # Seed script with demo account, lessons, vocab & badges
│   ├── test_api.py              # Automated test suite covering 14 endpoint modules
│   ├── requirements.txt         # Python dependencies
│   └── Dockerfile               # Backend Docker container configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components (Navbar, Sidebar, AudioPlayer, Flashcard, StatCard)
│   │   ├── context/             # AuthContext (JWT management) & ThemeContext (Dark/Light)
│   │   ├── pages/               # 20 required application pages
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── TranslationPage.tsx
│   │   │   ├── LessonsPage.tsx
│   │   │   ├── LessonDetailsPage.tsx
│   │   │   ├── VocabularyPage.tsx
│   │   │   ├── FlashcardsPage.tsx
│   │   │   ├── GrammarPracticePage.tsx
│   │   │   ├── ReadingPracticePage.tsx
│   │   │   ├── WritingPracticePage.tsx
│   │   │   ├── ListeningPracticePage.tsx
│   │   │   ├── SpeakingPracticePage.tsx
│   │   │   ├── AITutorPage.tsx
│   │   │   ├── QuizzesPage.tsx
│   │   │   ├── ProgressPage.tsx
│   │   │   ├── AchievementsPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── services/            # Axios instance and API utilities
│   │   ├── types/               # TypeScript interfaces
│   │   ├── App.tsx              # Application route definitions
│   │   ├── main.tsx             # React DOM root & providers
│   │   └── index.css            # Tailwind directives and 3D card animations
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── Dockerfile               # Production multi-stage Nginx container
│
├── docker-compose.yml           # Multi-container orchestration
├── .env.example                 # Environment configuration template
└── README.md                    # Project documentation
```

---

## 5. Installation & Setup

### Prerequisites
- **Python**: Version 3.10 or higher
- **Node.js**: Version 18 or higher (with npm)
- **Git** (optional)

---

## 6. Environment Variables

Create a `.env` file in the project root or configure backend environment variables using `.env.example`:

```bash
# Security
SECRET_KEY=replace-with-a-secure-random-secret

# Database (defaults to SQLite: lingua_ai.db)
DATABASE_URL=sqlite:///./lingua_ai.db

# Optional: OpenAI API Key (leave blank to run in offline mock AI mode)
OPENAI_API_KEY=your-openai-api-key-here

# Frontend API Base URL
VITE_API_URL=http://127.0.0.1:8000
```

---

## 7. Backend Setup

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt email-validator
   ```
3. Initialize and seed the database with sample data:
   ```bash
   python seed.py
   ```
4. Run the automated test suite to verify all endpoints:
   ```bash
   python test_api.py
   ```
5. Start the backend server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend will be live at `http://127.0.0.1:8000`.
   Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

---

## 8. Frontend Setup

1. Open a terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify the production build:
   ```bash
   npm run build
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be live at `http://localhost:5173`.

---

## 9. Pre-configured Demo Account

To test all authenticated pages immediately without having to register a new user:
* **Email**: `demo@linguaai.com`
* **Password**: `password123`
* Alternatively, use the **"🚀 Instant Demo Login"** button on the Login page for 1-click access.

---

## 10. Running with Docker Compose

To run the entire full-stack application inside isolated containers:
```bash
docker-compose up --build
```
* **Frontend**: `http://localhost:3000`
* **Backend API**: `http://localhost:8000`

---

## 11. AI API Configuration

LinguaAI is engineered with a **dual-mode AI service layer**:
1. **Live AI Mode**: If `OPENAI_API_KEY` is present in your environment, LinguaAI delegates translation, grammar checking, writing evaluation, and AI tutor conversations directly to OpenAI's GPT models.
2. **Intelligent Fallback Mode**: If `OPENAI_API_KEY` is omitted or invalid, LinguaAI automatically utilizes built-in algorithmic linguistic analyzers and multi-language dictionaries so that all pages remain completely functional for viva evaluations, offline presentations, and automated testing.

---

## 12. REST API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `GET` | `/api/users/me` | Fetch authenticated user profile |
| `PUT` | `/api/users/me` | Update learning level and preferences |
| `GET` | `/api/users/dashboard` | Aggregated dashboard stats & recommendations |
| `POST` | `/api/translate` | Translate text across 10 languages |
| `GET` | `/api/translation/history` | User translation history |
| `GET` | `/api/lessons` | List lessons filtered by level/category |
| `GET` | `/api/lessons/{id}` | Lesson detail & content |
| `POST` | `/api/lessons/{id}/complete` | Mark lesson completed & award XP |
| `GET` | `/api/vocabulary` | Vocabulary library with mastery status |
| `POST` | `/api/vocabulary/{id}/review` | Record SRS flashcard rating (`Again`/`Good`/etc.) |
| `GET` | `/api/quizzes` | List interactive quizzes |
| `GET` | `/api/quizzes/{id}` | Quiz questions & choices |
| `POST` | `/api/quizzes/{id}/submit` | Grade quiz, record score, and award XP |
| `POST` | `/api/ai/grammar-check` | Check sentence grammar & get rule explanations |
| `POST` | `/api/ai/tutor` | Conversational language tutor endpoint |
| `POST` | `/api/ai/writing-feedback` | 4-dimension writing evaluation report |
| `POST` | `/api/speaking/evaluate` | Phonetic speech accuracy evaluation |
| `GET` | `/api/practice/listening` | Listening audio exercises & quizzes |
| `GET` | `/api/practice/reading` | Reading comprehension passages & quizzes |
| `GET` | `/api/progress` | Learning analytics, weekly study data, radar chart |
| `GET` | `/api/achievements` | Badges and unlock criteria |

---

## 13. Future Enhancements

1. **PostgreSQL Production Deployment**: Migrate database to managed PostgreSQL instance (e.g., Supabase or AWS RDS).
2. **Audio File Streaming**: Cloud storage integration (AWS S3) for human native speaker voice recordings.
3. **Multiplayer Leaderboards**: Global weekly XP leaderboards to compete with fellow language learners.
4. **Mobile Application**: Native mobile experience using React Native reusing the existing backend API.
5. **Speech Pitch Analysis**: Waveform visualizer comparing user intonation curves against native speaker phoneme curves.
