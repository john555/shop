'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Search,
  ShoppingCart,
  Users,
  Package,
  LayoutDashboard,
  List,
  Settings,
  Activity,
  Globe,
  Store,
  LogOut,
  User,
  X,
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/components/hooks/use-mobile';
import { useCurrentUser } from '@/common/hooks/auth';
import { SignInRequired } from '../(auth)/(components)/sign-in-required';
import { DASHBOARD_SETTINGS_LINK, THEMES } from '@/common/constants';
import { updateUser } from '@/common/actions/user';
import { Theme } from '@/types/api';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/common/apollo';
import { CreateStoreRequired } from './(components)/create-store-required';

type NavLink = {
  href: string;
  icon: React.ElementType;
  label: string;
  children?: NavLink[];
};

const navLinks: NavLink[] = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    children: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { href: '/dashboard/products', icon: Package, label: 'Products' },
      { href: '/dashboard/collections', icon: List, label: 'Collections' },
      { href: '/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
      { href: '/dashboard/customers', icon: Users, label: 'Customers' },
      { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
    ],
  },
  {
    href: '/dashboard/sales-channels',
    icon: Globe,
    label: 'Sales Channels',
    children: [
      {
        href: '/dashboard/channels/online-store',
        icon: Globe,
        label: 'Online store',
      }
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [_, setActiveTheme] = useState<Theme>(Theme.System);
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

  const renderNavLink = (link: NavLink) => {
    const isActive = isLinkActive(link);

    return (
      <SidebarMenuItem key={link.href}>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link href={link.href} className="flex items-center w-full">
            <link.icon className="mr-3 h-4 w-4 flex-shrink-0" />
            <span>{link.label}</span>
          </Link>
        </SidebarMenuButton>
        {link.children && (
          <SidebarMenu>
            {link.children.map((child) => renderNavLink(child))}
          </SidebarMenu>
        )}
      </SidebarMenuItem>
    );
  };

  if (isSigningOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
        <p className="text-lg text-foreground">Signing out...</p>
      </div>
    );
  }

  if (isLoading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
        <p className="text-lg text-foreground">Loading...</p>
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
      <SidebarProvider>
        <div className="flex w-full bg-background text-foreground">
          <Sidebar className="bg-sidebar text-sidebar-foreground flex flex-col h-screen">
            <SidebarHeader>
              <div className="flex items-center justify-between p-4">
                <h1 className="text-2xl font-bold">E-commerce</h1>
              </div>
            </SidebarHeader>
            <div className="flex-grow overflow-y-auto">
              <SidebarContent>
                {navLinks.map((group) => (
                  <SidebarGroup key={group.href}>
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {group.children?.map((link) => renderNavLink(link))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                ))}
              </SidebarContent>
            </div>
            <SidebarContent className="mt-auto">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={handleClick}
                        isActive={pathname === DASHBOARD_SETTINGS_LINK}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <div className="flex flex-1 flex-col overflow-hidden">
            <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-sidebar">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SidebarTrigger className="mr-4" />
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
                              width: '100%',
                              maxWidth: '800px',
                              height: '40vh',
                              maxHeight: '400px',
                            }}
                          >
                            <CommandList>
                              <CommandEmpty>No results found.</CommandEmpty>
                              <CommandGroup heading="Suggestions">
                                <CommandItem>Search for orders</CommandItem>
                                <CommandItem>Search for products</CommandItem>
                                <CommandItem>Search for customers</CommandItem>
                              </CommandGroup>
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
                          className="relative h-8 w-8 rounded-full"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={''} alt="User avatar" />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56 bg-popover"
                        align="end"
                        forceMount
                      >
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
                                      className="h-6 w-6 hover:bg-sidebar-accent dark:hover:bg-sidebar-muted"
                                      onClick={() =>
                                        handleThemeChange(theme.value)
                                      }
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
                        <DropdownMenuItem
                          onClick={() => router.push('/dashboard/settings')}
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>Account</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto w-full bg-background">
              <div className="container mx-auto p-4">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ApolloProvider>
  );
}
