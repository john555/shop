'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Category, Collection } from '@/types/api'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface ProductFiltersProps {
  categories: Category[]
  collections: Collection[]
  selectedCategory: string | null
  selectedCollection: string | null
  selectedTags: string[]
  onUpdateFilters: (filters: any) => void
}

export function ProductFilters({
  categories,
  collections,
  selectedCategory,
  selectedCollection,
  selectedTags,
  onUpdateFilters
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategory || 'all')
  const [selectedCollectionId, setSelectedCollectionId] = useState(selectedCollection || 'all')
  const [selectedTagsState, setSelectedTagsState] = useState<string[]>(selectedTags)
  const [hasChanges, setHasChanges] = useState(false)
  const [canReset, setCanReset] = useState(false);

  const allTags = ['eco-friendly', 'energy-efficient', 'recycled', 'sustainable', 'innovative']

  useEffect(() => {
    setSelectedCategoryId(selectedCategory || 'all')
    setSelectedCollectionId(selectedCollection || 'all')
    setSelectedTagsState(selectedTags)
  }, [selectedCategory, selectedCollection, selectedTags])

  useEffect(() => {
    const hasChanges = 
      selectedCategoryId !== (selectedCategory || 'all') ||
      selectedCollectionId !== (selectedCollection || 'all') ||
      JSON.stringify(selectedTagsState) !== JSON.stringify(selectedTags);
    setHasChanges(hasChanges);

    const canReset = 
      selectedCategoryId !== 'all' ||
      selectedCollectionId !== 'all' ||
      selectedTagsState.length > 0;
    setCanReset(canReset);
  }, [selectedCategoryId, selectedCollectionId, selectedTagsState, selectedCategory, selectedCollection, selectedTags])

  const applyFilters = () => {
    const filters = {
      category: selectedCategoryId !== 'all' ? selectedCategoryId : null,
      collection: selectedCollectionId !== 'all' ? selectedCollectionId : null,
      tags: selectedTagsState,
      search: ''
    }
    onUpdateFilters(filters)
  }

  const resetFilters = () => {
    setSelectedCategoryId('all')
    setSelectedCollectionId('all')
    setSelectedTagsState([])
    onUpdateFilters({
      category: null,
      collection: null,
      tags: [],
      search: ''
    })
  }

  const toggleTag = (tag: string) => {
    setSelectedTagsState(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Select
            value={selectedCategoryId}
            onValueChange={(value) => setSelectedCategoryId(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={selectedCollectionId}
            onValueChange={(value) => setSelectedCollectionId(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Collections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collections</SelectItem>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTagsState.includes(tag) ? "default" : "outline"}
              className="cursor-pointer text-sm py-1 px-3"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={applyFilters} size="sm" disabled={!hasChanges}>Apply Filters</Button>
        <Button onClick={resetFilters} variant="outline" size="sm" disabled={!canReset}>Reset Filters</Button>
      </div>
    </div>
  )
}

