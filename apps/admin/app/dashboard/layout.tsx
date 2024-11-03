'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Bell,
  Laptop,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  Users,
  X,
  Package,
  User,
  LayoutDashboard,
  Box,
  List,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useCurrentUser } from '@/common/hooks/auth';
import { SignInRequired } from '../(auth)/(components)/sign-in-required';
import { CreateStoreRequired } from './(components)/create-store-required';

// Dummy data for search results
const dummySearchResults = {
  orders: [
    { id: 'ORD001', customer: 'John Doe', total: '$150.00' },
    { id: 'ORD002', customer: 'Jane Smith', total: '$275.50' },
    { id: 'ORD003', customer: 'Bob Johnson', total: '$99.99' },
  ],
  products: [
    { id: 'PRD001', name: 'Wireless Earbuds', price: '$79.99' },
    { id: 'PRD002', name: 'Smart Watch', price: '$199.99' },
    { id: 'PRD003', name: 'Bluetooth Speaker', price: '$59.99' },
  ],
  customers: [
    { id: 'CUS001', name: 'Alice Williams', email: 'alice@example.com' },
    { id: 'CUS002', name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 'CUS003', name: 'Diana Miller', email: 'diana@example.com' },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { setTheme } = useTheme();
  const { user, isLoading, signOut } = useCurrentUser();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const userInitials = [user?.firstName?.[0], user?.lastName?.[0]].join('');

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(e.target.value.length > 0);
  };

  const handleSearchClose = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleSignOut = () => {
    setIsSigningOut(true);
    signOut();
  };

  if (isSigningOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Signing out...
        </p>
      </div>
    );
  }

  if (isLoading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!isLoading && !user) {
    return <SignInRequired />;
  }

  if (!isLoading && !user?.stores?.length) {
    return <CreateStoreRequired />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold">E-commerce</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
          <div className="flex flex-col justify-between h-full overflow-y-auto">
            <nav className="flex-1 space-y-2 p-4">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </Link>
              </Button>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/products">
                    <Package className="mr-2 h-4 w-4" />
                    Products
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-8"
                  asChild
                >
                  <Link href="/dashboard/collections">
                    <List className="mr-2 h-4 w-4" />
                    Collections
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-8"
                  asChild
                >
                  <Link href="/dashboard/inventory">
                    <Box className="mr-2 h-4 w-4" />
                    Inventory
                  </Link>
                </Button>
              </div>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Orders
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/customers">
                  <Users className="mr-2 h-4 w-4" />
                  Customers
                </Link>
              </Button>
            </nav>
            <div className="p-4">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="relative flex items-center justify-between border-b bg-card px-4 py-3">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2 lg:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <div className="relative">
              <div className="relative w-full md:w-[400px]">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search orders, products, customers..."
                  className="w-full pl-8 pr-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1/2 h-full -translate-y-1/2 transform"
                    onClick={handleSearchClose}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>
              {isSearchOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2">
                  <Command
                    className="rounded-lg border shadow-md"
                    style={{
                      width: 'calc(100% + 8rem)',
                      maxWidth: '800px',
                      height: '40vh',
                      maxHeight: '400px',
                    }}
                  >
                    <CommandList className="h-full overflow-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      {dummySearchResults.orders.length > 0 && (
                        <CommandGroup heading="Orders" className="p-2">
                          {dummySearchResults.orders.map((order) => (
                            <CommandItem
                              key={order.id}
                              className="flex items-center justify-between p-2"
                            >
                              <span>{order.customer}</span>
                              <span className="text-sm text-muted-foreground">
                                {order.total}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                      {dummySearchResults.products.length > 0 && (
                        <CommandGroup heading="Products" className="p-2">
                          {dummySearchResults.products.map((product) => (
                            <CommandItem
                              key={product.id}
                              className="flex items-center justify-between p-2"
                            >
                              <span>{product.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {product.price}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                      {dummySearchResults.customers.length > 0 && (
                        <CommandGroup heading="Customers" className="p-2">
                          {dummySearchResults.customers.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              className="flex items-center justify-between p-2"
                            >
                              <span>{customer.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {customer.email}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl ?? ''} alt="User avatar" />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                <DropdownMenuItem className="flex-row items-center">
                  <span className="flex-1">Theme</span>
                  <div className="ml-4 flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-background/80 dark:hover:bg-muted/50"
                            onClick={() => setTheme('light')}
                          >
                            <Sun className="h-4 w-4" />
                            <span className="sr-only">Light theme</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Light</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-background/80 dark:hover:bg-muted/50"
                            onClick={() => setTheme('dark')}
                          >
                            <Moon className="h-4 w-4" />
                            <span className="sr-only">Dark theme</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Dark</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-background/80 dark:hover:bg-muted/50"
                            onClick={() => setTheme('system')}
                          >
                            <Laptop className="h-4 w-4" />
                            <span className="sr-only">System theme</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>System</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background  p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
