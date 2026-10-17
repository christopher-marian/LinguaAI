from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schema import User, Vocabulary, UserVocabulary
from app.auth.security import get_current_user
from app.services.learning_service import LearningService

router = APIRouter(prefix="/api/vocabulary", tags=["Vocabulary"])

@router.get("")
def get_vocabulary(category: Optional[str] = None, difficulty: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Vocabulary)
    if category and category != "All":
        query = query.filter(Vocabulary.category == category)
    if difficulty and difficulty != "All":
        query = query.filter(Vocabulary.difficulty == difficulty)
    if search:
        query = query.filter(Vocabulary.word.ilike(f"%{search}%") | Vocabulary.translation.ilike(f"%{search}%"))

    words = query.all()

    # Get user mastery levels map
    user_vocab_records = db.query(UserVocabulary).filter(UserVocabulary.user_id == current_user.id).all()
    mastery_map = {uv.vocabulary_id: uv.mastery_level for uv in user_vocab_records}

    result = []
    for w in words:
        result.append({
            "id": w.id,
            "word": w.word,
            "translation": w.translation,
            "example": w.example,
            "language": w.language,
            "category": w.category,
            "difficulty": w.difficulty,
            "mastery_level": mastery_map.get(w.id, 0)
        })

    return result

@router.post("/{vocab_id}/review")
def review_vocabulary(vocab_id: int, rating: str = Body(..., embed=True), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # rating in ["Again", "Hard", "Good", "Easy"]
    vocab = db.query(Vocabulary).filter(Vocabulary.id == vocab_id).first()
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary item not found")

    user_vocab = db.query(UserVocabulary).filter(
        UserVocabulary.user_id == current_user.id,
        UserVocabulary.vocabulary_id == vocab_id
    ).first()

    if not user_vocab:
        user_vocab = UserVocabulary(user_id=current_user.id, vocabulary_id=vocab_id, mastery_level=20, review_count=1)
        db.add(user_vocab)

    rating_delta = {
        "Again": -15,
        "Hard": 5,
        "Good": 15,
        "Easy": 30
    }.get(rating, 10)

    user_vocab.mastery_level = max(0, min(100, user_vocab.mastery_level + rating_delta))
    user_vocab.review_count += 1
    db.commit()

    # Award XP (+5 XP)
    xp_result = LearningService.add_user_xp(current_user, 5, db)
    LearningService.update_skill_progress(current_user.id, "Vocabulary", 2.0, db)

    return {
        "vocabulary_id": vocab_id,
        "new_mastery_level": user_vocab.mastery_level,
        "xp_summary": xp_result
    }
