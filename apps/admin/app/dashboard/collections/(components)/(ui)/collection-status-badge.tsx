import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CollectionStatusBadgeProps {
  isActive: boolean
}

export function CollectionStatusBadge({ isActive }: CollectionStatusBadgeProps) {
  const statusConfig = {
    label: isActive ? "Active" : "Inactive",
    className: isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium px-2.5 py-0.5 rounded-full capitalize",
        statusConfig.className
      )}
    >
      {statusConfig.label}
    </Badge>
  )
}