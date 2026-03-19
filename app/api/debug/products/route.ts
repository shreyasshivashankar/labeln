import { NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import type { ShopifyProduct } from '@/types/shopify';

const productsQuery = `
  query Products($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          handle
          title
          tags
          status: publishedAt
        }
      }
    }
  }
`;

interface Result {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: Array<{ node: ShopifyProduct & { status?: string } }>;
  };
}

export async function GET() {
  const allRaw: Array<{ handle: string; title: string; tags: string[]; status?: string }> = [];
  let cursor: string | null = null;
  let hasNext = true;
  let pageCount = 0;

  while (hasNext) {
    pageCount++;
    const result: Result = await shopifyFetch<Result>(productsQuery, { first: 250, after: cursor }, { noCache: true });
    for (const edge of result.products.edges) {
      allRaw.push({
        handle: edge.node.handle,
        title: edge.node.title,
        tags: edge.node.tags || [],
        status: (edge.node as { status?: string }).status,
      });
    }
    hasNext = result.products.pageInfo.hasNextPage;
    cursor = result.products.pageInfo.endCursor;
  }

  const coverTagged = allRaw.filter((p) => p.tags.includes('collection-cover'));
  const afterFilter = allRaw.filter((p) => !p.tags.includes('collection-cover'));

  return NextResponse.json({
    totalFromShopify: allRaw.length,
    filteredByCoverTag: coverTagged.length,
    afterFilter: afterFilter.length,
    pagesQueried: pageCount,
    coverTaggedProducts: coverTagged.map((p) => p.title),
    allProducts: allRaw.map((p) => ({ title: p.title, handle: p.handle, tags: p.tags })),
  });
}
