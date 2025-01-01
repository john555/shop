import React from 'react';
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ShipmentStatus } from '@/types/admin-api';

interface OrderShipmentStatusBadgeProps {
  status: ShipmentStatus;
  className?: string;
}

export function OrderShipmentStatusBadge({ status, className }: OrderShipmentStatusBadgeProps) {
  const getStatusConfig = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.Delivered:
        return { label: 'Delivered', color: 'bg-green-500 dark:bg-green-700 text-white' };
      case ShipmentStatus.Failed:
        return { label: 'Failed', color: 'bg-red-500 dark:bg-red-700 text-white' };
      case ShipmentStatus.Pending:
        return { label: 'Pending', color: 'bg-yellow-500 dark:bg-yellow-700 text-white' };
      case ShipmentStatus.Processing:
        return { label: 'Processing', color: 'bg-blue-500 dark:bg-blue-700 text-white' };
      case ShipmentStatus.Shipped:
        return { label: 'Shipped', color: 'bg-purple-500 dark:bg-purple-700 text-white' };
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

