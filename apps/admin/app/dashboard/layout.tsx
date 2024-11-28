'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Menu,
  Search,
  ShoppingCart,
  Users,
  X,
  Package,
  LayoutDashboard,
  Box,
  List,
  Settings,
  Activity,
} from 'lucide-react';
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
import { useIsMobile } from '@/components/hooks/use-mobile';
import { useCurrentUser } from '@/common/hooks/auth';
import { SignInRequired } from '../(auth)/(components)/sign-in-required';
import { CreateStoreRequired } from './(components)/create-store-required';
import { DASHBOARD_SETTINGS_LINK, THEMES } from '@/common/constants';
import { updateUser } from '@/common/actions/user';
import { Theme } from '@/types/api';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/common/apollo';

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

interface NavLink {
  href: string;
  icon: React.ElementType;
  label: string;
  children?: NavLink[];
}

const navLinks: NavLink[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  {
    href: '/dashboard/products',
    icon: Package,
    label: 'Products',
    children: [
      { href: '/dashboard/collections', icon: List, label: 'Collections' },
      // { href: '/dashboard/inventory', icon: Box, label: 'Inventory' },
    ],
  },
  { href: '/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/dashboard/customers', icon: Users, label: 'Customers' },
  { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [_, setActiveTheme] = useState<Theme>(Theme.System);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { setTheme } = useTheme();
  const { user, isLoading, signOut } = useCurrentUser();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const userInitials = [user?.firstName?.[0], user?.lastName?.[0]].join('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;
    setTheme(user.theme.toLocaleLowerCase());
    setActiveTheme(user.theme);
  }, [user, setTheme]);

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

  const handleClick = () => {
    if (pathname !== DASHBOARD_SETTINGS_LINK) {
      localStorage.setItem('checkpoint', window.location.pathname);
    }
    router.push('/dashboard/settings');
  };

  const handleThemeChange = async (value: Theme) => {
    if (!user) return;
    setTheme(value.toLocaleLowerCase());
    setActiveTheme(value);
    await updateUser({ id: user.id, theme: value });
  };

  const isLinkActive = (link: NavLink): boolean => {
    if (pathname === link.href) return true;
    if (link.children) {
      return link.children.some((child) => isLinkActive(child));
    }
    return false;
  };

  const shouldShowChildren = (link: NavLink): boolean => {
    return (
      isLinkActive(link) ||
      (link.children && link.children.some((child) => isLinkActive(child))) ||
      false
    );
  };

  const renderNavLink = (link: NavLink, depth = 0) => {
    const hasChildren = link.children && link.children.length > 0;
    const isActive = pathname === link.href;
    const isChildActive =
      hasChildren && link?.children?.some((child) => isLinkActive(child));
    const showChildren = shouldShowChildren(link);

    return (
      <div key={link.href} className={`${depth > 0 ? 'ml-4' : ''}`}>
        <Button
          variant={isActive && !isChildActive ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            isActive && !isChildActive ? 'bg-primary/10 text-primary' : ''
          }`}
        >
          <Link href={link.href} className="flex items-center w-full">
            <link.icon
              className={`mr-3 h-4 w-4 flex-shrink-0 ${
                isActive && !isChildActive ? 'text-primary' : ''
              }`}
            />
            <span className="text-left">{link.label}</span>
          </Link>
        </Button>
        {hasChildren && showChildren && (
          <div className="mt-2 space-y-2">
            {link?.children?.map((child) => renderNavLink(child, depth + 1))}
          </div>
        )}
      </div>
    );
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
    <ApolloProvider client={client}>
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
                {navLinks.map((link) => renderNavLink(link))}
              </nav>
              <div className="p-4">
                <Button
                  variant={
                    pathname === '/dashboard/settings' ? 'secondary' : 'ghost'
                  }
                  className={`w-full justify-start ${
                    pathname === '/dashboard/settings'
                      ? 'bg-primary/10 text-primary'
                      : ''
                  }`}
                  onClick={handleClick}
                >
                  <Settings
                    className={`mr-2 h-4 w-4 ${
                      pathname === '/dashboard/settings' ? 'text-primary' : ''
                    }`}
                  />
                  Settings
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
                      <AvatarImage src={''} alt="User avatar" />
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
                      {THEMES.map((theme) => (
                        <TooltipProvider key={theme.value}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-background/80 dark:hover:bg-muted/50"
                                onClick={() => handleThemeChange(theme.value)}
                              >
                                <theme.icon className="h-4 w-4" />
                                <span className="sr-only">
                                  {theme.label} theme
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{theme.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
            {children}
          </main>
        </div>
      </div>
    </ApolloProvider>
  );
}
