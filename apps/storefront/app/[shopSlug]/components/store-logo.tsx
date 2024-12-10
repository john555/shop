"use client"

import { createStoreFrontUrl } from '@/lib/common/url';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface StoreLogoProps {
  storeName: string;
  logo?: string;
}

export function StoreLogo({ storeName, logo }: StoreLogoProps) {
  const shopSlug = useParams().shopSlug as string;

  return (
    <Link
      href={createStoreFrontUrl(shopSlug)}
      className="flex items-center gap-2"
    >
      {logo && (
        <Image
          src={logo}
          alt={storeName}
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
      <span className={`font-bold ${logo ? 'hidden md:inline-block' : ''}`}>
        {storeName}
      </span>
    </Link>
  );
}
