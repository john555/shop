import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProductStatus } from '@/types/admin-api';

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const statusConfig: Record<
    ProductStatus,
    { label: string; className: string }
  > = {
    [ProductStatus.Active]: {
      label: 'Active',
      className:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    [ProductStatus.Draft]: {
      label: 'Draft',
      className:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    },
    [ProductStatus.Archived]: {
      label: 'Archived',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    },
  };

  const { label, className } = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-medium px-2.5 py-0.5 rounded-full capitalize',
        className
      )}
    >
      {label}
    </Badge>
  );
}
