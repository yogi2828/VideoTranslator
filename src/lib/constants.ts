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

export const QUALITIES = [
  { value: '1080p', label: '1080p (Best)' },
  { value: '720p', label: '720p (Standard)' },
  { value: '480p', label: '480p (Fastest)' },
];

export const INITIAL_PROGRESS_STEPS: ProgressStep[] = [
  { id: 'transcribe', label: 'Extracting & Transcribing Audio', status: 'pending' },
  { id: 'translate', label: 'Translating Text', status: 'pending' },
  { id: 'generate-audio', label: 'Generating Translated Audio', status: 'pending' },
  { id: 'complete', label: 'Processing Complete', status: 'pending' },
];
