'use server';

/**
 * @fileOverview A flow to generate translated audio from translated text using TTS.
 *
 * - generateTranslatedAudio - A function that generates translated audio.
 * - GenerateTranslatedAudioInput - The input type for the generateTranslatedAudio function.
 * - GenerateTranslatedAudioOutput - The return type for the generateTranslatedAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateTranslatedAudioInputSchema = z.object({
  translatedText: z.string().describe('The translated text to convert to audio.'),
  voiceName: z.string().describe('The name of the voice to use for TTS.'),
});
export type GenerateTranslatedAudioInput = z.infer<typeof GenerateTranslatedAudioInputSchema>;

const GenerateTranslatedAudioOutputSchema = z.object({
  audioDataUri: z.string().describe('The audio data URI in WAV format.'),
});
export type GenerateTranslatedAudioOutput = z.infer<typeof GenerateTranslatedAudioOutputSchema>;

export async function generateTranslatedAudio(input: GenerateTranslatedAudioInput): Promise<GenerateTranslatedAudioOutput> {
  return generateTranslatedAudioFlow(input);
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

const generateTranslatedAudioFlow = ai.defineFlow(
  {
    name: 'generateTranslatedAudioFlow',
    inputSchema: GenerateTranslatedAudioInputSchema,
    outputSchema: GenerateTranslatedAudioOutputSchema,
  },
  async input => {
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
      prompt: input.translatedText,
    });

    if (!media) {
      throw new Error('no media returned');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      audioDataUri: audioDataUri,
    };
  }
);
