import { Header } from '@/components/header';
import { VideoTranslator } from '@/components/video-translator';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <VideoTranslator />
      </main>
    </div>
  );
}
