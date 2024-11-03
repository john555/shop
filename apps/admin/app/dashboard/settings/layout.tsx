'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useState } from 'react';
import { Calculator, CreditCard, Store, Sun, Truck, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const settingsSections = [
  {
    id: 'store',
    label: 'General',
    icon: Store,
    href: '/dashboard/settings',
    hidden: false,
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
    href: '/dashboard/settings/payments',
    hidden: true,
  },
  {
    id: 'shipping',
    label: 'Shipping',
    icon: Truck,
    href: '/dashboard/settings/shipping',
    hidden: true,
  },
  {
    id: 'taxes',
    label: 'Taxes',
    icon: Calculator,
    href: '/dashboard/settings/taxes',
    hidden: true,
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    href: '/dashboard/settings/account',
    hidden: true,
  },
  {
    id: 'theme',
    label: 'Theme',
    icon: Sun,
    href: '/dashboard/settings/theme',
    hidden: true,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState('store');
  const pathname = usePathname();
  const router = useRouter();

  const handleOnClose = () => {
    try {
      // Attempt to access the previous page's origin
      const previousPageOrigin = document.referrer
        ? new URL(document.referrer).origin
        : null;
      const currentOrigin = window.location.origin;

      if (previousPageOrigin === currentOrigin && window.history.length > 1) {
        router.back();
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      // If there's any error (e.g., cross-origin issues), redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <Drawer open={true} onClose={handleOnClose}>
      <DrawerContent>
        <ScrollArea>
          <div className="h-[90vh] w-full max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto pb-20">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-6">Settings</h1>
              <div className="lg:flex gap-8">
                {/* Sidebar for larger screens */}
                <aside className="hidden lg:block w-64 shrink-0">
                  <nav className="space-y-2">
                    {settingsSections
                      .filter((section) => section.hidden === false)
                      .map((section) => (
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
                <div className="flex-1 space-y-6">{children}</div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
