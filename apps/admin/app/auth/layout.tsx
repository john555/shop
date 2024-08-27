type AuthLayoutProps = Readonly<{ children: React.ReactNode }>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <div className="flex min-h-screen items-center">{children}</div>;
}
