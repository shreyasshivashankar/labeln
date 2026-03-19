import { NextResponse } from 'next/server';

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return NextResponse.json({
      status: 'NOT_CONFIGURED',
      domain: domain ? 'set' : 'missing',
      token: token ? `set (${token.substring(0, 6)}...)` : 'missing',
    });
  }

  try {
    const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: `{ shop { name } collections(first: 5) { edges { node { title handle } } } products(first: 5) { edges { node { title handle } } } }`,
      }),
    });

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json({
        status: 'INVALID_RESPONSE',
        httpStatus: res.status,
        body: text.substring(0, 500),
      });
    }

    return NextResponse.json({
      status: res.ok ? 'OK' : 'ERROR',
      httpStatus: res.status,
      data: json,
    });
  } catch (err) {
    return NextResponse.json({
      status: 'FETCH_FAILED',
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
