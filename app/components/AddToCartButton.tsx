'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';

interface Props {
  variantId: string;
  availableForSale: boolean;
}

export default function AddToCartButton({ variantId, availableForSale }: Props) {
  const { addToCart, loading } = useCart();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  if (!availableForSale) {
    return (
      <button
        disabled
        className="w-full py-4 bg-surface text-text-secondary text-[11px] font-medium uppercase tracking-[0.25em] cursor-not-allowed"
      >
        Sold Out
      </button>
    );
  }

  const handleClick = async () => {
    setError('');
    setAdding(true);
    try {
      await addToCart(variantId);
    } catch {
      setError('Unable to add to cart. Please try again.');
    }
    setAdding(false);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading || adding}
        className="w-full py-4 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors duration-300 disabled:opacity-50"
      >
        {adding ? 'Adding\u2026' : 'Add to Bag'}
      </button>
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </div>
  );
}
