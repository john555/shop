'use client';

import { useRef } from 'react';
import { Hero } from './hero';
import { Collections } from './collections';
import { ProductGrid } from './product-grid';
import { CustomerFeedback } from './customer-feedback';
import { Newsletter } from './newsletter';
import { Footer } from './footer';
import {
  collections,
  storeDetails,
  products,
  reviews,
} from '../utils/mock-data';
import { Header } from './header';

interface StorefrontProps {
  branding: {
    storeName: string;
    logo: string;
    primaryColor: string;
    accentColor: string;
    bannerHeight: string;
    bannerOverlayColor: string;
    bannerOverlayOpacity: number;
    bannerTextAlignment: string;
  };
  params: {
    shopSlug: string;
  };
}

export default function Storefront({ branding, params }: StorefrontProps) {
  const productSectionRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* <Header
        storeName={branding.storeName}
        logo={branding.logo}
        primaryColor={branding.primaryColor}
      />
      <main className="flex-grow pt-16"> */}
      <Hero />

      <div
        id="products"
        ref={productSectionRef}
        className="container mx-auto px-4 py-12 space-y-16"
      >
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">
          Eco-Friendly Innovations: Discover Our Green Tech
        </h2>
        {/* @ts-expect-error missing fields */}
        <ProductGrid products={products} buttonColor={branding.primaryColor} />
      </div>
      <Collections collections={collections} shopSlug={params.shopSlug} />
      <CustomerFeedback reviews={reviews} starColor={branding.primaryColor} />
      <Newsletter buttonColor={branding.primaryColor} />
      {/* </main>
      <Footer
        storeName={branding.storeName}
        storeDescription={storeDetails.description}
        logoSrc={branding.logo}
        primaryColor={branding.primaryColor}
      /> */}
    </>
  );
}
