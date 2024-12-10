import React from 'react';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { storeDetails } from './utils/mock-data';
import '@/config/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        storeName={storeDetails.name}
        logo={storeDetails.logo}
        primaryColor="#10B981"
      />
      <main className="flex-grow pt-16">{children}</main>
      <Footer
        storeName={storeDetails.name}
        storeDescription={storeDetails.description}
        logoSrc={storeDetails.logo}
        primaryColor="#10B981"
      />
    </div>
  );
}
