'use client';

import { ReactNode, useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { gql } from '@apollo/client';
import { client } from '@/utils/apollo';
import { cache } from 'react';
import { Button } from '@components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/sheet';

import { Menu } from 'lucide-react';
import { NavItems } from './(layout)/nav-items';
import { SearchBar } from './(layout)/search-bar';
import { AccountDropdown } from './(layout)/account-dropdown';

type DashboardLayoutProps = Readonly<{
  children: ReactNode;
}>;

const ME_QUERY = gql`
  query me {
    me {
      id
      email
      emailVerified
      imageUrl
      updatedAt
    }
  }
`;

const getUser = cache(async () => {
  const { data } = await client.query({
    query: ME_QUERY,
  });
  return data?.me;
});

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser()
      .then((user) => {
        setUser(user);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!isLoading && !user) {
    redirect('/auth/signin');
  }
  

  if (isLoading && !user) {
    return <>Loading...</>;
  }

  return (
    <div className="flex">
      <aside className="fixed top-0 md:w-60 z-20 bg-white">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden p-3 box-content"
            >
              <Menu strokeWidth={1.2} />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 overflow-y-auto">
            <NavItems />
          </SheetContent>
        </Sheet>
        <div className="hidden md:flex">
          <NavItems />
        </div>
      </aside>
      <header className="fixed z-10 left-0 right-0 pl-16 md:left-60 top-0 md:pl-4 px-4 py-3 flex justify-between items-start gap-8 md:w-[calc(100vw-15rem)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SearchBar />
        <AccountDropdown />
      </header>
      <main className="px-4 md:ml-60 pt-20 w-full bg-slate-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
