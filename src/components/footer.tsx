import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Video Translator. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
          <Link href="#" className="hover:text-foreground">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
