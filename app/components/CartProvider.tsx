'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ShopifyCart } from '../../types/shopify';

interface CartLine {
  id: string;
  quantity: number;
  title: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  image: { url: string; altText: string | null } | null;
  handle: string;
}

interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: { amount: string; currencyCode: string };
  lines: CartLine[];
}

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue>({
  cart: null,
  loading: false,
  drawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
});

export function useCart() {
  return useContext(CartContext);
}

function parseCart(raw: ShopifyCart | null): Cart | null {
  if (!raw) return null;
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    subtotal: raw.cost.subtotalAmount,
    lines: raw.lines.edges.map((e) => ({
      id: e.node.id,
      quantity: e.node.quantity,
      title: e.node.merchandise.product.title,
      variantTitle: e.node.merchandise.title,
      price: e.node.merchandise.price,
      image: e.node.merchandise.product.images.edges[0]?.node ?? null,
      handle: e.node.merchandise.product.handle,
    })),
  };
}

const CART_ID_KEY = 'labeln_cart_id';

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;

    fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`)
      .then((r) => (r.ok ? (r.json() as Promise<ShopifyCart | null>) : null))
      .then((data) => {
        const parsed = parseCart(data ?? null);
        if (parsed && parsed.totalQuantity > 0) {
          setCart(parsed);
        } else {
          localStorage.removeItem(CART_ID_KEY);
        }
      })
      .catch(() => localStorage.removeItem(CART_ID_KEY));
  }, []);

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    setLoading(true);
    try {
      const cartId = localStorage.getItem(CART_ID_KEY);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, variantId, quantity }),
      });
      if (!res.ok) throw new Error('Failed to add to cart');
      const data = (await res.json()) as ShopifyCart;
      const parsed = parseCart(data);
      if (parsed) {
        setCart(parsed);
        localStorage.setItem(CART_ID_KEY, parsed.id);
        setDrawerOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(
    async (lineId: string) => {
      const cartId = cart?.id;
      if (!cartId) return;
      setLoading(true);
      try {
        const res = await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId, lineIds: [lineId] }),
        });
        if (!res.ok) throw new Error('Failed to remove from cart');
        const data = (await res.json()) as ShopifyCart;
        const parsed = parseCart(data);
        setCart(parsed);
        if (!parsed || parsed.totalQuantity === 0) {
          localStorage.removeItem(CART_ID_KEY);
        }
      } finally {
        setLoading(false);
      }
    },
    [cart?.id],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      const cartId = cart?.id;
      if (!cartId) return;
      setLoading(true);
      try {
        const res = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId, lines: [{ id: lineId, quantity }] }),
        });
        if (!res.ok) throw new Error('Failed to update cart');
        const data = (await res.json()) as ShopifyCart;
        setCart(parseCart(data));
      } finally {
        setLoading(false);
      }
    },
    [cart?.id],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
