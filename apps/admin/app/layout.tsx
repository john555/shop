import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@libs/utils";
import "@config/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your packages & bookings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-full")}>{children}
      </body>
    </html>
  );
}
