from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schema import User, Lesson
from app.auth.security import get_current_user
from app.services.learning_service import LearningService

router = APIRouter(prefix="/api/lessons", tags=["Lessons"])

@router.get("")
def get_lessons(level: Optional[str] = None, category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Lesson)
    if level:
        query = query.filter(Lesson.level == level)
    if category:
        query = query.filter(Lesson.category == category)
    return query.order_by(Lesson.order_index.asc()).all()

@router.get("/{lesson_id}")
def get_lesson_detail(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@router.post("/{lesson_id}/complete")
def complete_lesson(lesson_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    xp_result = LearningService.add_user_xp(current_user, lesson.xp_reward or 20, db)
    LearningService.update_skill_progress(current_user.id, lesson.category, 5.0, db)

    return {
        "message": f"Lesson '{lesson.title}' completed successfully!",
        "xp_gained": lesson.xp_reward or 20,
        "xp_summary": xp_result
    }
