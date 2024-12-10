'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  Menu,
  ShoppingCart,
  User,
  ChevronDown,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchBar } from './search-bar';
import { StoreLogo } from './store-logo';
import Link from 'next/link';
import { createStoreFrontUrl } from '@/lib/common/url';

interface HeaderProps {
  storeName: string;
  logo: string;
  primaryColor: string;
}

export function Header({ storeName, logo }: HeaderProps) {
  const shopSlug = useParams().shopSlug as string;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const { setTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      const categoryName =
        categories.find((c) => c.id === category)?.name || 'All Categories';
      setSelectedCategory(categoryName);
    } else {
      setSelectedCategory('All Categories');
    }
  }, [searchParams]);

  const categories = [
    {
      id: 'all',
      name: 'All Categories',
      href: createStoreFrontUrl(shopSlug, '/products'),
    },
    {
      id: 'electronics',
      name: 'Electronics',
      href: createStoreFrontUrl(shopSlug, '/products?category=electronics'),
    },
    {
      id: 'home-garden',
      name: 'Home & Garden',
      href: createStoreFrontUrl(shopSlug, '/products?category=home-garden'),
    },
    {
      id: 'fashion',
      name: 'Fashion',
      href: createStoreFrontUrl(shopSlug, '/products?category=fashion'),
    },
    {
      id: 'toys',
      name: 'Toys',
      href: createStoreFrontUrl(shopSlug, '/products?category=toys'),
    },
    {
      id: 'sports',
      name: 'Sports',
      href: createStoreFrontUrl(shopSlug, '/products?category=sports'),
    },
    {
      id: 'auto',
      name: 'Auto',
      href: createStoreFrontUrl(shopSlug, '/products?category=auto'),
    },
  ];

  const handleCategorySelect = useCallback(
    (category: { id: string; name: string; href: string }) => {
      setSelectedCategory(category.name);
      router.push(category.href);
    },
    [router]
  );

  if (!mounted) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex items-center justify-between h-full gap-4">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="py-2 text-lg hover:text-primary"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setSelectedCategory(category.name);
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <StoreLogo storeName={storeName} logo={logo} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hidden items-center gap-2 md:flex"
            >
              <span className="text-sm">{selectedCategory}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onSelect={() => handleCategorySelect(category)}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex flex-1 items-center gap-2">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/signin">Sign In</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/signup">Create Account</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={createStoreFrontUrl(shopSlug, '/account')}>
                  My Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={createStoreFrontUrl(shopSlug, '/orders')}>
                  Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-default">
                <span className="font-semibold">Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-default focus:bg-background">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm">Theme</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-4 w-4" />
                      <span className="sr-only">Light theme</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-4 w-4" />
                      <span className="sr-only">Dark theme</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setTheme('system')}
                    >
                      <Laptop className="h-4 w-4" />
                      <span className="sr-only">System theme</span>
                    </Button>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Shopping cart</span>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              0
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
