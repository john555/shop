import React from 'react';
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { OrderStatus } from '@/types/api';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Cancelled:
        return { label: 'Cancelled', color: 'bg-red-500 dark:bg-red-700 text-white' };
      case OrderStatus.Delivered:
        return { label: 'Delivered', color: 'bg-green-500 dark:bg-green-700 text-white' };
      case OrderStatus.Draft:
        return { label: 'Draft', color: 'bg-gray-500 dark:bg-gray-700 text-white' };
      case OrderStatus.Fulfilled:
        return { label: 'Fulfilled', color: 'bg-blue-500 dark:bg-blue-700 text-white' };
      case OrderStatus.Paid:
        return { label: 'Paid', color: 'bg-green-500 dark:bg-green-700 text-white' };
      case OrderStatus.Pending:
        return { label: 'Pending', color: 'bg-yellow-500 dark:bg-yellow-700 text-white' };
      case OrderStatus.Processing:
        return { label: 'Processing', color: 'bg-purple-500 dark:bg-purple-700 text-white' };
      case OrderStatus.Refunded:
        return { label: 'Refunded', color: 'bg-orange-500 dark:bg-orange-700 text-white' };
      case OrderStatus.Shipped:
        return { label: 'Shipped', color: 'bg-indigo-500 dark:bg-indigo-700 text-white' };
    }
  };

  const { label, color } = getStatusConfig(status);

  return (
    <Badge 
      variant="outline"
      className={cn(
        "text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors",
        color,
        className
      )}
    >
      {label}
    </Badge>
  );
}
