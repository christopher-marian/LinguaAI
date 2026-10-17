from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    native_language = Column(String(50), default="English")
    learning_language = Column(String(50), default="Spanish")
    level = Column(String(50), default="Beginner")
    points = Column(Integer, default=0)
    streak = Column(Integer, default=1)
    last_active_date = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    vocabularies = relationship("UserVocabulary", back_populates="user", cascade="all, delete-orphan")
    quiz_results = relationship("QuizResult", back_populates="user", cascade="all, delete-orphan")
    translation_history = relationship("TranslationHistory", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    level = Column(String(50), nullable=False)  # Beginner, Elementary, Intermediate, Upper Intermediate, Advanced
    language = Column(String(50), nullable=False)
    category = Column(String(50), nullable=False) # Vocabulary, Grammar, Listening, Speaking, Reading, Writing, Pronunciation
    content = Column(Text, nullable=False) # JSON or markdown content
    estimated_time = Column(Integer, default=10) # in minutes
    xp_reward = Column(Integer, default=20)
    order_index = Column(Integer, default=1)

    quizzes = relationship("Quiz", back_populates="lesson", cascade="all, delete-orphan")


class Vocabulary(Base):
    __tablename__ = "vocabularies"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(100), nullable=False)
    translation = Column(String(100), nullable=False)
    example = Column(Text, nullable=True)
    language = Column(String(50), nullable=False)
    category = Column(String(50), nullable=False) # Daily Life, Travel, Education, Technology, Food, Work, Communication
    difficulty = Column(String(50), default="Beginner")

    user_records = relationship("UserVocabulary", back_populates="vocabulary", cascade="all, delete-orphan")


class UserVocabulary(Base):
    __tablename__ = "user_vocabularies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vocabulary_id = Column(Integer, ForeignKey("vocabularies.id"), nullable=False)
    mastery_level = Column(Integer, default=0) # 0 to 100
    review_count = Column(Integer, default=0)
    last_reviewed = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="vocabularies")
    vocabulary = relationship("Vocabulary", back_populates="user_records")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    difficulty = Column(String(50), default="Beginner")

    lesson = relationship("Lesson", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    results = relationship("QuizResult", back_populates="quiz", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question = Column(Text, nullable=False)
    options = Column(Text, nullable=False) # JSON list of options
    correct_answer = Column(String(255), nullable=False)
    explanation = Column(Text, nullable=True)

    quiz = relationship("Quiz", back_populates="questions")


class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    score = Column(Float, nullable=False) # percentage 0 to 100
    total_questions = Column(Integer, default=5)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="quiz_results")
    quiz = relationship("Quiz", back_populates="results")


class TranslationHistory(Base):
    __tablename__ = "translation_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    source_language = Column(String(50), nullable=False)
    target_language = Column(String(50), nullable=False)
    source_text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="translation_history")


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill = Column(String(50), nullable=False) # Vocabulary, Grammar, Reading, Writing, Listening, Speaking, Pronunciation
    progress_percentage = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="progress_records")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), nullable=False) # Lucide icon name
    requirement = Column(String(100), nullable=False)

    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
