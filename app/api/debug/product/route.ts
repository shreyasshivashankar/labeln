import { NextRequest, NextResponse } from 'next/server';
import { getProductByHandle } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get('handle') || 'noor-fluid-corset-draped-saree';
  const product = await getProductByHandle(handle);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({
    title: product.title,
    imageCount: product.images.edges.length,
    images: product.images.edges.map((e) => ({
      url: e.node.url,
      altText: e.node.altText,
    })),
  });
}
