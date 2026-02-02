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
  'en': { 'male': 'algenib', 'female': 'achernar' },
  'es': { 'male': 'algenib', 'female': 'achernar' },
  'fr': { 'male': 'algenib', 'female': 'achernar' },
  'de': { 'male': 'algenib', 'female': 'achernar' },
  'ja': { 'male': 'algenib', 'female': 'achernar' },
  'it': { 'male': 'algenib', 'female': 'achernar' },
  'pt': { 'male': 'algenib', 'female': 'achernar' },
  'ru': { 'male': 'algenib', 'female': 'achernar' },
  'zh': { 'male': 'algenib', 'female': 'achernar' },
  'hi': { 'male': 'algenib', 'female': 'achernar' },
  'ar': { 'male': 'algenib', 'female': 'achernar' },
  'ko': { 'male': 'algenib', 'female': 'achernar' },
  'nl': { 'male': 'algenib', 'female': 'achernar' },
  'bn': { 'male': 'algenib', 'female': 'achernar' },
  'te': { 'male': 'algenib', 'female': 'achernar' },
  'ta': { 'male': 'algenib', 'female': 'achernar' },
  'mr': { 'male': 'algenib', 'female': 'achernar' },
  'gu': { 'male': 'algenib', 'female': 'achernar' },
  'kn': { 'male': 'algenib', 'female': 'achernar' },
  'ml': { 'male': 'algenib', 'female': 'achernar' },
};
