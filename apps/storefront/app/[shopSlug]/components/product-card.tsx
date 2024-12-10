'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/api';
import { formatCurrency } from '../utils/currency';
import { createStoreFrontUrl } from '@/lib/common/url';
import { useParams } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  buttonColor: string;
}

export function ProductCard({ product, buttonColor }: ProductCardProps) {
  const shopSlug = useParams().shopSlug as string;
  const [isHovered, setIsHovered] = useState(false);
  const productImage =
    product.media && product.media.length > 0 ? product.media[0] : null;

  const getMinPrice = () => {
    if (product.variants && product.variants.length > 0) {
      return Math.min(...product.variants.map((v) => v.price));
    }
    return product.price || 0;
  };

  const getMaxPrice = () => {
    if (product.variants && product.variants.length > 0) {
      return Math.max(...product.variants.map((v) => v.price));
    }
    return product.price || 0;
  };

  const getMaxCompareAtPrice = () => {
    if (product.variants && product.variants.length > 0) {
      const compareAtPrices = product.variants
        .map((v) => v.compareAtPrice || 0)
        .filter((p) => p > 0);
      return compareAtPrices.length > 0 ? Math.max(...compareAtPrices) : 0;
    }
    return product.compareAtPrice || 0;
  };

  const minPrice = getMinPrice();
  const maxPrice = getMaxPrice();
  const maxCompareAtPrice = getMaxCompareAtPrice();
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={createStoreFrontUrl(shopSlug, `/${product.slug}`)}>
        <Card className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
          <div className="relative w-full h-56 overflow-hidden flex-shrink-0">
            <Image
              src={productImage?.url || '/placeholder.svg'}
              alt={productImage?.alt || product.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <CardContent className="p-4 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="font-semibold text-lg mb-2 hover:underline">
                {product.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {product.description}
              </p>
            </div>
            <div>
              <p className="font-bold text-xl">
                {hasVariants && getMinPrice() !== getMaxPrice() ? 'From ' : ''}
                {formatCurrency(minPrice)}
              </p>
              {maxCompareAtPrice > minPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatCurrency(maxCompareAtPrice)}
                </p>
              )}
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
