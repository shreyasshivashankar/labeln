/**
 * Shopify Storefront API types - generated from GraphQL schema.
 * Use Supabase CLI to generate types from database: supabase gen types typescript
 */

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[];
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: Array<{
      node: { url: string; altText: string | null };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
      };
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  image: { url: string; altText: string | null } | null;
}

export interface ShopifyStorefrontResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}
