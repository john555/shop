export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DRAFT = 'DRAFT'
}

export enum SalesChannel {
  ONLINE = 'ONLINE',
  IN_STORE = 'IN_STORE'
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  MODEL_3D = 'MODEL_3D'
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

export interface Media {
  id: string;
  url: string;
  alt?: string;
  type: MediaType;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  media: Media[];
  products?: Product[];
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  available?: number;
  media?: Media[];
  options: Record<string, string>;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  slug: string;
  status: ProductStatus;
  price?: number;
  compareAtPrice?: number;
  sku?: string;
  available?: number;
  category?: Category;
  collections?: Collection[];
  media: Media[];
  salesChannels: SalesChannel[];
  seoTitle?: string;
  seoDescription?: string;
  trackInventory: boolean;
  tags?: string[];
  options?: ProductOption[];
  variants?: ProductVariant[];
}

