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
];

export const VOICES = [
  { value: 'en-US-News-K', label: 'English (US, News)' },
  { value: 'es-US-News-G', label: 'Spanish (US, News)' },
  { value: 'fr-FR-Standard-D', label: 'French (France, Standard)' },
  { value: 'de-DE-Standard-F', label: 'German (Germany, Standard)' },
  { value: 'ja-JP-Standard-A', label: 'Japanese (Japan, Standard)' },
  { value: 'it-IT-Standard-A', label: 'Italian (Italy, Standard)' },
  { value: 'pt-BR-Standard-A', label: 'Portuguese (Brazil, Standard)' },
  { value: 'ru-RU-Standard-A', label: 'Russian (Russia, Standard)' },
  { value: 'cmn-CN-Standard-A', label: 'Chinese (Mandarin, Standard)' },
];

export const QUALITIES = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const INITIAL_PROGRESS_STEPS: ProgressStep[] = [
  { id: 'transcribe', label: 'Extracting & Transcribing Audio', status: 'pending' },
  { id: 'translate', label: 'Translating Text', status: 'pending' },
  { id: 'generate-audio', label: 'Generating Translated Audio', status: 'pending' },
  { id: 'complete', label: 'Processing Complete', status: 'pending' },
];
