import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PaymentStatus } from '@/types/api';


interface OrderPaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function OrderPaymentStatusBadge({ status, className }: OrderPaymentStatusBadgeProps) {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Completed:
        return { label: 'Completed', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' };
      case PaymentStatus.Failed:
        return { label: 'Failed', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' };
      case PaymentStatus.Pending:
        return { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' };
      case PaymentStatus.Refunded:
        return { label: 'Refunded', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' };
      default:
        return { label: 'Unknown', className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100' };
    }
  };

  const { label, className: statusClassName } = getStatusConfig(status);

  return (
    <Badge 
      variant="outline"
      className={cn(
        "text-xs font-medium px-2.5 py-0.5 rounded-full capitalize",
        statusClassName,
        className
      )}
    >
      {label.toLowerCase()}
    </Badge>
  );
}

