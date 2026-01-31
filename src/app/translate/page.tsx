import { VideoTranslator } from '@/components/video-translator';
import { Header } from '@/components/header';

export default function TranslatePage() {
  return (
    <div className="min-h-screen flex flex-col app-gradient-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <VideoTranslator />
      </main>
    </div>
  );
}
