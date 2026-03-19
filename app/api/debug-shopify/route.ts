import { NextResponse } from 'next/server';

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return NextResponse.json({ status: 'NOT_CONFIGURED' });
  }

  try {
    const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
      cache: 'no-store',
      body: JSON.stringify({
        query: `{
          collections(first: 10) {
            edges {
              node {
                title
                handle
                image { url }
                products(first: 20) {
                  edges {
                    node {
                      title
                      tags
                      images(first: 1) {
                        edges { node { url } }
                      }
                    }
                  }
                }
              }
            }
          }
        }`,
      }),
    });

    const json = await res.json();

    // Process to show which products are covers
    const collections = json.data?.collections?.edges?.map((e: Record<string, Record<string, unknown>>) => {
      const col = e.node as Record<string, unknown>;
      const products = (col.products as Record<string, unknown[]>)?.edges as Record<string, Record<string, unknown>>[] ?? [];
      const coverProduct = products.find((p) =>
        ((p.node as Record<string, unknown>).tags as string[])?.includes('collection-cover')
      );
      return {
        title: col.title,
        handle: col.handle,
        hasShopifyImage: !!(col.image as Record<string, unknown> | null),
        coverProductFound: !!coverProduct,
        coverProductTitle: coverProduct ? (coverProduct.node as Record<string, unknown>).title : null,
        allProductTags: products.map((p) => ({
          title: (p.node as Record<string, unknown>).title,
          tags: (p.node as Record<string, unknown>).tags,
        })),
      };
    });

    return NextResponse.json({ status: 'OK', collections });
  } catch (err) {
    return NextResponse.json({ status: 'ERROR', error: err instanceof Error ? err.message : String(err) });
  }
}
