import json
from app.database import SessionLocal, engine, Base
from app.models.schema import User, Lesson, Vocabulary, Quiz, Question, Achievement, Progress, UserVocabulary, UserAchievement
from app.auth.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    demo_user = db.query(User).filter(User.email == "demo@linguaai.com").first()
    if not demo_user:
        print("Creating demo user...")
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
        db.commit()

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
        ach = db.query(Achievement).filter(Achievement.code == a["code"]).first()
        if not ach:
            ach = Achievement(**a)
            db.add(ach)
            db.commit()
            db.refresh(ach)
        badge_objs[a["code"]] = ach

    # Unlock some achievements for demo user if not already unlocked
    for code in ["FIRST_LESSON", "VOCAB_STARTER", "STREAK_7"]:
        b_id = badge_objs[code].id
        if not db.query(UserAchievement).filter_by(user_id=demo_user.id, achievement_id=b_id).first():
            db.add(UserAchievement(user_id=demo_user.id, achievement_id=b_id))
    db.commit()

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
        les = db.query(Lesson).filter(Lesson.title == l["title"]).first()
        if not les:
            les = Lesson(**l)
            db.add(les)
            db.commit()
            db.refresh(les)
        lesson_objs.append(les)

    # 4. Seed Quizzes & Questions
    if len(lesson_objs) > 0 and not db.query(Quiz).filter(Quiz.title == "Greetings & Pleasantries Quiz").first():
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
        db.commit()

    if len(lesson_objs) > 1 and not db.query(Quiz).filter(Quiz.title == "Ser vs Estar Mastery Quiz").first():
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
        db.commit()

    # 5. Seed Vocabulary Bank across all 10 supported languages
    vocab_data = [
        # Spanish
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

        # French
        {"word": "Bonjour", "translation": "Hello / Good morning", "example": "Bonjour! Comment allez-vous?", "language": "French", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "Merci", "translation": "Thank you", "example": "Merci beaucoup pour votre aide.", "language": "French", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "Le passeport", "translation": "Passport", "example": "Mon passeport est valide pour dix ans.", "language": "French", "category": "Travel", "difficulty": "Elementary"},
        {"word": "La valise", "translation": "Suitcase", "example": "Je prépare ma valise pour le voyage.", "language": "French", "category": "Travel", "difficulty": "Beginner"},
        {"word": "L'ordinateur", "translation": "Computer", "example": "J'utilise un ordinateur au travail.", "language": "French", "category": "Technology", "difficulty": "Intermediate"},
        {"word": "Le petit-déjeuner", "translation": "Breakfast", "example": "Le petit-déjeuner est servi à huit heures.", "language": "French", "category": "Food", "difficulty": "Beginner"},

        # German
        {"word": "Hallo", "translation": "Hello", "example": "Hallo! Wie geht es dir heute?", "language": "German", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "Danke", "translation": "Thank you", "example": "Vielen Dank für deine Unterstützung.", "language": "German", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "Der Reisepass", "translation": "Passport", "example": "Vergiss deinen Reisepass nicht.", "language": "German", "category": "Travel", "difficulty": "Elementary"},
        {"word": "Der Koffer", "translation": "Suitcase", "example": "Mein Koffer ist im Auto.", "language": "German", "category": "Travel", "difficulty": "Beginner"},
        {"word": "Der Computer", "translation": "Computer", "example": "Ich programmiere auf meinem Computer.", "language": "German", "category": "Technology", "difficulty": "Intermediate"},
        {"word": "Das Frühstück", "translation": "Breakfast", "example": "Das Frühstück schmeckt sehr gut.", "language": "German", "category": "Food", "difficulty": "Beginner"},

        # Japanese
        {"word": "こんにちは (Konnichiwa)", "translation": "Hello", "example": "こんにちは、お元気ですか？", "language": "Japanese", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "ありがとう (Arigatou)", "translation": "Thank you", "example": "どうもありがとうございます。", "language": "Japanese", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "パスポート (Pasupooto)", "translation": "Passport", "example": "空港でパスポートを見せます。", "language": "Japanese", "category": "Travel", "difficulty": "Elementary"},
        {"word": "スーツケース (Suutsukeesu)", "translation": "Suitcase", "example": "スーツケースに荷物を入れました。", "language": "Japanese", "category": "Travel", "difficulty": "Beginner"},
        {"word": "コンピュータ (Konpyuuta)", "translation": "Computer", "example": "毎日コンピュータを使います。", "language": "Japanese", "category": "Technology", "difficulty": "Intermediate"},
        {"word": "朝ご飯 (Asagohan)", "translation": "Breakfast", "example": "朝ご飯を食べました。", "language": "Japanese", "category": "Food", "difficulty": "Beginner"},

        # Hindi
        {"word": "नमस्ते (Namaste)", "translation": "Hello", "example": "नमस्ते! आप कैसे हैं?", "language": "Hindi", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "धन्यवाद (Dhanyavaad)", "translation": "Thank you", "example": "आपकी मदद के लिए बहुत धन्यवाद।", "language": "Hindi", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "पासपोर्ट (Passport)", "translation": "Passport", "example": "हवाई अड्डे पर अपना पासपोर्ट दिखाएं।", "language": "Hindi", "category": "Travel", "difficulty": "Elementary"},
        {"word": "सूटकेस (Suitcase)", "translation": "Suitcase", "example": "मेरा सूटकेस बहुत भारी है।", "language": "Hindi", "category": "Travel", "difficulty": "Beginner"},
        {"word": "कंप्यूटर (Computer)", "translation": "Computer", "example": "मैं रोज़ कंप्यूटर पर काम करता हूँ।", "language": "Hindi", "category": "Technology", "difficulty": "Intermediate"},
        {"word": "नाश्ता (Nashta)", "translation": "Breakfast", "example": "नाश्ता मेज़ पर तैयार है।", "language": "Hindi", "category": "Food", "difficulty": "Beginner"},

        # Tamil
        {"word": "வணக்கம் (Vanakkam)", "translation": "Hello", "example": "வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?", "language": "Tamil", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "நன்றி (Nandri)", "translation": "Thank you", "example": "உங்கள் உதவிக்கு மிக்க நன்றி.", "language": "Tamil", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "கடவுச்சீட்டு (Passport)", "translation": "Passport", "example": "விமான நிலையத்தில் கடவுச்சீட்டை காண்பிக்கவும்.", "language": "Tamil", "category": "Travel", "difficulty": "Elementary"},
        {"word": "பெட்டி (Suitcase)", "translation": "Suitcase", "example": "எனது பயணப் பெட்டி தயாராக உள்ளது.", "language": "Tamil", "category": "Travel", "difficulty": "Beginner"},
        {"word": "கணினி (Computer)", "translation": "Computer", "example": "நான் கணினியில் படிக்கிறேன்.", "language": "Tamil", "category": "Technology", "difficulty": "Intermediate"},
        {"word": "காலை உணவு (Breakfast)", "translation": "Breakfast", "example": "காலை உணவு சுவையாக உள்ளது.", "language": "Tamil", "category": "Food", "difficulty": "Beginner"},

        # Telugu
        {"word": "నమస్కారం (Namaskaram)", "translation": "Hello", "example": "నమస్కారం! మీరు ఎలా ఉన్నారు?", "language": "Telugu", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "ధన్యవాదాలు (Dhanyavadalu)", "translation": "Thank you", "example": "మీ సహాయానికి చాలా ధన్యవాదాలు.", "language": "Telugu", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "పాస్‌పోర్ట్ (Passport)", "translation": "Passport", "example": "విమానాశ్రయంలో పాస్‌పోర్ట్ చూపించండి.", "language": "Telugu", "category": "Travel", "difficulty": "Elementary"},
        {"word": "కంప్యూటర్ (Computer)", "translation": "Computer", "example": "నేను రోజూ కంప్యూటర్‌లో పని చేస్తాను.", "language": "Telugu", "category": "Technology", "difficulty": "Intermediate"},
        {"word": "అల్పాహారం (Breakfast)", "translation": "Breakfast", "example": "అల్పాహారం సిద్ధంగా ఉంది.", "language": "Telugu", "category": "Food", "difficulty": "Beginner"},

        # Malayalam
        {"word": "നമസ്കാരം (Namaskaram)", "translation": "Hello", "example": "നമസ്കാരം! സുഖമാണോ?", "language": "Malayalam", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "നന്ദി (Nandi)", "translation": "Thank you", "example": "വളരെ നന്ദി.", "language": "Malayalam", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "പാസ്പോർട്ട് (Passport)", "translation": "Passport", "example": "വിമാനത്താവളത്തിൽ പാസ്പോർട്ട് പരിശോധിച്ചു.", "language": "Malayalam", "category": "Travel", "difficulty": "Elementary"},
        {"word": "കമ്പ്യൂട്ടർ (Computer)", "translation": "Computer", "example": "ഞാൻ കമ്പ്യൂട്ടറിൽ ജോലി ചെയ്യുന്നു.", "language": "Malayalam", "category": "Technology", "difficulty": "Intermediate"},
        {"word": "പ്രഭാതഭക്ഷണം (Breakfast)", "translation": "Breakfast", "example": "പ്രഭാതഭക്ഷണം കഴിക്കാം.", "language": "Malayalam", "category": "Food", "difficulty": "Beginner"},

        # Kannada
        {"word": "ನಮಸ್ಕಾರ (Namaskara)", "translation": "Hello", "example": "ನಮಸ್ಕಾರ! ನೀವು ಹೇಗಿದ್ದೀರಿ?", "language": "Kannada", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "ಧನ್ಯವಾದಗಳು (Dhanyavadagalu)", "translation": "Thank you", "example": "ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು.", "language": "Kannada", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "ಪಾಸ್‌ಪೋರ್ಟ್ (Passport)", "translation": "Passport", "example": "ವಿಮಾನ ನಿಲ್ದಾಣದಲ್ಲಿ ಪಾಸ್‌ಪೋರ್ಟ್ ತೋರಿಸಿ.", "language": "Kannada", "category": "Travel", "difficulty": "Elementary"},
        {"word": "ಕಂಪ್ಯೂಟರ್ (Computer)", "translation": "Computer", "example": "ನಾನು ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತೇನೆ.", "language": "Kannada", "category": "Technology", "difficulty": "Intermediate"},
        {"word": "ಉಪಹಾರ (Breakfast)", "translation": "Breakfast", "example": "ಉಪಹಾರ ಸಿದ್ಧವಾಗಿದೆ.", "language": "Kannada", "category": "Food", "difficulty": "Beginner"},

        # English
        {"word": "Welcome", "translation": "Greeting upon arrival", "example": "Welcome to our language platform!", "language": "English", "category": "Daily Life", "difficulty": "Beginner"},
        {"word": "Gratitude", "translation": "Quality of being thankful", "example": "Expressing gratitude brightens the day.", "language": "English", "category": "Daily Life", "difficulty": "Intermediate"},
        {"word": "Destination", "translation": "The place to which someone is going", "example": "Our final travel destination is Paris.", "language": "English", "category": "Travel", "difficulty": "Beginner"},
        {"word": "Innovation", "translation": "New method, idea, or product", "example": "Technological innovation accelerates learning.", "language": "English", "category": "Technology", "difficulty": "Intermediate"},
    ]
    for v in vocab_data:
        existing = db.query(Vocabulary).filter(Vocabulary.word == v["word"], Vocabulary.language == v["language"]).first()
        if not existing:
            voc = Vocabulary(**v)
            db.add(voc)
            db.commit()
            db.refresh(voc)
            if demo_user:
                db.add(UserVocabulary(user_id=demo_user.id, vocabulary_id=voc.id, mastery_level=65, review_count=3))

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
