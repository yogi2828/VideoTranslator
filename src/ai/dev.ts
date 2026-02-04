import { config } from 'dotenv';
config();

import '@/ai/flows/transcribe-uploaded-video.ts';
import '@/ai/flows/translate-and-generate-audio.ts';
