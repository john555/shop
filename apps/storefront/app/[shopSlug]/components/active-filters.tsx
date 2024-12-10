import { X, Tag, Grid, Boxes, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string;
  name: string;
}

interface Collection {
  id: string;
  name: string;
}

interface ActiveFiltersProps {
  activeFilters: {
    category?: string
    collection?: string
    tags: string[]
    search?: string
  }
  onClearFilters: () => void
  categories: Category[]
  collections: Collection[]
  onRemoveFilter: (filterType: string, value?: string) => void
}

export function ActiveFilters({ activeFilters, onClearFilters, onRemoveFilter, categories, collections }: ActiveFiltersProps) {
  const hasActiveFilters = activeFilters.category || activeFilters.collection || activeFilters.tags.length > 0 || activeFilters.search

  if (!hasActiveFilters) {
    return null
  }

  const getCategoryName = (id: string) => categories.find(cat => cat.id === id)?.name || id
  const getCollectionName = (id: string) => collections.find(col => col.id === id)?.name || id

  return (
    <div className="bg-secondary/10 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">Active Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onClearFilters()}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.category && (
          <Badge variant="outline" className="px-3 py-1 bg-blue-100 dark:bg-blue-900">
            <Grid className="h-4 w-4 mr-2" />
            {getCategoryName(activeFilters.category)}
            <Button variant="ghost" size="sm" className="ml-2 p-0 h-4 w-4" onClick={() => onRemoveFilter('category')}>
              <X className="h-4 w-4" />
            </Button>
          </Badge>
        )}
        {activeFilters.collection && (
          <Badge variant="outline" className="px-3 py-1 bg-green-100 dark:bg-green-900">
            <Boxes className="h-4 w-4 mr-2" />
            {getCollectionName(activeFilters.collection)}
            <Button variant="ghost" size="sm" className="ml-2 p-0 h-4 w-4" onClick={() => onRemoveFilter('collection')}>
              <X className="h-4 w-4" />
            </Button>
          </Badge>
        )}
        {activeFilters.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900">
            <Tag className="h-4 w-4 mr-2" />
            {tag}
            <Button variant="ghost" size="sm" className="ml-2 p-0 h-4 w-4" onClick={() => onRemoveFilter('tags', tag)}>
              <X className="h-4 w-4" />
            </Button>
          </Badge>
        ))}
        {activeFilters.search && (
          <Badge variant="outline" className="px-3 py-1 bg-purple-100 dark:bg-purple-900">
            <Search className="h-4 w-4 mr-2" />
            {activeFilters.search}
            <Button variant="ghost" size="sm" className="ml-2 p-0 h-4 w-4" onClick={() => onRemoveFilter('search')}>
              <X className="h-4 w-4" />
            </Button>
          </Badge>
        )}
      </div>
    </div>
  )
}

