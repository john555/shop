export function createStoreFrontUrl(shopSlug: string, path: string = ''): string {
  const sanitizedPath = path.replace(/^\//, '');
  return `${process.env.NEXT_PUBLIC_STOREFRONT_URL}/${shopSlug}/${sanitizedPath}`;
}
