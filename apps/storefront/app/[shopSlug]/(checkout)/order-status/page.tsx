'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Receipt,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { createStoreFrontUrl } from '@/lib/common/url';

type StatusType = 'completed' | 'pending' | 'processing' | 'failed';

interface OrderStatus {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  timestamp: string;
  status: StatusType;
  errorMessage?: string;
}

const getStatusColor = (status: StatusType) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500 dark:bg-green-600 text-white';
    case 'processing':
      return 'bg-yellow-500 dark:bg-yellow-600 text-white';
    case 'failed':
      return 'bg-red-500 dark:bg-red-600 text-white';
    default:
      return 'bg-muted';
  }
};

const getStatusBadgeVariant = (
  status: StatusType
): 'default' | 'destructive' | 'secondary' | 'outline' => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'processing':
      return 'outline';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusText = (status: StatusType) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'processing':
      return 'Processing';
    case 'failed':
      return 'Failed';
    default:
      return 'Pending';
  }
};

export default function OrderStatusPage({
  params,
}: {
  params: { shopSlug: string };
}) {
  const shopSlug = params.shopSlug as string;
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([
    {
      id: 'placed',
      title: 'Order Placed',
      icon: Receipt,
      description: 'Order has been placed successfully',
      timestamp: '9 Jan 2025 at 7:45 am',
      status: 'completed',
    },
    {
      id: 'payment',
      title: 'Payment Received',
      icon: CreditCard,
      description: 'Payment for Order has been successfully processed',
      timestamp: '9 Jan 2025 at 7:46 am',
      status: 'completed',
    },
    {
      id: 'processing',
      title: 'Order Processed',
      icon: Package,
      description: 'Order is being processed and prepared for shipment',
      timestamp: '9 Jan 2025 at 7:47 am',
      status: 'processing',
    },
    {
      id: 'shipped',
      title: 'Order Shipped',
      icon: Truck,
      description: 'Order will be shipped once processing is complete',
      timestamp: '9 Jan 2025 at 7:48 am',
      status: 'pending',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      icon: CheckCircle,
      description: 'Awaiting delivery',
      timestamp: '9 Jan 2025 at 7:49 am',
      status: 'pending',
    },
  ]);

  useEffect(() => {
    // Simulate order processing with potential failure
    const simulateOrderProgress = async () => {
      // Step 1: Start processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setOrderStatuses((prev) =>
        prev.map((status) =>
          status.id === 'processing'
            ? {
                ...status,
                description: 'Verifying inventory and preparing items',
                status: 'processing',
              }
            : status
        )
      );

      // Step 2: Simulate a processing error
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setOrderStatuses((prev) =>
        prev.map((status) =>
          status.id === 'processing'
            ? {
                ...status,
                description:
                  'Unable to process order due to inventory shortage',
                status: 'failed',
                errorMessage: 'One or more items are currently out of stock',
              }
            : status
        )
      );

      // Step 3: Simulate resolution after 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setOrderStatuses((prev) =>
        prev.map((status) =>
          status.id === 'processing'
            ? {
                ...status,
                description:
                  'Order has been processed and is being prepared for shipment',
                status: 'completed',
                errorMessage: undefined,
              }
            : status
        )
      );

      // Step 4: Update shipping status
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setOrderStatuses((prev) =>
        prev.map((status) =>
          status.id === 'shipped'
            ? {
                ...status,
                description: 'Order has been shipped and is on its way',
                timestamp: new Date().toLocaleString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                }),
                status: 'processing',
              }
            : status
        )
      );
    };

    simulateOrderProgress();
  }, []);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Order Timeline</h1>
        <p className="text-lg text-muted-foreground mb-8">Track Order status</p>

        <div className="relative">
          <div className="absolute left-[27px] top-[40px] bottom-8 w-[2px] bg-border" />

          {orderStatuses.map((status, index) => {
            const IconComponent = status.icon;

            return (
              <div key={status.id} className="relative z-10 flex gap-6 pb-8">
                <div
                  className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300',
                    getStatusColor(status.status)
                  )}
                >
                  {status.status === 'failed' ? (
                    <AlertCircle className="w-6 h-6" />
                  ) : (
                    <IconComponent className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-semibold">{status.title}</h3>
                    <Badge
                      variant={getStatusBadgeVariant(status.status)}
                      className="rounded-md"
                    >
                      {getStatusText(status.status)}
                    </Badge>
                  </div>
                  <time className="text-muted-foreground text-sm block mb-2">
                    {status.timestamp}
                  </time>
                  <p
                    className={cn(
                      'text-muted-foreground',
                      status.status === 'failed' &&
                        'text-red-500 dark:text-red-400'
                    )}
                  >
                    {status.description}
                  </p>
                  {status.errorMessage && (
                    <div className="mt-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/50 p-2 rounded-md flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {status.errorMessage}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button asChild>
            <Link href={createStoreFrontUrl(shopSlug, '/products')}>
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
