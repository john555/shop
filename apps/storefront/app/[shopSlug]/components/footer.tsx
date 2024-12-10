import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Facebook,
  Instagram,
  Twitter,
  TwitterIcon as TikTok,
} from 'lucide-react';
import { StoreLogo } from './store-logo';

interface FooterProps {
  storeName: string;
  storeDescription: string;
  logoSrc?: string;
  primaryColor: string;
}

export function Footer({ storeName, storeDescription, logoSrc }: FooterProps) {
  return (
    <footer className="relative bg-gradient-to-b from-background via-background to-secondary/10 overflow-hidden pt-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute -top-32 left-1/2 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl transform -translate-x-1/2"></div>
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-secondary/10 rounded-full filter blur-3xl transform translate-x-1/2"></div>
      </div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <div className="container relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <StoreLogo storeName={storeName} logo={logoSrc} />
            </div>
            <p className="text-sm max-w-md">{storeDescription}</p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 transition-colors duration-300"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 transition-colors duration-300"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 transition-colors duration-300"
              >
                <TikTok className="h-5 w-5" />
                <span className="sr-only">TikTok</span>
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <address className="text-sm not-italic space-y-2">
              <p>123 Eco Street</p>
              <p>Green City, Earth 12345</p>
              <p>Email: info@greengadgets.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        <Separator className="my-8 bg-border/50" />
        <div className="flex flex-col md:flex-row justify-between items-center pb-12">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
      <svg
        className="absolute bottom-0 left-0 right-0 z-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="currentColor"
          fillOpacity="0.05"
          d="M0,128L48,117.3C96,107,192,85,288,90.7C384,96,480,128,576,133.3C672,139,768,117,864,101.3C960,85,1056,75,1152,80C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </footer>
  );
}
