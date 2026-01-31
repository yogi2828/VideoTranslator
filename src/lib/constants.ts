import { ProgressStep } from "@/components/progress-tracker";

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

// Google TTS voice names. This is not a complete list.
// A fuller list can be found in the documentation.
export const VOICE_MAP: Record<string, Record<string, string>> = {
  'en': { 'male': 'en-US-News-N', 'female': 'en-US-Standard-C' },
  'es': { 'male': 'es-US-News-G', 'female': 'es-US-Standard-C' },
  'fr': { 'male': 'fr-FR-News-B', 'female': 'fr-FR-Standard-C' },
  'de': { 'male': 'de-DE-News-B', 'female': 'de-DE-Standard-A' },
  'ja': { 'male': 'ja-JP-Standard-B', 'female': 'ja-JP-Standard-A' },
  'it': { 'male': 'it-IT-News-G', 'female': 'it-IT-Standard-A' },
  'pt': { 'male': 'pt-BR-Standard-B', 'female': 'pt-BR-Standard-A' },
  'ru': { 'male': 'ru-RU-Standard-B', 'female': 'ru-RU-Standard-A' },
  'zh': { 'male': 'cmn-CN-Standard-B', 'female': 'cmn-CN-Standard-A' },
  'hi': { 'male': 'hi-IN-Standard-B', 'female': 'hi-IN-Standard-A' },
  'ar': { 'male': 'ar-XA-Standard-B', 'female': 'ar-XA-Standard-A' },
  'ko': { 'male': 'ko-KR-Standard-B', 'female': 'ko-KR-Standard-A' },
  'nl': { 'male': 'nl-NL-Standard-B', 'female': 'nl-NL-Standard-A' },
  'bn': { 'male': 'bn-IN-Standard-B', 'female': 'bn-IN-Standard-A' },
  'te': { 'male': 'te-IN-Standard-B', 'female': 'te-IN-Standard-A' },
  'ta': { 'male': 'ta-IN-Standard-B', 'female': 'ta-IN-Standard-A' },
  'mr': { 'male': 'mr-IN-Standard-B', 'female': 'mr-IN-Standard-A' },
  'gu': { 'male': 'gu-IN-Standard-B', 'female': 'gu-IN-Standard-A' },
  'kn': { 'male': 'kn-IN-Standard-B', 'female': 'kn-IN-Standard-A' },
  'ml': { 'male': 'ml-IN-Standard-B', 'female': 'ml-IN-Standard-A' },
};


export const INITIAL_PROGRESS_STEPS: ProgressStep[] = [
  { id: 'transcribe', label: 'Extracting & Transcribing Audio', status: 'pending' },
  { id: 'translate', label: 'Translating Text', status: 'pending' },
  { id: 'generate-audio', label: 'Generating Translated Audio', status: 'pending' },
  { id: 'complete', label: 'Processing Complete', status: 'pending' },
];
