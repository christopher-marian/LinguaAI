from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schema import User, TranslationHistory
from app.schemas.pydantic_models import TranslationRequest, TranslationResponse
from app.auth.security import get_current_user
from app.ai.ai_service import AIService
from app.services.learning_service import LearningService

router = APIRouter(prefix="/api", tags=["Translation"])

@router.post("/translate", response_model=TranslationResponse)
def translate_text(req: TranslationRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    translated = AIService.translate_text(req.source_language, req.target_language, req.text)

    # Save to translation history
    history_entry = TranslationHistory(
        user_id=current_user.id,
        source_language=req.source_language,
        target_language=req.target_language,
        source_text=req.text,
        translated_text=translated
    )
    db.add(history_entry)

    # Award XP for translation practice (+5 XP)
    LearningService.add_user_xp(current_user, 5, db)

    return {
        "source_language": req.source_language,
        "target_language": req.target_language,
        "source_text": req.text,
        "translated_text": translated
    }

@router.get("/translation/history")
def get_translation_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    history = db.query(TranslationHistory).filter(
        TranslationHistory.user_id == current_user.id
    ).order_by(TranslationHistory.created_at.desc()).limit(20).all()

    return history
