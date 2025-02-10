"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  icon: React.ReactNode
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center h-24 w-24 rounded-lg transition-all duration-300 relative",
                selectedCategory === category.id && "bg-primary text-primary-foreground",
                hoveredCategory === category.id && "shadow-lg"
              )}
              onClick={() => onSelectCategory(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: hoveredCategory === category.id ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {category.icon}
              </motion.div>
              <span className="mt-2 text-sm font-medium">{category.name}</span>
              {selectedCategory === category.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                  layoutId="activeCategory"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}

