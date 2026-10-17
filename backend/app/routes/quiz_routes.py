import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schema import User, Quiz, Question, QuizResult
from app.schemas.pydantic_models import QuizSubmitRequest, QuizSubmitResponse
from app.auth.security import get_current_user
from app.services.learning_service import LearningService

router = APIRouter(prefix="/api/quizzes", tags=["Quizzes"])

@router.get("")
def get_quizzes(db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).all()
    result = []
    for q in quizzes:
        question_count = db.query(Question).filter(Question.quiz_id == q.id).count()
        result.append({
            "id": q.id,
            "title": q.title,
            "difficulty": q.difficulty,
            "question_count": question_count,
            "lesson_id": q.lesson_id
        })
    return result

@router.get("/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    parsed_questions = []
    for q in questions:
        parsed_questions.append({
            "id": q.id,
            "question": q.question,
            "options": json.loads(q.options) if isinstance(q.options, str) else q.options,
            "explanation": q.explanation
        })

    return {
        "id": quiz.id,
        "title": quiz.title,
        "difficulty": quiz.difficulty,
        "questions": parsed_questions
    }

@router.post("/{quiz_id}/submit", response_model=QuizSubmitResponse)
def submit_quiz(quiz_id: int, req: QuizSubmitRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    if not questions:
        raise HTTPException(status_code=400, detail="Quiz has no questions")

    correct_count = 0
    explanations = {}

    for q in questions:
        user_ans = str(req.answers.get(str(q.id), "")).strip().lower()
        correct_ans = str(q.correct_answer).strip().lower()
        
        is_correct = (user_ans == correct_ans)
        if is_correct:
            correct_count += 1
            
        explanations[q.id] = {
            "correct": is_correct,
            "correct_answer": q.correct_answer,
            "user_answer": req.answers.get(str(q.id), ""),
            "explanation": q.explanation or "Good job!"
        }

    total = len(questions)
    score_pct = (correct_count / total) * 100.0
    xp_earned = 30 if score_pct >= 60 else 10

    # Record result
    res = QuizResult(
        user_id=current_user.id,
        quiz_id=quiz_id,
        score=score_pct,
        total_questions=total
    )
    db.add(res)
    db.commit()

    # Award XP and update progress
    LearningService.add_user_xp(current_user, xp_earned, db)
    LearningService.update_skill_progress(current_user.id, "Grammar", 5.0, db)

    return {
        "score": score_pct,
        "total_questions": total,
        "correct_count": correct_count,
        "xp_earned": xp_earned,
        "explanations": explanations
    }
