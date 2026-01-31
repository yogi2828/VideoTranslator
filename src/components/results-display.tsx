'use client';

import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Play, Pause, AudioWaveform } from 'lucide-react';

interface ResultsDisplayProps {
  videoUrl: string;
  translatedText: string;
  audioUrl: string;
}

export function ResultsDisplay({
  videoUrl,
  translatedText,
  audioUrl,
}: ResultsDisplayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current && audioRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        audioRef.current.pause();
      } else {
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
      if(video) {
        video.currentTime = 0;
      }
    };

    audio?.addEventListener('ended', handleAudioEnd);

    return () => {
      audio?.removeEventListener('ended', handleAudioEnd);
    };
  }, []);

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'normal');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const textLines = doc.splitTextToSize(translatedText, pageWidth - margin * 2);
    doc.text(textLines, margin, 20);
    doc.save('translation.pdf');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Translated Video</CardTitle>
          <CardDescription>
            Your translated video is ready. Press play to watch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black group">
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              playsInline
              className="w-full h-full object-contain"
            />
            <audio ref={audioRef} src={audioUrl} className="hidden" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="ghost"
                className="h-20 w-20 text-white hover:bg-white/20 hover:text-white"
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="h-12 w-12" />
                ) : (
                  <Play className="h-12 w-12" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Download Your Media</CardTitle>
          <CardDescription>
            Download the generated translated text and audio files.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={generatePdf} size="lg" className="w-full">
              <FileText />
              Download Translation (PDF)
            </Button>
            <Button asChild size="lg" className="w-full">
              <a href={audioUrl} download="translated_audio.wav">
                <AudioWaveform />
                Download Translated Audio (WAV)
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
