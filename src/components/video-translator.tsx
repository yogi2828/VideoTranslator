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
import { Loader2, UploadCloud, Play, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LANGUAGES, VOICES, QUALITIES, INITIAL_PROGRESS_STEPS } from '@/lib/constants';
import { transcribeUploadedVideo } from '@/ai/flows/transcribe-uploaded-video';
import { translateTranscribedText } from '@/ai/flows/translate-transcribed-text';
import { generateTranslatedAudio } from '@/ai/flows/generate-translated-audio';
import { ProgressTracker, type ProgressStep, type ProgressStatus } from './progress-tracker';
import { ResultsDisplay } from './results-display';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { saveTranslationHistory } from '@/firebase/firestore/history';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';


const formSchema = z.object({
  video: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'A video file is required.')
    .refine(
      (files) => files?.[0]?.type.startsWith('video/'),
      'Only video files are allowed.'
    ),
  targetLanguage: z.string().min(1, 'Please select a language.'),
  autoDetect: z.boolean().default(false),
  voice: z.string().min(1, 'Please select a voice.'),
  quality: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function VideoTranslator() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState<ProgressStep[]>(INITIAL_PROGRESS_STEPS);
  const [step, setStep] = useState(1);
  const [results, setResults] = useState<{
    videoUrl: string;
    translatedText: string;
    audioUrl: string;
  } | null>(null);

  const { toast } = useToast();
  const { user, isLoading: isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetLanguage: 'es',
      voice: 'male',
      quality: '720p',
      autoDetect: false,
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
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You need to be logged in to translate videos.',
      });
      router.push('/login');
      return;
    }

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
      
      const voiceMap = {
        male: 'es-US-News-G', // Example mapping
        female: 'es-US-Standard-C'
      }

      updateProgress('generate-audio', 'in-progress');
      const { audioDataUri } = await generateTranslatedAudio({
        translatedText,
        voiceName: voiceMap[data.voice as keyof typeof voiceMap] || 'es-US-News-G',
      });
      updateProgress('generate-audio', 'complete');
      
      const videoUrl = URL.createObjectURL(videoFile);
      
      if (auth.currentUser && firestore) {
        saveTranslationHistory(firestore, auth.currentUser.uid, {
          videoName: videoFile.name,
          translatedText: translatedText,
          targetLanguage: data.targetLanguage,
        });
      }

      setResults({ videoUrl, translatedText, audioUrl: audioDataUri });
      setStatus('success');
      updateProgress('complete', 'complete');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error(error);
      setStatus('error');
      setProgress(prev => prev.map(p => p.status === 'in-progress' || p.status === 'pending' ? {...p, status: 'error'} : p));
      toast({
        variant: 'destructive',
        title: 'Processing Failed',
        description: `There was a problem translating your video. ${errorMessage}`,
      });
    }
  };
  
  const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <div className="flex items-center justify-center gap-4 mb-6">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            s === currentStep
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {s}
        </div>
      ))}
    </div>
  );

  if (isUserLoading) {
    return <Card className="w-full max-w-lg"><CardContent className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>
  }
  
  if (status === 'processing') {
    return <ProgressTracker steps={progress} />;
  }
  
  if (status === 'success' && results) {
    return (
      <div>
        <ResultsDisplay {...results} />
        <div className="text-center mt-8">
            <Button onClick={() => { setStatus('idle'); setStep(1); form.reset(); }} variant="outline">Translate Another Video</Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-lg shadow-2xl bg-card text-card-foreground">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Video Translator</CardTitle>
             <StepIndicator currentStep={step} />
          </CardHeader>

          <CardContent className="space-y-6 min-h-[320px]">
            {step === 1 && (
               <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-semibold text-lg">Upload your video</h3>
                  <FormField
                    control={form.control}
                    name="video"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-input">
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
                                {form.watch('video')?.[0]?.name || 'MP4, MOV, etc. up to 50MB'}
                              </p>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                 <h3 className="font-semibold text-lg">Translation Preferences</h3>
                  <FormField
                    control={form.control}
                    name="targetLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={form.watch('autoDetect')}>
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
                    name="autoDetect"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                         <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                          </FormControl>
                        <FormLabel className="font-normal">Auto detect language (AI)</FormLabel>
                      </FormItem>
                    )}
                  />
              </div>
            )}

            {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                    <h3 className="font-semibold text-lg">Voice and Quality</h3>
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
                    <Button variant="outline" className="w-full" type="button" disabled>
                      <Play className="mr-2 h-4 w-4" /> Preview Voice
                    </Button>
                    <FormField
                      control={form.control}
                      name="quality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality</FormLabel>
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
                           <FormDescription className="flex items-center gap-1 text-xs"><Info className="w-3 h-3"/> Higher quality takes more time</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            )}

          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
            >
              <ArrowLeft/> Back
            </Button>
            {step < 3 ? (
                <Button
                    type="button"
                    onClick={() => setStep(s => s + 1)}
                    disabled={(step === 1 && !form.watch('video'))}
                >
                    Next <ArrowRight/>
                </Button>
            ) : (
                <Button
                  type="submit"
                  disabled={status === 'processing' || !form.formState.isValid}
                >
                  {status === 'processing' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Start Translation
                </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
