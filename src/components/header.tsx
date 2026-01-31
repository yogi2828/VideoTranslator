import { Film } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-sm">
          <Film className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-headline font-bold text-primary">
          Video Translator
        </h1>
      </div>
    </header>
  );
}
