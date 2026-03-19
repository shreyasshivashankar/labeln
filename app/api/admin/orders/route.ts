import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getOrders } from '@/lib/shopify-admin';

const SECRET = new TextEncoder().encode(process.env.ADMIN_SECRET || 'dev-secret');

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

/** GET /api/admin/orders?filter=custom — fetch orders from Shopify Admin API */
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const filter = request.nextUrl.searchParams.get('filter');
    const orders = await getOrders(50);

    if (filter === 'custom') {
      // Return only orders that contain a "Custom" variant
      const customOrders = orders.filter((order) =>
        order.lineItems.edges.some(
          (e) => e.node.variantTitle?.toLowerCase().includes('custom')
        )
      );
      return NextResponse.json({ orders: customOrders });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
