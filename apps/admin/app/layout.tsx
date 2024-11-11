import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import '@/config/globals.css';
import { ThemeProvider } from 'next-themes';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your store with ease',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'min-h-full')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          {children}
        </ThemeProvider>
        <Toaster
          toastOptions={{
            classNames: {
              error:
                'text-red-400 bg-background border-0 dark:border shadow-md',
              success:
                'text-green-400 bg-background border-0 dark:border shadow-md',
              warning:
                'text-yellow-600 bg-background border-0 dark:border shadow-md',
              info: 'text-foreground bg-background border-0 dark:border shadow-md',
            },
          }}
        />
      </body>
    </html>
  );
}
