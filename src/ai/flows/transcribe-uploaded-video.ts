// This is a server-side file.
'use server';

/**
 * @fileOverview Transcribes the audio from an uploaded video into text.
 *
 * - transcribeUploadedVideo - A function that handles the video transcription process.
 * - TranscribeUploadedVideoInput - The input type for the transcribeUploadedVideo function.
 * - TranscribeUploadedVideoOutput - The return type for the transcribeUploadedVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeUploadedVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      'The video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type TranscribeUploadedVideoInput = z.infer<typeof TranscribeUploadedVideoInputSchema>;

const TranscribeUploadedVideoOutputSchema = z.object({
  transcription: z
    .string()
    .describe('The transcription of the audio extracted from the video.'),
});
export type TranscribeUploadedVideoOutput = z.infer<typeof TranscribeUploadedVideoOutputSchema>;

export async function transcribeUploadedVideo(
  input: TranscribeUploadedVideoInput
): Promise<TranscribeUploadedVideoOutput> {
  return transcribeUploadedVideoFlow(input);
}

const transcribeUploadedVideoPrompt = ai.definePrompt({
  name: 'transcribeUploadedVideoPrompt',
  input: {schema: TranscribeUploadedVideoInputSchema},
  output: {schema: TranscribeUploadedVideoOutputSchema},
  model: 'googleai/gemini-2.5-flash-latest',
  prompt: `Transcribe the audio from the following video into text:\n\n{{media url=videoDataUri}}`,
});

const transcribeUploadedVideoFlow = ai.defineFlow(
  {
    name: 'transcribeUploadedVideoFlow',
    inputSchema: TranscribeUploadedVideoInputSchema,
    outputSchema: TranscribeUploadedVideoOutputSchema,
  },
  async input => {
    const {output} = await transcribeUploadedVideoPrompt(input);
    return output!;
  }
);
