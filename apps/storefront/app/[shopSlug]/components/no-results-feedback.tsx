import { Search, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface NoResultsFeedbackProps {
  onResetFilters: () => void
}

export function NoResultsFeedback({ onResetFilters }: NoResultsFeedbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No products found</h2>
      <p className="text-muted-foreground mb-6">
        We couldn't find any products matching your current filters.
      </p>
      <Button onClick={onResetFilters} variant="outline" className="flex items-center">
        <RefreshCw className="h-4 w-4 mr-2" />
        Reset Filters
      </Button>
    </div>
  )
}

