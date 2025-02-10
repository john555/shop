import { Collection } from '@/types/admin-api';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { createStoreFrontUrl } from '@/lib/common/url';

interface CollectionsProps {
  collections: Collection[];
  shopSlug: string;
}

export function Collections({ collections, shopSlug }: CollectionsProps) {
  return (
    <section className="py-12 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={createStoreFrontUrl(
                shopSlug,
                `/products?collection=${collection.slug}`
              )}
            >
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    {/* @ts-expect-error media does not exist on collection */}
                    {collection.media && collection.media[0] && (
                      <Image
                        // @ts-expect-error media does not exist on collection
                        src={collection.media[0].url}
                        alt={collection.name}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-bold text-center px-4">
                        {collection.name}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
