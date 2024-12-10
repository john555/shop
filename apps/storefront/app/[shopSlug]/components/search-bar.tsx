'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Search, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createStoreFrontUrl } from '@/lib/common/url';

export function SearchBar() {
  const shopSlug = useParams().shopSlug as string;
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [recentSearches, setRecentSearches] = useState([
    {
      term: 'wireless earbuds',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      term: 'eco friendly phone case',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
    },
    {
      term: 'solar charger',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
    },
  ]);

  const trendingSearches = [
    'recycled tech',
    'sustainable gadgets',
    'eco friendly gifts',
    'green electronics',
    'energy saving devices',
  ];

  useEffect(() => {
    const currentSearchTerm = searchParams.get('search');
    if (currentSearchTerm) {
      setSearchTerm(decodeURIComponent(currentSearchTerm));
    } else {
      setSearchTerm('');
    }
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const setExpanded = useCallback((expanded: boolean) => {
    setIsExpanded(expanded);
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, []);

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      router.push(
        createStoreFrontUrl(shopSlug, `/products?${params.toString()}`)
      );
    },
    [router, searchParams]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        handleSearch(searchTerm);
        setRecentSearches((prev) =>
          [
            {
              term: searchTerm,
              timestamp: new Date(),
            },
            ...prev,
          ].slice(0, 5)
        );
        setExpanded(false);
      }
    },
    [searchTerm, handleSearch, setExpanded]
  );

  const removeRecentSearch = useCallback((searchTerm: string) => {
    setRecentSearches((prev) =>
      prev.filter((search) => search.term !== searchTerm)
    );
  }, []);

  const handleSearchClick = useCallback(
    (term: string) => {
      setSearchTerm(term);
      handleSearch(term);
      setExpanded(false);
    },
    [handleSearch, setExpanded]
  );

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <form
        onSubmit={handleSubmit}
        className={`relative w-full ${isExpanded ? 'z-50' : ''}`}
      >
        <Input
          ref={inputRef}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Search everything at Green Gadgets online and in store"
          className="h-11 rounded-full bg-background pl-4 pr-12 w-full"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>

      {isExpanded && (
        <div className="fixed inset-x-0 top-0 z-40 bg-background w-full sm:absolute sm:inset-x-auto sm:left-0 sm:right-0 sm:top-full sm:w-auto">
          <div className="flex items-center justify-between p-4 sm:hidden">
            <h2 className="text-lg font-semibold">Search</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Cancel search</span>
            </Button>
          </div>
          <Card className="rounded-none sm:rounded-md sm:mt-2">
            <ScrollArea className="h-[calc(100vh-4rem)] sm:h-[400px]">
              <div className="p-4 space-y-6">
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Recent searches</h3>
                    <div className="space-y-2">
                      {recentSearches.map((search) => (
                        <div
                          key={search.term}
                          className="flex items-center justify-between group"
                        >
                          <button
                            onClick={() => handleSearchClick(search.term)}
                            className="flex items-center space-x-2 hover:text-primary"
                          >
                            <Clock className="h-4 w-4" />
                            <span>{search.term}</span>
                          </button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeRecentSearch(search.term)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove search</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-3">Trending</h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearchClick(term)}
                        className="px-4 py-2 rounded-full border hover:bg-accent transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  );
}
