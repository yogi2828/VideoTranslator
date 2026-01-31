'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';

export default function HistoryPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Translation History</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your past translations will appear here.</p>
            {/* History items will be rendered here */}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
