from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Auth & User ---
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    native_language: str = "English"
    learning_language: str = "Spanish"
    level: str = "Beginner"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    native_language: str
    learning_language: str
    level: str
    points: int
    streak: int
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserUpdate(BaseModel):
    name: Optional[str] = None
    native_language: Optional[str] = None
    learning_language: Optional[str] = None
    level: Optional[str] = None

# --- Translation ---
class TranslationRequest(BaseModel):
    source_language: str
    target_language: str
    text: str

class TranslationResponse(BaseModel):
    source_language: str
    target_language: str
    source_text: str
    translated_text: str

# --- Grammar Check ---
class GrammarCheckRequest(BaseModel):
    text: str
    language: Optional[str] = "English"

class GrammarCheckResponse(BaseModel):
    original_text: str
    corrected_text: str
    explanation: str
    mistakes: List[str]
    suggested_improvements: List[str]

# --- AI Tutor ---
class TutorMessageRequest(BaseModel):
    message: str
    topic: Optional[str] = "Daily conversation"
    difficulty: Optional[str] = "Beginner"
    language: Optional[str] = "Spanish"
    history: Optional[List[dict]] = []

class TutorMessageResponse(BaseModel):
    reply: str
    corrections: Optional[str] = None
    cultural_tip: Optional[str] = None

# --- Writing Feedback ---
class WritingFeedbackRequest(BaseModel):
    prompt: str
    submission: str
    target_language: Optional[str] = "Spanish"

class WritingFeedbackResponse(BaseModel):
    overall_score: int # 0 to 100
    grammar_score: int
    vocabulary_score: int
    structure_score: int
    clarity_score: int
    feedback: str
    corrected_version: str

# --- Speaking Evaluation ---
class SpeakingEvalRequest(BaseModel):
    target_phrase: str
    spoken_phrase: str

class SpeakingEvalResponse(BaseModel):
    expected: str
    spoken: str
    accuracy_percentage: float
    feedback: str
    phonetic_tips: List[str]

# --- Quiz Submission ---
class QuizSubmitRequest(BaseModel):
    answers: dict # question_id -> user answer

class QuizSubmitResponse(BaseModel):
    score: float
    total_questions: int
    correct_count: int
    xp_earned: int
    explanations: dict
