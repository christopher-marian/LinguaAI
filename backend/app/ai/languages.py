from typing import Dict, Optional

# Supported 10 languages and their ISO 639-1 codes & BCP-47 speech locales
LANGUAGE_METADATA: Dict[str, Dict[str, str]] = {
    "english": {"name": "English", "code": "en", "locale": "en-US"},
    "spanish": {"name": "Spanish", "code": "es", "locale": "es-ES"},
    "french": {"name": "French", "code": "fr", "locale": "fr-FR"},
    "german": {"name": "German", "code": "de", "locale": "de-DE"},
    "japanese": {"name": "Japanese", "code": "ja", "locale": "ja-JP"},
    "hindi": {"name": "Hindi", "code": "hi", "locale": "hi-IN"},
    "tamil": {"name": "Tamil", "code": "ta", "locale": "ta-IN"},
    "telugu": {"name": "Telugu", "code": "te", "locale": "te-IN"},
    "malayalam": {"name": "Malayalam", "code": "ml", "locale": "ml-IN"},
    "kannada": {"name": "Kannada", "code": "kn", "locale": "kn-IN"},
}

def normalize_language_code(lang: str) -> str:
    """Returns the 2-letter ISO 639-1 code for any language name or code."""
    if not lang:
        return "en"
    clean = lang.strip().lower()
    if clean in LANGUAGE_METADATA:
        return LANGUAGE_METADATA[clean]["code"]
    for meta in LANGUAGE_METADATA.values():
        if meta["code"] == clean:
            return meta["code"]
    return clean[:2]

def normalize_language_name(lang: str) -> str:
    """Returns canonical language name (e.g. 'Spanish', 'French')."""
    if not lang:
        return "English"
    clean = lang.strip().lower()
    if clean in LANGUAGE_METADATA:
        return LANGUAGE_METADATA[clean]["name"]
    for meta in LANGUAGE_METADATA.values():
        if meta["code"] == clean:
            return meta["name"]
    return lang.strip().capitalize()
