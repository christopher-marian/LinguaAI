from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from difflib import SequenceMatcher
from app.database import get_db
from app.models.schema import User
from app.schemas.pydantic_models import SpeakingEvalRequest, SpeakingEvalResponse
from app.auth.security import get_current_user
from app.services.learning_service import LearningService

router = APIRouter(prefix="/api", tags=["Practice Modules"])

@router.post("/speaking/evaluate", response_model=SpeakingEvalResponse)
def evaluate_speaking(req: SpeakingEvalRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expected_clean = req.target_phrase.strip().lower()
    spoken_clean = req.spoken_phrase.strip().lower()

    matcher = SequenceMatcher(None, expected_clean, spoken_clean)
    ratio = matcher.ratio() * 100.0

    if ratio >= 85:
        feedback = "Excellent pronunciation and intonation!"
        tips = ["Keep practicing at this standard rate of speech.", "Try adding emotional inflection."]
    elif ratio >= 60:
        feedback = "Good attempt! Enunciate clear vowel sounds in the middle words."
        tips = ["Pace your syllables slightly slower.", "Focus on stress placement."]
    else:
        feedback = "Listen carefully to the native audio reference and try repeating phrase by phrase."
        tips = ["Break down the sentence into two shorter chunks.", "Watch your vocal projection."]

    # Award XP (+15 XP)
    LearningService.add_user_xp(current_user, 15, db)
    LearningService.update_skill_progress(current_user.id, "Speaking", 4.0, db)
    LearningService.update_skill_progress(current_user.id, "Pronunciation", 4.0, db)

    return {
        "expected": req.target_phrase,
        "spoken": req.spoken_phrase,
        "accuracy_percentage": round(ratio, 1),
        "feedback": feedback,
        "phonetic_tips": tips
    }

@router.get("/practice/listening")
def get_listening_exercises():
    return [
        {
            "id": 1,
            "title": "Ordering Coffee at a Cafe",
            "level": "Beginner",
            "target_sentence": "Me gustaría un café con leche y un croissant, por favor.",
            "translation": "I would like a coffee with milk and a croissant, please.",
            "questions": [
                {
                    "id": 101,
                    "question": "What beverage did the speaker order?",
                    "options": ["Coffee with milk", "Black tea", "Fresh orange juice", "Hot chocolate"],
                    "correct_answer": "Coffee with milk"
                },
                {
                    "id": 102,
                    "question": "What food item was requested?",
                    "options": ["Muffin", "Croissant", "Sandwich", "Bagel"],
                    "correct_answer": "Croissant"
                }
            ]
        },
        {
            "id": 2,
            "title": "Asking for Directions",
            "level": "Intermediate",
            "target_sentence": "¿Dónde está la estación de tren más cercana?",
            "translation": "Where is the nearest train station?",
            "questions": [
                {
                    "id": 201,
                    "question": "What place is the traveler trying to locate?",
                    "options": ["Train station", "Airport", "Hotel", "Museum"],
                    "correct_answer": "Train station"
                }
            ]
        }
    ]

@router.get("/practice/reading")
def get_reading_passages():
    return [
        {
            "id": 1,
            "title": "A Day in Madrid",
            "level": "Beginner",
            "content": """Madrid es la capital y la ciudad más grande de España. Por las mañanas, a la gente le gusta caminar por el Parque del Retiro. Cerca del parque está el famoso Museo del Prado, donde se pueden ver pinturas increíbles. A la hora del almuerzo, las familias se reúnen para disfrutar de tapas y paella en restaurantes tradicionales.""",
            "translation": "Madrid is the capital and largest city of Spain. In the mornings, people like to walk in Retiro Park...",
            "questions": [
                {
                    "id": 1,
                    "question": "What is Madrid?",
                    "options": ["Capital of Spain", "A small coastal town", "A island in the Mediterranean", "A region in Portugal"],
                    "correct_answer": "Capital of Spain"
                },
                {
                    "id": 2,
                    "question": "Where do people like to walk in the morning?",
                    "options": ["Retiro Park", "Barceloneta Beach", "Gran Via Mall", "Royal Palace"],
                    "correct_answer": "Retiro Park"
                }
            ]
        },
        {
            "id": 2,
            "title": "The Wonders of Technology",
            "level": "Intermediate",
            "content": """La inteligencia artificial está transformando la educación moderna. Los estudiantes ahora pueden aprender idiomas con tutores virtuales que responden instantáneamente y corrigen la pronunciación en tiempo real. Esta tecnología permite un aprendizaje adaptativo y personalizado.""",
            "translation": "Artificial intelligence is transforming modern education. Students can now learn languages with virtual tutors...",
            "questions": [
                {
                    "id": 1,
                    "question": "How is AI transforming education according to the passage?",
                    "options": ["Through virtual tutors & real-time feedback", "By eliminating all exams", "By replacing human teachers completely", "By locking course materials"],
                    "correct_answer": "Through virtual tutors & real-time feedback"
                }
            ]
        }
    ]
