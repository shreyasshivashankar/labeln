import { NextResponse } from 'next/server';

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return NextResponse.json({ status: 'NOT_CONFIGURED', domain: domain ? 'set' : 'missing', token: token ? 'set' : 'missing' });
  }

  try {
    const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
      body: JSON.stringify({
        query: `{ shop { name } collections(first: 20) { edges { node { title handle } } } products(first: 20) { edges { node { title handle } } } }`,
      }),
    });

    const json = await res.json();
    return NextResponse.json({ status: 'OK', data: json });
  } catch (err) {
    return NextResponse.json({ status: 'ERROR', error: err instanceof Error ? err.message : String(err) });
  }
}
