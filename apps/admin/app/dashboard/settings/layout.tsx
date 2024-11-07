'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useState } from 'react';
import { Store, Sun, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useStore } from '@/admin/hooks/store/use-store';
import { DASHBOARD_SETTINGS_LINK } from '@/common/constants';

const settingsSections = [
  {
    id: 'store',
    label: 'General',
    icon: Store,
    href: `${DASHBOARD_SETTINGS_LINK}`,
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    href: `${DASHBOARD_SETTINGS_LINK}/account`,
  },
  {
    id: 'theme',
    label: 'Theme',
    icon: Sun,
    href: `${DASHBOARD_SETTINGS_LINK}/theme`,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { store, loading } = useStore();
  const [activeSection, setActiveSection] = useState('store');
  const pathname = usePathname();
  const router = useRouter();

  const handleOnClose = () => {
    try {
      const checkpoint = localStorage.getItem('checkpoint');
      localStorage.removeItem('checkpoint');
      if (checkpoint) {
        router.push(checkpoint);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      router.push('/dashboard');
    }
  };

  if (loading || !store) {
    return null;
  }

  return (
    <Drawer open={true} onClose={handleOnClose}>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>
            Update your shop and user account settings.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea>
          <div className="h-[90vh] w-full max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto pb-20">
            <div className="container mx-auto px-4 py-8">
              <div className="lg:flex gap-8">
                {/* Sidebar for larger screens */}
                <aside className="hidden lg:block w-56 shrink-0">
                  <h1 className="text-3xl font-bold mb-6">Settings</h1>
                  <nav className="space-y-2">
                    {settingsSections.map((section) => (
                      <Link key={section.id} href={section.href}>
                        <Button
                          variant={
                            pathname === section.href ? 'default' : 'ghost'
                          }
                          className="w-full justify-start mb-2"
                        >
                          <section.icon className="mr-2 h-4 w-4" />
                          {section.label}
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </aside>

                {/* Dropdown for mobile */}
                <div className="lg:hidden mb-6">
                  <h1 className="text-3xl font-bold mb-6">Settings</h1>
                  <Select
                    onValueChange={setActiveSection}
                    value={activeSection}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select settings" />
                    </SelectTrigger>
                    <SelectContent>
                      {settingsSections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          <div className="flex items-center">
                            <section.icon className="mr-2 h-4 w-4" />
                            {section.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {children}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
