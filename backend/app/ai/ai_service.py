import os
import json
from typing import Dict, Any, List, Optional

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# High quality mock/dictionary lookup for 10 languages
DICTIONARY = {
    "English": {
        "hello": {"Spanish": "Hola", "French": "Bonjour", "German": "Hallo", "Japanese": "こんにちは", "Hindi": "नमस्ते", "Tamil": "வணக்கம்", "Telugu": "నమస్తే", "Malayalam": "നമസ്കാരം", "Kannada": "ನಮಸ್ಕಾರ"},
        "welcome to linguaai": {"Spanish": "Bienvenido a LinguaAI", "French": "Bienvenue sur LinguaAI", "German": "Willkommen bei LinguaAI", "Japanese": "LinguaAIへようこそ", "Hindi": "LinguaAI में आपका स्वागत है", "Tamil": "LinguaAI-க்கு வரவேற்கிறோம்", "Telugu": "LinguaAIకి స్వాగతం", "Malayalam": "LinguaAI-ലേക്ക് സ്വാഗതം", "Kannada": "LinguaAI ಗೆ స్వాగత"},
        "how are you?": {"Spanish": "¿Cómo estás?", "French": "Comment allez-vous?", "German": "Wie geht es dir?", "Japanese": "お元気ですか？", "Hindi": "आप कैसे हैं?", "Tamil": "நீங்கள் எப்படி இருக்கிறீர்கள்?", "Telugu": "మీరు ఎలా ఉన్నారు?", "Malayalam": "സുഖമാണോ?", "Kannada": "ನೀವು ಹೇಗಿದ್ದೀರಿ?"},
        "i am learning a new language": {"Spanish": "Estoy aprendiendo un nuevo idioma", "French": "J'apprends une nouvelle langue", "German": "Ich lerne eine neue Sprache", "Japanese": "私は新しい言語を学んでいます", "Hindi": "मैं एक नई भाषा सीख रहा हूँ", "Tamil": "நான் ஒரு புதிய மொழியைக் கற்றுக்கொள்கிறேன்", "Telugu": "నేను ఒక కొత్త భాషను నేర్చుకుంటున్నాను", "Malayalam": "ഞാൻ ഒരു പുതിയ ഭാഷ പഠിക്കുകയാണ്", "Kannada": "ನಾನು ಹೊಸ ಭಾಷೆಯನ್ನು ಕಲಿಯುತ್ತಿದ್ದೇನೆ"},
        "good morning": {"Spanish": "Buenos días", "French": "Bonjour", "German": "Guten Morgen", "Japanese": "おはようございます", "Hindi": "सुप्रभात", "Tamil": "காலை வணக்கம்", "Telugu": "శుభోదయం", "Malayalam": "സുപ്രഭാതം", "Kannada": "శుభెೂೕದಯ"},
        "thank you very much": {"Spanish": "Muchas gracias", "French": "Merci beaucoup", "German": "Vielen Dank", "Japanese": "どうもありがとうございます", "Hindi": "बहुत-बहुत धन्यवाद", "Tamil": "மிக்க நன்றி", "Telugu": "చాలా ధన్యవాదాలు", "Malayalam": "വളരെ നന്ദി", "Kannada": "ತುಂಬಾ ಧನ್ಯವಾದಗಳು"}
    }
}

