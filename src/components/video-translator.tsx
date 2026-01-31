'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UploadCloud, ArrowRight, ArrowLeft, Download, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LANGUAGES, VOICES, VOICE_MAP } from '@/lib/constants';
import { transcribeUploadedVideo } from '@/ai/flows/transcribe-uploaded-video';
import { translateTranscribedText } from '@/ai/flows/translate-transcribed-text';
import { generateTranslatedAudio } from '@/ai/flows/generate-translated-audio';
import { useUser, useFirestore } from '@/firebase';
import { saveTranslationHistory } from '@/firebase/firestore/history';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import jsPDF from 'jspdf';

const formSchema = z.object({
  video: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'A video file is required.')
    .refine(
      (files) => files?.[0]?.type.startsWith('video/'),
      'Only video files are allowed.'
    )
    .refine(
      (files) => files?.[0]?.size <= 50 * 1024 * 1024,
      'File size must be 50MB or less.'
    ),
  targetLanguage: z.string().min(1, 'Please select a language.'),
  voice: z.string().min(1, 'Please select a voice.'),
});
type FormValues = z.infer<typeof formSchema>;

const ProcessingStep = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 text-muted-foreground">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span>{label}...</span>
  </div>
);

export function VideoTranslator() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [formStep, setFormStep] = useState(1);
  
  const [transcription, setTranscription] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { toast } = useToast();
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetLanguage: 'es',
      voice: 'male',
    },
  });
  const videoFile = form.watch('video')?.[0];

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const resetState = () => {
    setStatus('idle');
    setFormStep(1);
    setTranscription('');
    setTranslatedText('');
    setVideoUrl(null);
    setAudioUrl(null);
    setIsPlaying(false);
    form.reset();
  }

  const onSubmit = async (data: FormValues) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Authentication Required', description: 'Please log in to translate videos.' });
      router.push('/login');
      return;
    }

    setStatus('processing');
    const videoFile = data.video[0];
    const localVideoUrl = URL.createObjectURL(videoFile);
    setVideoUrl(localVideoUrl);

    try {
      const videoDataUri = await readFileAsDataURL(videoFile);

      const { transcription } = await transcribeUploadedVideo({ videoDataUri });
      setTranscription(transcription);

      const { translatedText } = await translateTranscribedText({
        text: transcription,
        targetLanguage: data.targetLanguage,
      });
      setTranslatedText(translatedText);
      
      const voiceName = VOICE_MAP[data.targetLanguage as keyof typeof VOICE_MAP]?.[data.voice as keyof typeof VOICE_MAP['en']] || VOICE_MAP['en']['male'];
      const { audioDataUri } = await generateTranslatedAudio({
        translatedText,
        voiceName: voiceName,
      });
      setAudioUrl(audioDataUri);
      
      saveTranslationHistory(firestore, user.uid, {
        videoName: videoFile.name,
        translatedText: translatedText,
        targetLanguage: data.targetLanguage,
      });

      setStatus('success');
      toast({ title: 'Translation Complete!', description: 'Your video has been successfully processed.' });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error(error);
      setStatus('error');
      toast({ variant: 'destructive', title: 'Processing Failed', description: `There was a problem translating your video. ${errorMessage}` });
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current && audioRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        audioRef.current.pause();
      } else {
        videoRef.current.currentTime = 0;
        audioRef.current.currentTime = 0;
        videoRef.current.play();
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    
    const handleAudioEnd = () => {
      setIsPlaying(false);
      if(video) video.currentTime = 0;
    };
    audio?.addEventListener('ended', handleAudioEnd);

    return () => audio?.removeEventListener('ended', handleAudioEnd);
  }, [audioUrl]);

  const generatePdf = () => {
    if (!translatedText) return;
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'normal');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const textLines = doc.splitTextToSize(translatedText, pageWidth - margin * 2);
    doc.text(textLines, margin, 20);
    doc.save('translation.pdf');
  };

  if (isUserLoading) {
    return <Card className="w-full max-w-lg"><CardContent className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {status === 'idle' && (
        <Card className="w-full max-w-lg mx-auto shadow-2xl bg-card text-card-foreground">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Video Translator</CardTitle>
                 <div className="flex items-center justify-center gap-4 pt-4">
                  {[1, 2].map((s) => (
                    <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s === formStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {s}
                    </div>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 min-h-[320px]">
                {formStep === 1 && (
                   <div className="space-y-4 animate-in fade-in">
                      <h3 className="font-semibold text-lg">1. Upload your video</h3>
                      <FormField control={form.control} name="video" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-input">
                                <div className="space-y-1 text-center">
                                  <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
                                  <div className="flex text-sm text-muted-foreground">
                                    <Input id="file-upload" type="file" accept="video/*" className="sr-only" onChange={(e) => field.onChange(e.target.files)} />
                                    <label htmlFor="file-upload" className="relative font-medium rounded-md cursor-pointer text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring">
                                      <span>Upload a file</span>
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{videoFile?.name || 'MP4, MOV, etc. up to 50MB'}</p>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                   </div>
                )}
                
                {formStep === 2 && (
                  <div className="space-y-4 animate-in fade-in">
                     <h3 className="font-semibold text-lg">2. Translation & Voice</h3>
                      <FormField control={form.control} name="targetLanguage" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select a language" /></SelectTrigger></FormControl>
                              <SelectContent>{LANGUAGES.map((lang) => (<SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>))}</SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                      <FormField control={form.control} name="voice" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Voice</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select a voice" /></SelectTrigger></FormControl>
                              <SelectContent>{VOICES.map((voice) => (<SelectItem key={voice.value} value={voice.value}>{voice.label}</SelectItem>))}</SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setFormStep(s => s - 1)} disabled={formStep === 1}><ArrowLeft/> Back</Button>
                {formStep < 2 ? (
                    <Button type="button" onClick={() => setFormStep(s => s + 1)} disabled={!videoFile} >Next <ArrowRight/></Button>
                ) : (
                    <Button type="submit" disabled={status === 'processing' || !form.formState.isValid}>
                      {status === 'processing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Start Translation
                    </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}

      {(status === 'processing' || status === 'success' || status === 'error') && videoUrl && (
        <>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Your Translation</CardTitle>
              <CardDescription>{videoFile?.name}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black group">
                    <video ref={videoRef} src={videoUrl} muted playsInline className="w-full h-full object-contain" />
                    {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="icon" variant="ghost" className="h-20 w-20 text-white hover:bg-white/20 hover:text-white" onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'} disabled={!audioUrl}>
                        {isPlaying ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12" />}
                      </Button>
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button onClick={generatePdf} size="lg" className="w-full" disabled={!translatedText}>
                        <Download className="mr-2 h-4 w-4" /> PDF
                      </Button>
                      <Button asChild size="lg" className="w-full" disabled={!audioUrl}>
                        <a href={audioUrl || '#'} download="translated_audio.wav">
                          <Download className="mr-2 h-4 w-4" /> WAV
                        </a>
                      </Button>
                    </div>
              </div>

              <div className="space-y-6">
                <div>
                  <FormLabel>Original Transcription</FormLabel>
                  {transcription ? (
                    <Textarea readOnly value={transcription} className="mt-2 h-36" />
                  ) : (
                    <ProcessingStep label="Extracting and transcribing audio" />
                  )}
                </div>
                 <div>
                  <FormLabel>Translated Text ({form.getValues('targetLanguage')})</FormLabel>
                  {translatedText ? (
                    <Textarea readOnly value={translatedText} className="mt-2 h-36" />
                  ) : (
                    transcription ? <ProcessingStep label="Translating text" /> : <p className="text-sm text-muted-foreground mt-2">Waiting for transcription...</p>
                  )}
                </div>
                 <div>
                  <FormLabel>Generated Audio</FormLabel>
                   {!audioUrl && status === 'processing' && translatedText ? (
                    <ProcessingStep label="Generating audio" />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      {audioUrl ? 'Audio generated. Press play on the video.' : 'Waiting for translation...'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
           <div className="text-center">
              <Button onClick={resetState} variant="outline">Translate Another Video</Button>
           </div>
        </>
      )}
    </div>
  );
}
