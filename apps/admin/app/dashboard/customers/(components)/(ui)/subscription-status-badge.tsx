import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Mail, MessageSquare } from 'lucide-react'

type SubscriptionType = "email" | "sms"

interface SubscriptionStatusBadgeProps {
  type: SubscriptionType
  isSubscribed: boolean
}

export function SubscriptionStatusBadge({ type, isSubscribed }: SubscriptionStatusBadgeProps) {
  const statusConfig = {
    label: isSubscribed ? "Subscribed" : "Unsubscribed",
    className: isSubscribed
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize",
        statusConfig.className
      )}
    >
      {type === "email" ? (
        <Mail className="w-3 h-3 flex-shrink-0" />
      ) : (
        <MessageSquare className="w-3 h-3 flex-shrink-0" />
      )}
      <span className="whitespace-nowrap">{statusConfig.label}</span>
    </Badge>
  )
}