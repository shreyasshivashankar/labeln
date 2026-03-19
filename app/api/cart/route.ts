import { NextRequest, NextResponse } from 'next/server';
import {
  createCart,
  addToCart,
  updateCartLines,
  removeCartLines,
  getCart,
} from '@/lib/shopify';

export async function GET(request: NextRequest) {
  const cartId = request.nextUrl.searchParams.get('cartId');
  if (!cartId) {
    return NextResponse.json({ error: 'Missing cartId' }, { status: 400 });
  }

  try {
    const cart = await getCart(cartId);
    return NextResponse.json(cart);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    cartId?: string;
    variantId: string;
    quantity?: number;
  };

  const { cartId, variantId, quantity = 1 } = body;

  try {
    const cart = cartId
      ? await addToCart(cartId, [{ merchandiseId: variantId, quantity }])
      : await createCart([{ merchandiseId: variantId, quantity }]);
    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as {
    cartId: string;
    lines: Array<{ id: string; quantity: number }>;
  };

  try {
    const cart = await updateCartLines(body.cartId, body.lines);
    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const body = (await request.json()) as {
    cartId: string;
    lineIds: string[];
  };

  try {
    const cart = await removeCartLines(body.cartId, body.lineIds);
    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
