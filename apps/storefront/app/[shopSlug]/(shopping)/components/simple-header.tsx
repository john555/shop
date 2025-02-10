import Link from 'next/link';
import { StoreLogo } from './store-logo';
import { storeDetails } from '../utils/mock-data';

export function SimpleHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-full flex items-center">
        <StoreLogo storeName={storeDetails.name} logo={storeDetails.logo} />
      </div>
    </header>
  );
}
