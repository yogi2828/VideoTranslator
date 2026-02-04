'use server';

/**
 * @fileOverview A flow that translates text and generates audio for it.
 *
 * - translateAndGenerateAudio - A function that handles the translation and TTS process.
 * - TranslateAndGenerateAudioInput - The input type for the function.
 * - TranslateAndGenerateAudioOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const TranslateAndGenerateAudioInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The target language for the translation.'),
  voiceName: z.string().describe('The name of the voice to use for TTS.'),
});
export type TranslateAndGenerateAudioInput = z.infer<typeof TranslateAndGenerateAudioInputSchema>;

const TranslateAndGenerateAudioOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
  audioDataUri: z.string().describe('The audio data URI in WAV format.'),
});
export type TranslateAndGenerateAudioOutput = z.infer<typeof TranslateAndGenerateAudioOutputSchema>;

export async function translateAndGenerateAudio(input: TranslateAndGenerateAudioInput): Promise<TranslateAndGenerateAudioOutput> {
  return translateAndGenerateAudioFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const translatePrompt = ai.definePrompt({
    name: 'translateTextPromptForAudio',
    input: {schema: z.object({
        text: z.string(),
        targetLanguage: z.string(),
    })},
    output: {schema: z.object({ translatedText: z.string() })},
    model: 'googleai/gemini-2.5-flash',
    prompt: `Translate the following text into {{{targetLanguage}}}:\n\n{{{text}}}`,
});

const translateAndGenerateAudioFlow = ai.defineFlow(
  {
    name: 'translateAndGenerateAudioFlow',
    inputSchema: TranslateAndGenerateAudioInputSchema,
    outputSchema: TranslateAndGenerateAudioOutputSchema,
  },
  async input => {
    // Step 1: Translate the text
    const { output: translationOutput } = await translatePrompt({
      text: input.text,
      targetLanguage: input.targetLanguage,
    });

    if (!translationOutput) {
        throw new Error('Translation failed.');
    }
    const { translatedText } = translationOutput;

    // Step 2: Generate audio
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voiceName },
          },
        },
      },
      prompt: translatedText,
    });

    if (!media) {
      throw new Error('TTS media generation failed.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    // Step 3: Return combined output
    return {
      translatedText,
      audioDataUri,
    };
  }
);