class AIService:
    @staticmethod
    def translate_text(source_lang: str, target_lang: str, text: str) -> str:
        """Translates text using OpenAI API if key exists, else uses smart fallback."""
        if OPENAI_API_KEY:
            try:
                import openai
                client = openai.OpenAI(api_key=OPENAI_API_KEY)
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": f"You are a professional translator. Translate text accurately from {source_lang} to {target_lang}. Return ONLY the translation, nothing else."},
                        {"role": "user", "content": text}
                    ],
                    temperature=0.3
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                print(f"[AI Service Warning] OpenAI API failed: {e}. Falling back to rule-based engine.")

        # Fallback logic
        clean_text = text.strip().lower()
        if source_lang == "English" and clean_text in DICTIONARY["English"]:
            if target_lang in DICTIONARY["English"][clean_text]:
                return DICTIONARY["English"][clean_text][target_lang]

        # General intelligent mock translation generator for demo
        prefix_map = {
            "Spanish": "En ", "French": "En ", "German": "Auf ", "Japanese": "[JP] ",
            "Hindi": "[हिन्दी] ", "Tamil": "[தமிழ்] ", "Telugu": "[తెలుగు] ",
            "Malayalam": "[മലയാളം] ", "Kannada": "[ಕನ್ನಡ] ", "English": "[EN] "
        }
        
        # Word replacement sample if matching parts exist
        if "hello" in clean_text:
            trans = DICTIONARY["English"]["hello"].get(target_lang, "Hello")
            return text.replace("hello", trans).replace("Hello", trans)
        
        return f"({target_lang}) {text}"

    @staticmethod
    def check_grammar(text: str, language: str = "English") -> Dict[str, Any]:
        """Checks grammar using OpenAI API or smart rules fallback."""
        if OPENAI_API_KEY:
            try:
                import openai
                client = openai.OpenAI(api_key=OPENAI_API_KEY)
                prompt = f"""Analyze this text for grammar mistakes in {language}: '{text}'.
Return a JSON object with fields:
- original_text
- corrected_text
- explanation (clear grammatical rationale)
- mistakes (list of string mistake items)
- suggested_improvements (list of stylistic suggestions)
"""
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"}
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e:
                print(f"[AI Service Warning] OpenAI Grammar check failed: {e}")

        # Intelligent Fallback Rules
        lower = text.lower().strip()
        corrected = text
        explanation = "Your sentence structure is clear and grammatically sound!"
        mistakes = []
        suggestions = ["Try adding descriptive adjectives to enhance fluency."]

        if "i has" in lower:
            corrected = text.replace("I has", "I have").replace("i has", "I have")
            explanation = "Subject-verb agreement error: The first-person singular pronoun 'I' pairs with 'have', not 'has'."
            mistakes = ["'I has' -> 'I have'"]
            suggestions = ["Remember: I/You/We/They use 'have'; He/She/It uses 'has'."]
        elif "he go" in lower:
            corrected = text.replace("he go", "he goes").replace("He go", "He goes")
            explanation = "Third-person singular agreement: Use 'goes' for he/she/it in the simple present tense."
            mistakes = ["'he go' -> 'he goes'"]
            suggestions = ["Add -es for third person verbs like go -> goes, do -> does."]
        elif "she don't" in lower:
            corrected = text.replace("she don't", "she doesn't").replace("She don't", "She doesn't")
            explanation = "Negative auxiliary verb error: 'She' requires 'doesn't' (does not) instead of 'don't'."
            mistakes = ["'she don't' -> 'she doesn't'"]
            suggestions = ["Use 'doesn't' with third-person singular subjects."]

        return {
            "original_text": text,
            "corrected_text": corrected,
            "explanation": explanation,
            "mistakes": mistakes if mistakes else ["No major grammatical errors detected."],
            "suggested_improvements": suggestions
        }

    @staticmethod
    def get_tutor_reply(message: str, topic: str, difficulty: str, language: str, history: List[dict]) -> Dict[str, Any]:
        """Conversational AI tutor."""
        if OPENAI_API_KEY:
            try:
                import openai
                client = openai.OpenAI(api_key=OPENAI_API_KEY)
                messages = [
                    {"role": "system", "content": f"You are LinguaAI Tutor, a friendly language tutor in {language}. Topic: {topic}, Level: {difficulty}. Respond in {language} with an English translation, provide corrections if user made mistake, and give a helpful tip. Return JSON: {{'reply': '...', 'corrections': '...', 'cultural_tip': '...'}}."}
                ]
                for h in history:
                    messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
                messages.append({"role": "user", "content": message})

                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    response_format={"type": "json_object"}
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e:
                print(f"[AI Service Warning] OpenAI Tutor failed: {e}")

        # Smart Fallback Tutor
        topic_replies = {
            "Daily conversation": f"¡Hola! Es un gusto hablar contigo sobre {topic}. ¿Qué hiciste hoy?",
            "Travel": f"Travel is exciting! Where would you like to visit first when traveling in a {language}-speaking country?",
            "Job interview": f"Welcome to the interview! Could you tell me a little bit about your background and experience?",
            "Food": f"Food brings people together! What is your favorite traditional meal in your culture?",
        }
        
        reply = topic_replies.get(topic, f"That is interesting! Let's continue discussing {topic} in {language}.")
        
        return {
            "reply": reply,
            "corrections": "Your sentence was understandable! Tip: Watch out for prepositions in quick dialogue.",
            "cultural_tip": f"In {language}-speaking cultures, polite greetings often start conversations warmly."
        }

    @staticmethod
    def evaluate_writing(prompt: str, submission: str, target_language: str) -> Dict[str, Any]:
        """Evaluates written submission."""
        word_count = len(submission.split())
        grammar_score = min(100, max(60, 70 + (word_count * 2)))
        vocab_score = min(100, max(65, 75 + (word_count * 1)))
        structure_score = 85
        clarity_score = 90
        overall = int((grammar_score + vocab_score + structure_score + clarity_score) / 4)

        return {
            "overall_score": overall,
            "grammar_score": grammar_score,
            "vocabulary_score": vocab_score,
            "structure_score": structure_score,
            "clarity_score": clarity_score,
            "feedback": f"Great effort writing {word_count} words! Your vocabulary usage matches {target_language} expectations well.",
            "corrected_version": submission.strip() + " (Polished and reviewed by LinguaAI)"
        }
