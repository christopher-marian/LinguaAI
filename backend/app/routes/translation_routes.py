from fastapi import APIRouter, Depends, HTTPException, status
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
    if not req.text or not req.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text to translate cannot be empty."
        )

    try:
        translated = AIService.translate_text(req.source_language, req.target_language, req.text)
    except HTTPException:
        raise
    except Exception as e:
        print(f"[Translation Route Error] {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Translation failed: Could not translate from {req.source_language} to {req.target_language}. Service temporarily unavailable."
        )

    if not translated or not translated.strip():
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Translation provider returned an empty response. Please try again."
        )

    # Save to translation history ONLY upon genuine successful translation
    try:
        history_entry = TranslationHistory(
            user_id=current_user.id,
            source_language=req.source_language,
            target_language=req.target_language,
            source_text=req.text.strip(),
            translated_text=translated
        )
        db.add(history_entry)
        db.commit()

        # Award XP for translation practice (+5 XP)
        LearningService.add_user_xp(current_user, 5, db)
    except Exception as e:
        print(f"[Translation History/XP Warning] {e}")
        db.rollback()

    return {
        "source_language": req.source_language,
        "target_language": req.target_language,
        "source_text": req.text.strip(),
        "translated_text": translated
    }

@router.get("/translation/history")
def get_translation_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    history = db.query(TranslationHistory).filter(
        TranslationHistory.user_id == current_user.id
    ).order_by(TranslationHistory.created_at.desc()).limit(20).all()

    return history
