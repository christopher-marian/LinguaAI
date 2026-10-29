from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Body, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schema import User, Vocabulary, UserVocabulary
from app.auth.security import get_current_user
from app.services.learning_service import LearningService
from app.ai.ai_service import AIService
from app.ai.languages import normalize_language_name

router = APIRouter(prefix="/api/vocabulary", tags=["Vocabulary"])

class GenerateVocabRequest(BaseModel):
    topic: str = "Daily Life"
    language: str = "Spanish"
    count: Optional[int] = 5

@router.get("")
def get_vocabulary(
    language: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Vocabulary)

    # 1. Filter by language
    target_language = language
    if target_language == "My Language":
        target_language = current_user.learning_language or "Spanish"

    if target_language and target_language != "All":
        query = query.filter(Vocabulary.language.ilike(f"%{target_language}%"))

    # 2. Filter by category
    if category and category != "All":
        query = query.filter(Vocabulary.category.ilike(f"%{category}%"))

    # 3. Filter by difficulty
    if difficulty and difficulty != "All":
        query = query.filter(Vocabulary.difficulty.ilike(f"%{difficulty}%"))

    # 4. Filter by search query
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(Vocabulary.word.ilike(term) | Vocabulary.translation.ilike(term))

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
def review_vocabulary(
    vocab_id: int,
    rating: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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

@router.post("/ai-generate")
def generate_ai_vocabulary(
    req: GenerateVocabRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generates authentic vocabulary for any topic and language using the translation engine."""
    canonical_lang = normalize_language_name(req.language)
    
    # Base English words by category
    category_bases = {
        "Daily Life": [
            ("Good morning", "Greeting used at start of day", "Beginner"),
            ("Water", "Essential drink for life", "Beginner"),
            ("Family", "Parents and siblings", "Beginner"),
            ("House", "Place where someone lives", "Beginner"),
            ("Friend", "Close companion", "Beginner")
        ],
        "Travel": [
            ("Airport", "Where airplanes land and depart", "Elementary"),
            ("Train station", "Where trains stop for passengers", "Beginner"),
            ("Ticket", "Document giving access to transit", "Beginner"),
            ("Hotel", "Lodging for travelers", "Beginner"),
            ("Luggage", "Bags and suitcases for travel", "Elementary")
        ],
        "Food": [
            ("Bread", "Baked food made from flour", "Beginner"),
            ("Restaurant", "Place where meals are prepared and served", "Beginner"),
            ("Vegetable", "Plant used as food", "Beginner"),
            ("Delicious", "Pleasant and delightful taste", "Elementary"),
            ("Coffee", "Hot brewed beverage", "Beginner")
        ],
        "Technology": [
            ("Computer", "Electronic device for processing data", "Intermediate"),
            ("Internet", "Global computer network", "Beginner"),
            ("Mobile phone", "Portable telephone", "Beginner"),
            ("Password", "Secret word for security access", "Elementary"),
            ("Screen", "Display surface for images", "Beginner")
        ]
    }

    base_list = category_bases.get(req.topic, category_bases["Daily Life"])[:req.count or 5]
    created_items = []

    for eng_word, example_context, diff in base_list:
        # Translate to target language
        foreign_word = AIService.translate_text("English", canonical_lang, eng_word)
        example_sentence = AIService.translate_text("English", canonical_lang, f"This is an example with {eng_word.lower()}.")
        
        # Check if already exists in DB
        existing = db.query(Vocabulary).filter(
            Vocabulary.word == foreign_word,
            Vocabulary.language == canonical_lang
        ).first()

        if not existing:
            voc = Vocabulary(
                word=foreign_word,
                translation=eng_word,
                example=example_sentence,
                language=canonical_lang,
                category=req.topic,
                difficulty=diff
            )
            db.add(voc)
            db.commit()
            db.refresh(voc)
            created_items.append(voc)
        else:
            created_items.append(existing)

    return [
        {
            "id": v.id,
            "word": v.word,
            "translation": v.translation,
            "example": v.example,
            "language": v.language,
            "category": v.category,
            "difficulty": v.difficulty,
            "mastery_level": 0
        }
        for v in created_items
    ]
