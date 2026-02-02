'use server';

/**
 * @fileOverview A flow that translates transcribed text into a specified target language.
 *
 * - translateTranscribedText - A function that initiates the translation process.
 * - TranslateTranscribedTextInput - The input type for the translateTranscribedText function.
 * - TranslateTranscribedTextOutput - The return type for the translateTranscribedText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTranscribedTextInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The target language for the translation.'),
});
export type TranslateTranscribedTextInput = z.infer<
  typeof TranslateTranscribedTextInputSchema
>;

const TranslateTranscribedTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTranscribedTextOutput = z.infer<
  typeof TranslateTranscribedTextOutputSchema
>;

export async function translateTranscribedText(
  input: TranslateTranscribedTextInput
): Promise<TranslateTranscribedTextOutput> {
  return translateTranscribedTextFlow(input);
}

const translateTranscribedTextPrompt = ai.definePrompt({
  name: 'translateTranscribedTextPrompt',
  input: {schema: TranslateTranscribedTextInputSchema},
  output: {schema: TranslateTranscribedTextOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `Translate the following text into {{{targetLanguage}}}:\n\n{{{text}}}`,
});

const translateTranscribedTextFlow = ai.defineFlow(
  {
    name: 'translateTranscribedTextFlow',
    inputSchema: TranslateTranscribedTextInputSchema,
    outputSchema: TranslateTranscribedTextOutputSchema,
  },
  async input => {
    const {output} = await translateTranscribedTextPrompt(input);
    return output!;
  }
);
