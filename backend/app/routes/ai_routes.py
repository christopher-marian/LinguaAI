from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schema import User
from app.schemas.pydantic_models import (
    GrammarCheckRequest, GrammarCheckResponse,
    TutorMessageRequest, TutorMessageResponse,
    WritingFeedbackRequest, WritingFeedbackResponse
)
from app.auth.security import get_current_user
from app.ai.ai_service import AIService
from app.services.learning_service import LearningService

router = APIRouter(prefix="/api/ai", tags=["AI Features"])

@router.post("/grammar-check", response_model=GrammarCheckResponse)
def grammar_check(req: GrammarCheckRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = AIService.check_grammar(req.text, req.language or "English")
    LearningService.add_user_xp(current_user, 5, db)
    LearningService.update_skill_progress(current_user.id, "Grammar", 3.0, db)
    return result

@router.post("/tutor", response_model=TutorMessageResponse)
def ai_tutor(req: TutorMessageRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reply_data = AIService.get_tutor_reply(
        message=req.message,
        topic=req.topic or "Daily conversation",
        difficulty=req.difficulty or "Beginner",
        language=req.language or "Spanish",
        history=req.history or []
    )
    LearningService.add_user_xp(current_user, 10, db)
    LearningService.update_skill_progress(current_user.id, "Speaking", 3.0, db)
    return reply_data

@router.post("/writing-feedback", response_model=WritingFeedbackResponse)
def writing_feedback(req: WritingFeedbackRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    feedback_data = AIService.evaluate_writing(
        prompt=req.prompt,
        submission=req.submission,
        target_language=req.target_language or "Spanish"
    )
    LearningService.add_user_xp(current_user, 15, db)
    LearningService.update_skill_progress(current_user.id, "Writing", 5.0, db)
    return feedback_data
