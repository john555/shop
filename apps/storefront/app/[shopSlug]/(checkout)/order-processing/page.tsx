'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { createStoreFrontUrl } from '@/lib/common/url';

export default function OrderProcessingPage() {
  const shopSlug = useParams().shopSlug as string;
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          router.push(createStoreFrontUrl(shopSlug, '/order-status'));
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [router]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 pt-24 flex flex-col items-center justify-center">
      <div className="text-center space-y-6 max-w-md w-full">
        <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
        <h1 className="text-3xl font-bold">Processing Your Order</h1>
        <Progress value={progress} className="w-full" />
        <p className="text-lg text-muted-foreground">
          Please wait while we process your order...
        </p>
      </div>
    </main>
  );
}
