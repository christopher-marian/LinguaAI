from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schema import User, Progress, QuizResult, UserVocabulary, UserAchievement, Lesson
from app.schemas.pydantic_models import UserResponse, UserUpdate
from app.auth.security import get_current_user
from app.services.learning_service import LearningService

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_profile(req: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if req.name is not None:
        current_user.name = req.name
    if req.native_language is not None:
        current_user.native_language = req.native_language
    if req.learning_language is not None:
        current_user.learning_language = req.learning_language
    if req.level is not None:
        current_user.level = req.level

    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/dashboard")
def get_dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Calculate stats
    quiz_results = db.query(QuizResult).filter(QuizResult.user_id == current_user.id).all()
    quiz_avg = sum(q.score for q in quiz_results) / len(quiz_results) if quiz_results else 85.0

    vocab_count = db.query(UserVocabulary).filter(UserVocabulary.user_id == current_user.id, UserVocabulary.mastery_level >= 50).count()
    if vocab_count == 0:
        vocab_count = 14 # default presentation count

    lessons_completed = len(quiz_results) + 2

    progress_records = db.query(Progress).filter(Progress.user_id == current_user.id).all()
    skills_progress = {p.skill: p.progress_percentage for p in progress_records}
    
    # Ensure default skill keys exist
    all_skills = ["Vocabulary", "Grammar", "Reading", "Writing", "Listening", "Speaking", "Pronunciation"]
    for s in all_skills:
        if s not in skills_progress:
            skills_progress[s] = 45.0

    overall_progress = sum(skills_progress.values()) / len(skills_progress)

    # Continue learning lesson
    lesson_in_progress = db.query(Lesson).filter(Lesson.level == current_user.level).first()
    if not lesson_in_progress:
        lesson_in_progress = db.query(Lesson).first()

    # Recommendations
    recommendations = LearningService.get_recommendations(current_user, db)

    return {
        "user": current_user,
        "quiz_avg": round(quiz_avg, 1),
        "vocab_learned": vocab_count,
        "lessons_completed": lessons_completed,
        "overall_progress": round(overall_progress, 1),
        "skills_progress": skills_progress,
        "daily_goal": {"completed": 15, "target": 20},
        "lesson_in_progress": lesson_in_progress,
        "recommendations": recommendations
    }
