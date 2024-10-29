import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@libs/utils';
import '@config/globals.css';
import { ThemeProvider } from 'next-themes';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your packages & bookings',
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
      </body>
    </html>
  );
}
