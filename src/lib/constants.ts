export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'bn', label: 'Bengali' },
  { value: 'te', label: 'Telugu' },
  { value: 'ta', label: 'Tamil' },
  { value: 'mr', label: 'Marathi' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'kn', label: 'Kannada' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ko', label: 'Korean' },
  { value: 'nl', label: 'Dutch' },
];

export const VOICES = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

// Google TTS voice names for gemini-2.5-flash-preview-tts
// These voices are not language-specific. The model applies the voice
// characteristics to the language of the input text.
export const VOICE_MAP: Record<string, Record<string, string>> = {
  'en': { 'male': 'Algenib', 'female': 'Achernar' },
  'es': { 'male': 'Algenib', 'female': 'Achernar' },
  'fr': { 'male': 'Algenib', 'female': 'Achernar' },
  'de': { 'male': 'Algenib', 'female': 'Achernar' },
  'ja': { 'male': 'Algenib', 'female': 'Achernar' },
  'it': { 'male': 'Algenib', 'female': 'Achernar' },
  'pt': { 'male': 'Algenib', 'female': 'Achernar' },
  'ru': { 'male': 'Algenib', 'female': 'Achernar' },
  'zh': { 'male': 'Algenib', 'female': 'Achernar' },
  'hi': { 'male': 'Algenib', 'female': 'Achernar' },
  'ar': { 'male': 'Algenib', 'female': 'Achernar' },
  'ko': { 'male': 'Algenib', 'female': 'Achernar' },
  'nl': { 'male': 'Algenib', 'female': 'Achernar' },
  'bn': { 'male': 'Algenib', 'female': 'Achernar' },
  'te': { 'male': 'Algenib', 'female': 'Achernar' },
  'ta': { 'male': 'Algenib', 'female': 'Achernar' },
  'mr': { 'male': 'Algenib', 'female': 'Achernar' },
  'gu': { 'male': 'Algenib', 'female': 'Achernar' },
  'kn': { 'male': 'Algenib', 'female': 'Achernar' },
  'ml': { 'male': 'Algenib', 'female': 'Achernar' },
};
