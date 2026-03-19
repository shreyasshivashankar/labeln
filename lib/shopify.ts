/**
 * Shopify Storefront API client.
 * SHOPIFY_STOREFRONT_ACCESS_TOKEN is server-only — never exposed to client bundles.
 */

import type { ShopifyCart, ShopifyCollection, ShopifyProduct } from '@/types/shopify';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  console.warn(
    'Shopify Storefront API not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.'
  );
}

const endpoint = `https://${domain}/api/2024-10/graphql.json`;

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { noCache?: boolean },
): Promise<T> {
  if (!domain || !storefrontAccessToken) {
    throw new Error('Shopify Storefront API is not configured');
  }

  const fetchInit: RequestInit & { next?: { tags?: string[] } } = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  };

  if (options?.noCache) {
    fetchInit.cache = 'no-store';
  } else {
    fetchInit.next = { tags: ['shopify'] };
  }

  const response = await fetch(endpoint, fetchInit);

  const json = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };

  if (json.errors?.length) {
    throw new Error(`Shopify API error: ${json.errors.map((e) => e.message).join(', ')}`);
  }

  if (!json.data) {
    throw new Error('Shopify API returned no data');
  }

  return json.data;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const productByHandleQuery = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      productType
      vendor
      tags
      options {
        id
        name
        values
      }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      images(first: 10) {
        edges { node { url altText } }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

const productsQuery = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          tags
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges { node { url altText } }
          }
        }
      }
    }
  }
`;

const collectionsQuery = `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          image { url altText }
          products(first: 20) {
            edges {
              node {
                tags
                images(first: 1) {
                  edges { node { url altText } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const collectionByHandleQuery = `
  query CollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image { url altText }
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            tags
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 1) {
              edges { node { url altText } }
            }
          }
        }
      }
    }
  }
`;

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function getProductByHandle(handle: string) {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(productByHandleQuery, {
    handle,
  });
  return data.product;
}

/** Tag used to mark a product as a collection cover image */
const COVER_TAG = 'collection-cover';

export async function getProducts(first = 20) {
  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>(productsQuery, { first: first + 10 });
  return data.products.edges
    .map((e) => e.node)
    .filter((p) => !p.tags?.includes(COVER_TAG))
    .slice(0, first);
}

export async function getCollections(first = 10) {
  const data = await shopifyFetch<{
    collections: { edges: Array<{ node: ShopifyCollection & {
      products: { edges: Array<{ node: { tags: string[]; images: { edges: Array<{ node: { url: string; altText: string | null } }> } } }> }
    } }> };
  }>(collectionsQuery, { first: first + 5 });
  return data.collections.edges
    .map((e) => {
      const col = e.node;
      // Use collection-cover product image as the collection thumbnail
      const coverProduct = col.products?.edges.find((p) =>
        p.node.tags?.includes(COVER_TAG)
      );
      const coverImage = coverProduct?.node.images.edges[0]?.node;
      return {
        id: col.id,
        handle: col.handle,
        title: col.title,
        image: coverImage ?? col.image,
      };
    })
    .filter((c) => {
      const h = c.handle.toLowerCase();
      const t = c.title.toLowerCase();
      // Exclude system/virtual collections
      if (h === 'frontpage') return false;
      if (h.includes('shop-all') || h === 'all') return false;
      if (t === 'shop all' || t === 'all') return false;
      return true;
    })
    .slice(0, first);
}

export async function getCollectionByHandle(handle: string, productsFirst = 20) {
  const data = await shopifyFetch<{
    collection:
      | (ShopifyCollection & {
          description: string;
          products: { edges: Array<{ node: ShopifyProduct }> };
        })
      | null;
  }>(collectionByHandleQuery, { handle, first: productsFirst });

  if (!data.collection) return null;

  return {
    collection: data.collection,
    products: data.collection.products.edges
      .map((e) => e.node)
      .filter((p) => !p.tags?.includes(COVER_TAG)),
  };
}

// ─── Search ──────────────────────────────────────────────────────────────────

const searchProductsQuery = `
  query SearchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          handle
          title
          tags
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges { node { url altText } }
          }
        }
      }
    }
  }
`;

export async function searchProducts(query: string, first = 20) {
  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>(searchProductsQuery, { query, first: first + 10 });
  return data.products.edges
    .map((e) => e.node)
    .filter((p) => !p.tags?.includes(COVER_TAG))
    .slice(0, first);
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

const cartFragment = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              product {
                title
                handle
                images(first: 1) {
                  edges { node { url altText } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const cartCreateMutation = `
  ${cartFragment}
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const cartLinesAddMutation = `
  ${cartFragment}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const cartLinesUpdateMutation = `
  ${cartFragment}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const cartLinesRemoveMutation = `
  ${cartFragment}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const cartQuery = `
  ${cartFragment}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

interface CartLineUpdateInput {
  id: string;
  quantity: number;
}

type UserError = { field: string; message: string };

function assertNoErrors(errors: UserError[]) {
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(', '));
  }
}

export async function createCart(lines: CartLineInput[]): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: UserError[] };
  }>(cartCreateMutation, { input: { lines } }, { noCache: true });
  assertNoErrors(data.cartCreate.userErrors);
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, lines: CartLineInput[]): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: UserError[] };
  }>(cartLinesAddMutation, { cartId, lines }, { noCache: true });
  assertNoErrors(data.cartLinesAdd.userErrors);
  return data.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[],
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: UserError[] };
  }>(cartLinesUpdateMutation, { cartId, lines }, { noCache: true });
  assertNoErrors(data.cartLinesUpdate.userErrors);
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[],
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: UserError[] };
  }>(cartLinesRemoveMutation, { cartId, lineIds }, { noCache: true });
  assertNoErrors(data.cartLinesRemove.userErrors);
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(
    cartQuery,
    { cartId },
    { noCache: true },
  );
  return data.cart;
}
