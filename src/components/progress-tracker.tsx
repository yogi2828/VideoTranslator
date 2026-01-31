'use client';

import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type ProgressStatus =
  | 'pending'
  | 'in-progress'
  | 'complete'
  | 'error';

export interface ProgressStep {
  id: string;
  label: string;
  status: ProgressStatus;
}

const statusIcons: Record<ProgressStatus, React.ReactNode> = {
  pending: <Circle className="h-5 w-5 text-muted-foreground" />,
  'in-progress': <Loader2 className="h-5 w-5 animate-spin text-primary" />,
  complete: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-destructive" />,
};

interface ProgressTrackerProps {
  steps: ProgressStep[];
}

export function ProgressTracker({ steps }: ProgressTrackerProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-center">Processing Video</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center space-x-4">
              <div>{statusIcons[step.status]}</div>
              <p
                className={`text-lg ${
                  step.status === 'in-progress' ? 'font-semibold text-primary' : ''
                } ${step.status === 'pending' ? 'text-muted-foreground' : ''}`}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
