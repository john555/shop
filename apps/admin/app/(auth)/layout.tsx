'use client';

import { useCurrentUser } from '@/common/hooks/auth';
import { AlreadySignedIn } from './(components)/already-signed-in';

type AuthLayoutProps = Readonly<{ children: React.ReactNode }>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return null;
  }

  if (!isLoading && user) {
    return <AlreadySignedIn />;
  }

  return children;
}
