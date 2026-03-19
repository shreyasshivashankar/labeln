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
        className="mt-8 w-full sm:w-auto px-10 py-3 bg-gray-200 text-gray-500 font-semibold rounded-full cursor-not-allowed"
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
        className="mt-8 w-full sm:w-auto px-10 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition disabled:opacity-60"
      >
        {adding ? 'Adding\u2026' : 'Add to Cart'}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
