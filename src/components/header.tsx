import { Film } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-sm">
            <Film className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-headline font-bold text-primary">
            Video Translator
          </h1>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
            <Button asChild>
                <Link href="#upload">Upload</Link>
            </Button>
        </nav>
      </div>
    </header>
  );
}
