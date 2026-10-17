import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("=== Testing LinguaAI Backend Endpoints ===")

    # 1. Root
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.text}"
    print("  [PASS] Root endpoint OK")

    # 2. Login with Demo User
    res = client.post("/api/auth/login", json={"email": "demo@linguaai.com", "password": "password123"})
    assert res.status_code == 200, f"Demo login failed: {res.text}"
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"  [PASS] Demo login OK (user: {res.json()['user']['name']})")

    # 3. Register New User
    import time
    test_email = f"learner_{int(time.time())}@linguaai.com"
    res = client.post("/api/auth/register", json={
        "name": "Maria Garcia",
        "email": test_email,
        "password": "Password123!",
        "native_language": "English",
        "learning_language": "Spanish",
        "level": "Beginner"
    })
    assert res.status_code == 200, f"Registration failed: {res.text}"
    new_token = res.json()["access_token"]
    new_headers = {"Authorization": f"Bearer {new_token}"}
    print(f"  [PASS] User registration OK ({test_email})")

    # 4. User profile & dashboard
    res = client.get("/api/users/me", headers=headers)
    assert res.status_code == 200
    res = client.get("/api/users/dashboard", headers=headers)
    assert res.status_code == 200
    dash = res.json()
    assert "skills_progress" in dash
    assert "recommendations" in dash
    print("  [PASS] User dashboard and recommendations OK")

    # 5. Translation
    res = client.post("/api/translate", headers=headers, json={
        "source_language": "English",
        "target_language": "Spanish",
        "text": "Hello! Welcome to LinguaAI"
    })
    assert res.status_code == 200
    assert "translated_text" in res.json()
    print(f"  [PASS] Translation OK: '{res.json()['translated_text']}'")

    res = client.get("/api/translation/history", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) > 0
    print("  [PASS] Translation history OK")

    # 6. Lessons
    res = client.get("/api/lessons")
    assert res.status_code == 200
    lessons = res.json()
    assert len(lessons) > 0
    lesson_id = lessons[0]["id"]
    print(f"  [PASS] Lessons list OK ({len(lessons)} lessons)")

    res = client.get(f"/api/lessons/{lesson_id}")
    assert res.status_code == 200
    print(f"  [PASS] Lesson detail OK: {res.json()['title']}")

    res = client.post(f"/api/lessons/{lesson_id}/complete", headers=headers)
    assert res.status_code == 200
    print(f"  [PASS] Lesson completion OK (+{res.json()['xp_gained']} XP)")

    # 7. Vocabulary & Flashcards
    res = client.get("/api/vocabulary", headers=headers)
    assert res.status_code == 200
    vocab_items = res.json()
    assert len(vocab_items) > 0
    v_id = vocab_items[0]["id"]
    print(f"  [PASS] Vocabulary list OK ({len(vocab_items)} items)")

    res = client.post(f"/api/vocabulary/{v_id}/review", headers=headers, json={"rating": "Good"})
    assert res.status_code == 200
    print(f"  [PASS] Flashcard SRS review OK (new mastery: {res.json()['new_mastery_level']}%)")

    # 8. Quizzes
    res = client.get("/api/quizzes")
    assert res.status_code == 200
    quizzes = res.json()
    assert len(quizzes) > 0
    q_id = quizzes[0]["id"]

    res = client.get(f"/api/quizzes/{q_id}")
    assert res.status_code == 200
    quiz_data = res.json()
    assert len(quiz_data["questions"]) > 0

    # Submit quiz answers
    answers = {}
    for q in quiz_data["questions"]:
        # Put first option or test
        answers[str(q["id"])] = q["options"][0]

    res = client.post(f"/api/quizzes/{q_id}/submit", headers=headers, json={"answers": answers})
    assert res.status_code == 200
    print(f"  [PASS] Quiz submit OK (score: {res.json()['score']}%, +{res.json()['xp_earned']} XP)")

    # 9. AI Grammar Check
    res = client.post("/api/ai/grammar-check", headers=headers, json={"text": "I has a book."})
    assert res.status_code == 200
    g_res = res.json()
    assert "corrected_text" in g_res
    print(f"  [PASS] AI Grammar check OK: '{g_res['original_text']}' -> '{g_res['corrected_text']}'")

    # 10. AI Tutor
    res = client.post("/api/ai/tutor", headers=headers, json={
        "message": "Hola, ¿cómo estás?",
        "topic": "Daily conversation",
        "difficulty": "Beginner",
        "language": "Spanish"
    })
    assert res.status_code == 200
    assert "reply" in res.json()
    print(f"  [PASS] AI Tutor chat OK: '{res.json()['reply']}'")

    # 11. AI Writing Feedback
    res = client.post("/api/ai/writing-feedback", headers=headers, json={
        "prompt": "Describe your weekend.",
        "submission": "El fin de semana fui al parque con mis amigos y descansé mucho.",
        "target_language": "Spanish"
    })
    assert res.status_code == 200
    assert "overall_score" in res.json()
    print(f"  [PASS] AI Writing feedback OK (score: {res.json()['overall_score']})")

    # 12. Speaking Evaluation
    res = client.post("/api/speaking/evaluate", headers=headers, json={
        "target_phrase": "Buenos días",
        "spoken_phrase": "buenos dias"
    })
    assert res.status_code == 200
    assert "accuracy_percentage" in res.json()
    print(f"  [PASS] Speaking evaluation OK (accuracy: {res.json()['accuracy_percentage']}%)")

    # 13. Practice reading & listening
    res = client.get("/api/practice/reading")
    assert res.status_code == 200
    assert len(res.json()) > 0
    print(f"  [PASS] Reading practice passages OK ({len(res.json())} passages)")

    res = client.get("/api/practice/listening")
    assert res.status_code == 200
    assert len(res.json()) > 0
    print(f"  [PASS] Listening practice exercises OK ({len(res.json())} exercises)")

    # 14. Progress Analytics & Achievements
    res = client.get("/api/progress", headers=headers)
    assert res.status_code == 200
    prog = res.json()
    assert "weekly_activity" in prog
    assert "radar_skill_data" in prog
    print("  [PASS] Progress analytics & radar data OK")

    res = client.get("/api/achievements", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) >= 7
    print(f"  [PASS] Achievements OK ({len(res.json())} badges)")

    print("\nALL 14 BACKEND TEST SUITES PASSED FLAWLESSLY! SUCCESS")

if __name__ == "__main__":
    run_tests()
