'use client';
import { useUser, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Timestamp } from 'firebase/firestore';
import { Download, Loader2 } from 'lucide-react';
import React from 'react';
import jsPDF from 'jspdf';

interface HistoryItem {
  id: string;
  videoName: string;
  targetLanguage: string;
  createdAt: Timestamp;
  translatedText: string;
}

function HistoryContents({ userId }: { userId: string }) {
  const { data: history, isLoading } = useCollection<HistoryItem>(`users/${userId}/history`);

  const generatePdf = (text: string, fileName: string) => {
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;
    const textLines = doc.splitTextToSize(text, maxLineWidth);

    let y = 20;
    const lineHeight = 8;

    textLines.forEach((line: string) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    doc.save(`${fileName}.pdf`);
  };


  if (isLoading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!history || history.length === 0) {
    return <p>Your past translations will appear here.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Video</TableHead>
          <TableHead>Language</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Download</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis()).map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.videoName}</TableCell>
            <TableCell>{item.targetLanguage}</TableCell>
            <TableCell>{item.createdAt ? item.createdAt.toDate().toLocaleDateString() : 'N/A'}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => generatePdf(item.translatedText, `${item.videoName.split('.')[0]}_${item.targetLanguage}`)}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


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
             <HistoryContents userId={user.uid} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
