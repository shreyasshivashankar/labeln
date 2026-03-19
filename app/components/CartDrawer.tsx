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
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-5 border-b border-border">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em]">Your Bag</h2>
          <button
            onClick={closeDrawer}
            className="text-text-secondary hover:text-primary transition-colors"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!cart || cart.lines.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-text-secondary text-sm">Your bag is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {cart.lines.map((line) => (
                <div key={line.id} className="flex gap-4 pb-6 border-b border-border last:border-0">
                  {line.image && (
                    <div className="relative w-20 h-24 flex-shrink-0 bg-surface overflow-hidden">
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
                    <p className="text-sm font-normal truncate">{line.title}</p>
                    {line.variantTitle !== 'Default Title' && (
                      <p className="text-xs text-text-secondary mt-0.5">{line.variantTitle}</p>
                    )}
                    <p className="text-sm mt-1">
                      {line.price.currencyCode === 'USD' ? '$' : ''}{line.price.amount}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(line.id, Math.max(0, line.quantity - 1))}
                        className="w-7 h-7 border border-border text-xs hover:border-primary transition-colors"
                        disabled={loading}
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span className="text-xs tabular-nums w-4 text-center">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        className="w-7 h-7 border border-border text-xs hover:border-primary transition-colors"
                        disabled={loading}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(line.id)}
                        className="ml-auto text-[10px] uppercase tracking-widest text-text-secondary hover:text-primary transition-colors"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium uppercase tracking-[0.15em]">Subtotal</span>
                <span className="text-sm">
                  {cart.subtotal.currencyCode === 'USD' ? '$' : ''}{cart.subtotal.amount}
                </span>
              </div>
              <a
                href={cart.checkoutUrl}
                className="block w-full text-center py-4 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors duration-300"
              >
                Checkout
              </a>
              <p className="text-[10px] text-center text-text-secondary tracking-wide">
                Secure checkout via Shopify
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
