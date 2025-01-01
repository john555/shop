'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  ShoppingCart,
  ImageIcon,
  Video,
  CuboidIcon as Cube,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ProductVariant, Media, MediaType } from '@/types/admin-api';
import Link from 'next/link';
import { products } from '../utils/mock-data';
import { MediaRenderer } from '../components/media-renderer';
import { formatCurrency } from '../utils/currency';
import { createStoreFrontUrl } from '@/lib/common/url';


interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  available: number;
  media: Media[];
  variants: ProductVariant[];
  options: { name: string; values: string[] }[];
  tags?: { id: string; name: string }[];
  category?: { name: string };
  slug: string;
  createdAt: string;
  store: string;
  storeId: string;
  updatedAt: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  useEffect(() => {
    const fetchProduct = () => {
      const foundProduct = products.find((p) => p.slug === params.productOrCollectionSlug);
      // @ts-expect-error not all properties exist on Product
      setProduct(foundProduct || null);
      if (foundProduct && foundProduct.options) {
        const initialOptions: Record<string, string> = {};
        foundProduct.options.forEach((option) => {
          initialOptions[option.name] = option.values[0];
        });
        setSelectedOptions(initialOptions);
      }
      if (foundProduct && foundProduct.media && foundProduct.media.length > 0) {
         // @ts-expect-error not all properties exist on Product
        setSelectedMedia(foundProduct.media[0]);
      }
    };
    fetchProduct();
  }, [params.slug]);

  useEffect(() => {
    if (product && product.variants) {
      const variant = product.variants.find(
        (v) =>
          v.optionCombination &&
          Object.entries(v.optionCombination).every(
            ([key, value]) => selectedOptions[key] === value
          )
      );
      console.log({ selectedOptions, variants: product.variants });
      setSelectedVariant(variant || null);
      if (variant && variant.media && variant.media.length > 0) {
        setSelectedMedia(variant.media[0]);
      } else if (product.media && product.media.length > 0) {
        setSelectedMedia(product.media[0]);
      }
    }
  }, [product, selectedOptions]);

  if (!product) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 pt-24">
        <p>Product not found</p>
      </div>
    );
  }

  const handleOptionChange = (optionName: string, optionValue: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: optionValue,
    }));
  };

  const handleMediaClick = (media: Media) => {
    setSelectedMedia(media);
  };

  const hasVariants = product.variants && product.variants.length > 0;

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <ImageIcon className="w-4 h-4" />;
      case 'VIDEO':
        return <Video className="w-4 h-4" />;
      case 'MODEL_3D':
        return <Cube className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-grow container mx-auto px-4 py-8 pt-24">
      <Link
        href={createStoreFrontUrl(params.shopSlug as string, '/products')}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {selectedMedia && (
            <MediaRenderer media={selectedMedia} alt={product.title} />
          )}
          <div className="grid grid-cols-4 gap-2">
            {(selectedVariant?.media?.length
              ? selectedVariant.media
              : product.media
            ).map((media, index) => (
              <div
                key={index}
                className="aspect-square relative overflow-hidden rounded-lg cursor-pointer border-2 hover:border-primary transition-colors duration-200"
                onClick={() => handleMediaClick(media)}
              >
                {media.type === MediaType.Photo && (
                  <Image
                    src={media.url}
                    alt={`${product.title} - Media ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  {getMediaIcon(media.type)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-semibold">
              {formatCurrency(
                hasVariants
                  ? selectedVariant?.price || product.price || 0
                  : product.price || 0
              )}
            </span>
            {((hasVariants &&
              selectedVariant?.compareAtPrice &&
              selectedVariant.compareAtPrice > selectedVariant.price) ||
              (!hasVariants &&
                product.compareAtPrice &&
                product.compareAtPrice > (product.price || 0))) && (
              <span className="text-lg text-gray-500 line-through">
                {formatCurrency(
                  hasVariants
                    ? selectedVariant?.compareAtPrice || 0
                    : product.compareAtPrice || 0
                )}
              </span>
            )}
          </div>
          <p className="text-gray-600">{product.description}</p>
          {hasVariants &&
            product.options &&
            product.options.map((option) => (
              <div key={option.name} className="space-y-2">
                <h3 className="font-semibold">{option.name}:</h3>
                <RadioGroup
                  value={selectedOptions[option.name]}
                  onValueChange={(value) =>
                    handleOptionChange(option.name, value)
                  }
                >
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <div key={value}>
                        <RadioGroupItem
                          value={value}
                          id={`${option.name}-${value}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`${option.name}-${value}`}
                          className={`flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-md cursor-pointer transition-colors duration-200 ${
                            selectedOptions[option.name] === value
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          {value}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
          <div className="space-y-2">
            <h3 className="font-semibold">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags?.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Category:</h3>
            <Badge variant="outline">{product.category?.name}</Badge>
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={
              hasVariants
                ? !selectedVariant || selectedVariant.available === 0
                : product.available === 0
            }
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {hasVariants
              ? selectedVariant && selectedVariant.available > 0
                ? 'Add to Cart'
                : 'Out of Stock'
              : product.available > 0
              ? 'Add to Cart'
              : 'Out of Stock'}
          </Button>
          {hasVariants ? (
            selectedVariant && (
              <p className="text-sm text-gray-500">
                {selectedVariant.available > 0
                  ? `${selectedVariant.available} in stock`
                  : 'Currently unavailable'}
              </p>
            )
          ) : (
            <p className="text-sm text-gray-500">
              {product.available > 0
                ? `${product.available} in stock`
                : 'Currently unavailable'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
