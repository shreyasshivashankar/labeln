'use client';

import { useState } from 'react';
import type { ShopifyProduct } from '@/types/shopify';
import AddToCartButton from '../../components/AddToCartButton';

interface Props {
  product: ShopifyProduct;
}

export default function ProductDetails({ product }: Props) {
  const options = (product.options ?? []).filter(
    (o) => !(o.name === 'Title' && o.values.length === 1 && o.values[0] === 'Default Title')
  );

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const opt of options) {
      initial[opt.name] = opt.values[0] ?? '';
    }
    return initial;
  });

  // Find the variant matching selected options
  const selectedVariant = product.variants.edges.find(({ node }) => {
    if (!node.selectedOptions) return false;
    return node.selectedOptions.every(
      (so) => selectedOptions[so.name] === so.value
    );
  })?.node ?? product.variants.edges[0]?.node;

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const formattedPrice = price.currencyCode === 'USD' ? `$${price.amount}` : `${price.amount} ${price.currencyCode}`;

  // Filter out internal tags (like collection-cover)
  const displayTags = product.tags.filter((t) => t !== 'collection-cover');

  return (
    <div className="flex flex-col justify-start py-6 sticky top-24 self-start">
      {product.productType && (
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-secondary mb-3">
          {product.productType}
        </p>
      )}

      <h1 className="font-serif text-3xl md:text-4xl font-light">{product.title}</h1>
      <p className="mt-4 text-lg text-text-secondary">{formattedPrice}</p>

      {/* Options (Size, Color, etc.) */}
      {options.map((option) => (
        <div key={option.id} className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3">
            {option.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              return (
                <button
                  key={value}
                  onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                  className={`px-4 py-2.5 text-xs uppercase tracking-[0.1em] border transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Add to Cart */}
      {selectedVariant && (
        <div className="mt-10">
          <AddToCartButton
            variantId={selectedVariant.id}
            availableForSale={selectedVariant.availableForSale}
          />
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] mb-4">Details</p>
          <div
            className="text-text-secondary text-sm leading-[1.9] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
          />
        </div>
      )}

      {/* Tags */}
      {displayTags.length > 0 && (
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] mb-4">Tags</p>
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-text-secondary border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Product type & vendor */}
      {(product.productType || product.vendor) && (
        <div className="mt-8 pt-8 border-t border-border space-y-2">
          {product.productType && (
            <p className="text-[11px] text-text-secondary">
              <span className="uppercase tracking-[0.15em]">Type:</span> {product.productType}
            </p>
          )}
          {product.vendor && (
            <p className="text-[11px] text-text-secondary">
              <span className="uppercase tracking-[0.15em]">Brand:</span> {product.vendor}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
