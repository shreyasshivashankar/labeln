'use client';

import Image from 'next/image';
import { useCart } from './CartProvider';

export default function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, removeFromCart, updateQuantity, loading } = useCart();

  if (!drawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[60] shadow-xl flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button
            onClick={closeDrawer}
            className="text-2xl leading-none text-gray-500 hover:text-black"
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {!cart || cart.lines.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.lines.map((line) => (
                <div key={line.id} className="flex gap-4 border-b pb-4">
                  {line.image && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={line.image.url}
                        alt={line.image.altText ?? line.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{line.title}</p>
                    {line.variantTitle !== 'Default Title' && (
                      <p className="text-xs text-gray-500">{line.variantTitle}</p>
                    )}
                    <p className="text-sm mt-1">
                      {line.price.amount} {line.price.currencyCode}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(line.id, Math.max(0, line.quantity - 1))}
                        className="w-7 h-7 border rounded text-sm hover:bg-gray-50"
                        disabled={loading}
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span className="text-sm tabular-nums w-6 text-center">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        className="w-7 h-7 border rounded text-sm hover:bg-gray-50"
                        disabled={loading}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(line.id)}
                        className="ml-auto text-xs text-red-500 hover:underline"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-5 space-y-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>
                  {cart.subtotal.amount} {cart.subtotal.currencyCode}
                </span>
              </div>
              <a
                href={cart.checkoutUrl}
                className="block w-full text-center bg-primary text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Checkout
              </a>
              <p className="text-xs text-center text-gray-400">
                You&apos;ll be redirected to Shopify for secure payment
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
