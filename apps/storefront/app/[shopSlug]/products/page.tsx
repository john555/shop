'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductFilters } from '../components/product-filters';
import { Pagination } from '../components/pagination';
import { FilterSettingsIcon } from '../components/filter-settings-icon';
import { ActiveFilters } from '../components/active-filters';
import { NoResultsFeedback } from '../components/no-results-feedback';
import { ProductCard } from '../components/product-card';
import { categories, collections, products } from '../utils/mock-data';
import { Tag } from '@/types/api';

const ITEMS_PER_PAGE = 12;

export default function ProductListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const activeFilters = useMemo(
    () => ({
      category: searchParams.get('category') || undefined,
      collection: searchParams.get('collection') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
      search: searchParams.get('search') || undefined,
    }),
    [searchParams]
  );

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeFilters.category) {
      result = result.filter(
        (product) => product.category?.id === activeFilters.category
      );
    }

    if (activeFilters.collection) {
      result = result.filter((product) =>
        product.collections?.some(
          (c) => c.toString() === activeFilters.collection
        )
      );
    }

    if (activeFilters.tags.length > 0) {
      result = result.filter((product) =>
        activeFilters.tags.every((tag) => product.tags?.includes(tag as string))
      );
    }

    if (activeFilters.search) {
      const lowercasedTerm = activeFilters.search.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(lowercasedTerm) ||
          product.description?.toLowerCase().includes(lowercasedTerm)
      );
    }

    return result;
  }, [activeFilters]);

  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, searchParams]);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const updateFilters = useCallback(
    (newFilters: typeof activeFilters) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, Array.isArray(value) ? value.join(',') : value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const removeFilter = useCallback(
    (filterType: string, value?: string) => {
      const params = new URLSearchParams(searchParams);

      switch (filterType) {
        case 'category':
        case 'collection':
        case 'search':
          params.delete(filterType);
          break;
        case 'tags':
          if (value) {
            const currentTags = params.get('tags')?.split(',') || [];
            const updatedTags = currentTags.filter((tag) => tag !== value);
            if (updatedTags.length > 0) {
              params.set('tags', updatedTags.join(','));
            } else {
              params.delete('tags');
            }
          }
          break;
      }

      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('collection');
    params.delete('tags');
    params.delete('search');
    router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  }, [router, searchParams]);

  return (
    <div className="flex-grow container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {activeFilters.search
            ? `Search Results for "${activeFilters.search}"`
            : 'Our Products'}
        </h1>
        <FilterSettingsIcon onClick={toggleFilters} showFilters={showFilters} />
      </div>
      <ActiveFilters
        activeFilters={activeFilters}
        onClearFilters={clearFilters}
        onRemoveFilter={removeFilter}
        categories={categories}
        collections={collections}
      />
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showFilters ? 'opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'
        }`}
      >
        <div className="bg-background p-4 rounded-lg shadow">
          <ProductFilters
            categories={categories}
            collections={collections}
            selectedCategory={activeFilters.category || null}
            selectedCollection={activeFilters.collection || null}
            selectedTags={activeFilters.tags}
            onUpdateFilters={updateFilters}
          />
        </div>
      </div>
      {filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                // @ts-expect-error missing properties
                product={product}
                buttonColor="#10B981"
              />
            ))}
          </div>
          {pageCount > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={pageCount}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <NoResultsFeedback onResetFilters={clearFilters} />
      )}
    </div>
  );
}
