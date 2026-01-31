'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LANGUAGES, VOICES, QUALITIES, INITIAL_PROGRESS_STEPS } from '@/lib/constants';
import { transcribeUploadedVideo } from '@/ai/flows/transcribe-uploaded-video';
import { translateTranscribedText } from '@/ai/flows/translate-transcribed-text';
import { generateTranslatedAudio } from '@/ai/flows/generate-translated-audio';
import { ProgressTracker, type ProgressStep, type ProgressStatus } from './progress-tracker';
import { ResultsDisplay } from './results-display';

const formSchema = z.object({
  video: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'A video file is required.')
    .refine(
      (files) => files?.[0]?.type.startsWith('video/'),
      'Only video files are allowed.'
    ),
  targetLanguage: z.string().min(1, 'Please select a language.'),
  voice: z.string().min(1, 'Please select a voice.'),
  quality: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function VideoTranslator() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState<ProgressStep[]>(INITIAL_PROGRESS_STEPS);
  const [results, setResults] = useState<{
    videoUrl: string;
    translatedText: string;
    audioUrl: string;
  } | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetLanguage: 'es',
      voice: 'es-US-News-G',
      quality: 'high',
    },
  });

  const updateProgress = (stepId: string, status: ProgressStatus) => {
    setProgress((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: FormValues) => {
    setStatus('processing');
    setProgress(INITIAL_PROGRESS_STEPS);

    try {
      const videoFile = data.video[0];
      const videoDataUri = await readFileAsDataURL(videoFile);

      updateProgress('transcribe', 'in-progress');
      const { transcription } = await transcribeUploadedVideo({ videoDataUri });
      updateProgress('transcribe', 'complete');

      updateProgress('translate', 'in-progress');
      const { translatedText } = await translateTranscribedText({
        text: transcription,
        targetLanguage: data.targetLanguage,
      });
      updateProgress('translate', 'complete');

      updateProgress('generate-audio', 'in-progress');
      const { audioDataUri } = await generateTranslatedAudio({
        translatedText,
        voiceName: data.voice,
      });
      updateProgress('generate-audio', 'complete');
      
      const videoUrl = URL.createObjectURL(videoFile);
      setResults({ videoUrl, translatedText, audioUrl: audioDataUri });
      setStatus('success');
      updateProgress('complete', 'complete');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error(error);
      setStatus('error');
      // Mark all in-progress or pending steps as error
      setProgress(prev => prev.map(p => p.status === 'in-progress' || p.status === 'pending' ? {...p, status: 'error'} : p));
      toast({
        variant: 'destructive',
        title: 'Processing Failed',
        description: `There was a problem translating your video. ${errorMessage}`,
      });
    }
  };

  if (status === 'processing') {
    return <ProgressTracker steps={progress} />;
  }
  
  if (status === 'success' && results) {
    return (
      <div>
        <ResultsDisplay {...results} />
        <div className="text-center mt-8">
            <Button onClick={() => { setStatus('idle'); form.reset(); }} variant="outline">Translate Another Video</Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-2">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Upload Your Video</CardTitle>
        <CardDescription>
          Select a video file and choose your translation options.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video File</FormLabel>
                  <FormControl>
                    <div className="relative flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div className="flex text-sm text-muted-foreground">
                          <Input
                            id="file-upload"
                            type="file"
                            accept="video/*"
                            className="sr-only"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                          <label htmlFor="file-upload" className="relative font-medium rounded-md cursor-pointer text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring">
                            <span>Upload a file</span>
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {form.watch('video')?.[0]?.name || 'MP4, MOV, AVI up to 50MB'}
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="voice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {VOICES.map((voice) => (
                          <SelectItem key={voice.value} value={voice.value}>
                            {voice.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Quality</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {QUALITIES.map((q) => (
                        <SelectItem key={q.value} value={q.value}>
                          {q.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={status === 'processing'}
              size="lg"
            >
              {status === 'processing' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              👉 Start Translation
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
