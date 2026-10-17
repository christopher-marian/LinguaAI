import json
from app.database import SessionLocal, engine, Base
from app.models.schema import User, Lesson, Vocabulary, Quiz, Question, Achievement, Progress, UserVocabulary, UserAchievement
from app.auth.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).filter(User.email == "demo@linguaai.com").first():
        print("Database already seeded with demo user!")
        db.close()
        return

    print("Seeding database with initial data...")

    # 1. Create Demo User
    demo_user = User(
        name="Alex Morgan",
        email="demo@linguaai.com",
        password_hash=get_password_hash("password123"),
        native_language="English",
        learning_language="Spanish",
        level="Intermediate",
        points=340,
        streak=7,
        last_active_date="2026-10-02"
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)

    # Initial Progress
    skills = ["Vocabulary", "Grammar", "Reading", "Writing", "Listening", "Speaking", "Pronunciation"]
    initial_scores = {"Vocabulary": 75.0, "Grammar": 55.0, "Reading": 80.0, "Writing": 65.0, "Listening": 70.0, "Speaking": 50.0, "Pronunciation": 60.0}
    for s in skills:
        db.add(Progress(user_id=demo_user.id, skill=s, progress_percentage=initial_scores.get(s, 50.0)))

    # 2. Seed Achievements / Badges
    achievements_data = [
        {"code": "FIRST_LESSON", "name": "First Lesson", "description": "Completed your very first language lesson.", "icon": "BookOpen", "requirement": "Complete 1 lesson"},
        {"code": "VOCAB_STARTER", "name": "Vocabulary Starter", "description": "Learned 10 new vocabulary words.", "icon": "Brain", "requirement": "Learn 10 words"},
        {"code": "STREAK_7", "name": "7 Day Streak", "description": "Maintained a daily learning streak for 7 consecutive days.", "icon": "Flame", "requirement": "7 days streak"},
        {"code": "GRAMMAR_MASTER", "name": "Grammar Master", "description": "Scored 100% on a grammar assessment.", "icon": "Sparkles", "requirement": "100% on Grammar Quiz"},
        {"code": "QUIZ_CHAMP", "name": "Quiz Champion", "description": "Successfully completed 5 interactive quizzes.", "icon": "Trophy", "requirement": "Complete 5 quizzes"},
        {"code": "SPEAKING_BEG", "name": "Speaking Beginner", "description": "Completed your first speech pronunciation evaluation.", "icon": "Mic", "requirement": "Evaluate speech"},
        {"code": "TRANSLATION_EXP", "name": "Translation Explorer", "description": "Translated phrases across 3 different languages.", "icon": "Languages", "requirement": "Translate 3 times"},
    ]
    badge_objs = {}
    for a in achievements_data:
        ach = Achievement(**a)
        db.add(ach)
        db.commit()
        db.refresh(ach)
        badge_objs[a["code"]] = ach

    # Unlock some achievements for demo user
    db.add(UserAchievement(user_id=demo_user.id, achievement_id=badge_objs["FIRST_LESSON"].id))
    db.add(UserAchievement(user_id=demo_user.id, achievement_id=badge_objs["VOCAB_STARTER"].id))
    db.add(UserAchievement(user_id=demo_user.id, achievement_id=badge_objs["STREAK_7"].id))

    # 3. Seed Lessons
    lessons_data = [
        {
            "title": "Essential Spanish Greetings & Pleasantries",
            "description": "Master core daily greetings, polite expressions, and natural introduction phrases in Spanish.",
            "level": "Beginner",
            "language": "Spanish",
            "category": "Vocabulary",
            "estimated_time": 10,
            "xp_reward": 20,
            "order_index": 1,
            "content": """# Essential Spanish Greetings

Greetings form the backbone of everyday social interaction in Spanish-speaking countries.

### Key Expressions:
* **¡Hola!** – Hello!
* **Buenos días** – Good morning
* **Buenas tardes** – Good afternoon
* **Buenas noches** – Good evening / Good night
* **¿Cómo estás?** – How are you? (Informal)
* **¿Cómo está usted?** – How are you? (Formal)
* **Mucho gusto** – Nice to meet you

### Practice Dialogue:
**María**: ¡Hola! Buenos días, ¿cómo estás?
**Carlos**: ¡Hola, María! Muy bien, gracias. ¿Y tú?
**María**: Excelente, gracias.
"""
        },
        {
            "title": "Mastering Present Tense Verbs (Ser vs Estar)",
            "description": "Understand the fundamental rules between permanent states (Ser) and temporary conditions (Estar).",
            "level": "Intermediate",
            "language": "Spanish",
            "category": "Grammar",
            "estimated_time": 15,
            "xp_reward": 30,
            "order_index": 2,
            "content": """# Understanding Ser vs Estar

Both **Ser** and **Estar** translate to 'to be' in English, but they have distinct grammatical usages!

### Use **SER** for (DOCTOR):
* **D**escription: *Él es alto.* (He is tall.)
* **O**ccupation: *Ella es médica.* (She is a doctor.)
* **C**haracteristic: *La sopa es buena.* (Soup in general is good.)
* **T**ime: *Son las tres.* (It is 3 o'clock.)
* **O**rigin: *Soy de España.* (I am from Spain.)
* **R**elationship: *Es mi hermano.* (He is my brother.)

### Use **ESTAR** for (PLACE):
* **P**osition: *El libro está en la mesa.*
* **L**ocation: *Estoy en la biblioteca.*
* **A**ction: *Estamos estudiando.*
* **C**ondition: *Estoy cansado.* (I am tired.)
* **E**motion: *Ella está feliz.*
"""
        },
        {
            "title": "Restaurant & Dining Vocabulary",
            "description": "Learn how to order food, ask for the bill, and express dietary preferences comfortably.",
            "level": "Elementary",
            "language": "Spanish",
            "category": "Vocabulary",
            "estimated_time": 12,
            "xp_reward": 25,
            "order_index": 3,
            "content": """# Restaurant & Dining Out

Ordering food smoothly in a restaurant is an essential real-world skill!

### Essential Vocabulary:
* **La cuenta, por favor** – The check, please
* **El menú / La carta** – The menu
* **La mesa para dos** – Table for two
* **Agua sin gas** – Still water
* **La camarera / El camarero** – Waiter / Waitress

### Useful Sentences:
* *Quisiera reservar una mesa para esta noche.*
* *¿Me puede traer la cuenta, por favor?*
"""
        },
        {
            "title": "Travel & Airport Navigation",
            "description": "Navigate international airports, boarding gates, and hotel check-ins with confidence.",
            "level": "Intermediate",
            "language": "Spanish",
            "category": "Speaking",
            "estimated_time": 15,
            "xp_reward": 30,
            "order_index": 4,
            "content": """# Airport & Travel Phrasebook

### Key Terms:
* **El boleto de avión** – Plane ticket
* **El pasaporte** – Passport
* **La puerta de embarque** – Boarding gate
* **El equipaje de mano** – Carry-on luggage
"""
        }
    ]

    lesson_objs = []
    for l in lessons_data:
        les = Lesson(**l)
        db.add(les)
        db.commit()
        db.refresh(les)
        lesson_objs.append(les)

    # 4. Seed Quizzes & Questions
    quiz1 = Quiz(title="Greetings & Pleasantries Quiz", lesson_id=lesson_objs[0].id, difficulty="Beginner")
    db.add(quiz1)
    db.commit()
    db.refresh(quiz1)

    questions_quiz1 = [
        {
            "quiz_id": quiz1.id,
            "question": "How do you say 'Good morning' in Spanish?",
            "options": json.dumps(["Buenas noches", "Buenos días", "Buenas tardes", "Hola"]),
            "correct_answer": "Buenos días",
            "explanation": "'Buenos días' is used in the morning until noon."
        },
        {
            "quiz_id": quiz1.id,
            "question": "What is the polite phrase for 'Nice to meet you'?",
            "options": json.dumps(["Mucho gusto", "Por favor", "De nada", "Hasta luego"]),
            "correct_answer": "Mucho gusto",
            "explanation": "'Mucho gusto' literally means 'much pleasure' (nice to meet you)."
        },
        {
            "quiz_id": quiz1.id,
            "question": "Which phrase means 'How are you?' (Informal)?",
            "options": json.dumps(["¿Dónde estás?", "¿Cómo estás?", "¿Quién es?", "¿Cómo te llamas?"]),
            "correct_answer": "¿Cómo estás?",
            "explanation": "'¿Cómo estás?' is used when speaking to friends or peers."
        }
    ]
    for q in questions_quiz1:
        db.add(Question(**q))

    quiz2 = Quiz(title="Ser vs Estar Mastery Quiz", lesson_id=lesson_objs[1].id, difficulty="Intermediate")
    db.add(quiz2)
    db.commit()
    db.refresh(quiz2)

    questions_quiz2 = [
        {
            "quiz_id": quiz2.id,
            "question": "Fill in the blank: Yo _____ cansado hoy (I am tired today).",
            "options": json.dumps(["soy", "estoy", "tengo", "hago"]),
            "correct_answer": "estoy",
            "explanation": "Temporary physical conditions like tiredness use ESTAR ('estoy')."
        },
        {
            "quiz_id": quiz2.id,
            "question": "Which verb is used for permanent origin? (e.g., 'Soy de México')",
            "options": json.dumps(["Estar", "Ser", "Haber", "Tener"]),
            "correct_answer": "Ser",
            "explanation": "Origin and nationality always use SER."
        }
    ]
    for q in questions_quiz2:
        db.add(Question(**q))

    # 5. Seed Vocabulary Bank across categories
    vocab_data = [
        {"word": "Hola", "translation": "Hello", "example": "¡Hola! ¿Cómo estás?", "language": "Spanish", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "Gracias", "translation": "Thank you", "example": "Muchas gracias por tu ayuda.", "language": "Spanish", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "El pasaporte", "translation": "Passport", "example": "Necesito mostrar mi pasaporte en el aeropuerto.", "language": "Spanish", "category": "Travel", "difficulty": "Elementary"},
        {"word": "La maleta", "translation": "Suitcase", "example": "Mi maleta es pesada.", "language": "Spanish", "category": "Travel", "difficulty": "Beginner"},
        {"word": "La computadora", "translation": "Computer", "example": "Trabajo en mi computadora todos los días.", "language": "Spanish", "category": "Technology", "difficulty": "Intermediate"},
        {"word": "La universidad", "translation": "University", "example": "Estudio ingeniería en la universidad.", "language": "Spanish", "category": "Education", "difficulty": "Elementary"},
        {"word": "El desayuno", "translation": "Breakfast", "example": "El desayuno está listo en la cocina.", "language": "Spanish", "category": "Food", "difficulty": "Beginner"},
        {"word": "La reunión", "translation": "Meeting", "example": "Tenemos una reunión importante a las 10:00.", "language": "Spanish", "category": "Work", "difficulty": "Intermediate"},
        {"word": "El teléfono", "translation": "Telephone / Phone", "example": "Te llamo por teléfono más tarde.", "language": "Spanish", "category": "Communication", "difficulty": "Beginner"},
        {"word": "Por favor", "translation": "Please", "example": "Un vaso de agua, por favor.", "language": "Spanish", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "El hotel", "translation": "Hotel", "example": "El hotel está cerca del centro histórico.", "language": "Spanish", "category": "Travel", "difficulty": "Beginner"},
        {"word": "La lección", "translation": "Lesson", "example": "Esta lección de gramática es muy útil.", "language": "Spanish", "category": "Education", "difficulty": "Elementary"},
    ]
    for v in vocab_data:
        voc = Vocabulary(**v)
        db.add(voc)
        db.commit()
        db.refresh(voc)
        # Associate some with demo user
        db.add(UserVocabulary(user_id=demo_user.id, vocabulary_id=voc.id, mastery_level=65, review_count=3))

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
