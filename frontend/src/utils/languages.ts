export interface LanguageInfo {
  name: string;
  code: string;
  locale: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { name: 'English', code: 'en', locale: 'en-US', nativeName: 'English', flag: '🇺🇸' },
  { name: 'Spanish', code: 'es', locale: 'es-ES', nativeName: 'Español', flag: '🇪🇸' },
  { name: 'French', code: 'fr', locale: 'fr-FR', nativeName: 'Français', flag: '🇫🇷' },
  { name: 'German', code: 'de', locale: 'de-DE', nativeName: 'Deutsch', flag: '🇩🇪' },
  { name: 'Japanese', code: 'ja', locale: 'ja-JP', nativeName: '日本語', flag: '🇯🇵' },
  { name: 'Hindi', code: 'hi', locale: 'hi-IN', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { name: 'Tamil', code: 'ta', locale: 'ta-IN', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { name: 'Telugu', code: 'te', locale: 'te-IN', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { name: 'Malayalam', code: 'ml', locale: 'ml-IN', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { name: 'Kannada', code: 'kn', locale: 'kn-IN', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' }
];

export const LANGUAGE_NAMES = SUPPORTED_LANGUAGES.map(l => l.name);

export const getLanguageLocale = (langName: string): string => {
  const match = SUPPORTED_LANGUAGES.find(
    l => l.name.toLowerCase() === (langName || '').trim().toLowerCase() ||
         l.code.toLowerCase() === (langName || '').trim().toLowerCase()
  );
  return match ? match.locale : 'en-US';
};

export const getLanguageCode = (langName: string): string => {
  const match = SUPPORTED_LANGUAGES.find(
    l => l.name.toLowerCase() === (langName || '').trim().toLowerCase() ||
         l.code.toLowerCase() === (langName || '').trim().toLowerCase()
  );
  return match ? match.code : 'en';
};
