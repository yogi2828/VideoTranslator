import { config } from 'dotenv';
config();

import '@/ai/flows/translate-transcribed-text.ts';
import '@/ai/flows/transcribe-uploaded-video.ts';
import '@/ai/flows/generate-translated-audio.ts';