import { Hero } from './components/hero';
import { FeaturedProducts } from './components/featured-products';
import { Collections } from './components/collections';
import { PromotionalBanner } from './components/promotional-banner';
import { products, collections, storeDetails } from './utils/mock-data';
import Storefront from './components/storefront';

export default function Home({ params }: { params: { shopSlug: string } }) {
  return (
    <Storefront
      params={params}
      branding={{
        storeName: storeDetails.name,
        logo: storeDetails.logo,
        primaryColor: '',
        accentColor: '',
        bannerHeight: '',
        bannerOverlayColor: '',
        bannerOverlayOpacity: 0,
        bannerTextAlignment: '',
      }}
    />
  );
}

// export default function Home({ params }: { params: { shopSlug: string } }) {
//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <Hero />
//       <FeaturedProducts products={products} />
//       <Collections collections={collections} shopSlug={params.shopSlug} />
//       <PromotionalBanner />
//     </div>
//   );
// }
