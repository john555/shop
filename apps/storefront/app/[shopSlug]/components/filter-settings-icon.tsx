import { Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface FilterSettingsIconProps {
  onClick: () => void
  showFilters: boolean
}

export function FilterSettingsIcon({ onClick, showFilters }: FilterSettingsIconProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="hover:bg-secondary/20 transition-colors duration-200 flex items-center space-x-2"
    >
      <Settings className="h-5 w-5" />
      <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
    </Button>
  )
}

