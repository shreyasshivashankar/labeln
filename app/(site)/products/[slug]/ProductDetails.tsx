'use client';

import { useState } from 'react';
import type { ShopifyProduct } from '@/types/shopify';
import AddToCartButton from '@/app/components/AddToCartButton';

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

  // Check if a "Custom" variant is selected
  const isCustomSelected = Object.values(selectedOptions).some(
    (v) => v.toLowerCase() === 'custom'
  );

  // Filter out internal tags
  const displayTags = product.tags.filter((t) => t !== 'collection-cover');

  return (
    <div className="flex flex-col justify-start py-6 sticky top-24 self-start">
      {product.productType && (
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-secondary mb-3">
          {product.productType}
        </p>
      )}

      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light">{product.title}</h1>
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

      {/* Custom order info banner */}
      {isCustomSelected && (
        <div className="mt-8 border border-accent/30 bg-accent/5 p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent mb-3">
            Made to Your Measurements
          </p>
          <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
            <p>This garment will be handcrafted to your exact measurements.</p>
            <div className="pt-2 space-y-1.5">
              <p className="flex items-start gap-2">
                <span className="text-accent mt-0.5">1.</span>
                Place your order — we&apos;ll reach out within 24 hours
              </p>
              <p className="flex items-start gap-2">
                <span className="text-accent mt-0.5">2.</span>
                Schedule a measurement session (video call or in-person)
              </p>
              <p className="flex items-start gap-2">
                <span className="text-accent mt-0.5">3.</span>
                Your piece is crafted in 2–3 weeks and shipped to you
              </p>
            </div>
            <p className="pt-2 text-[10px] text-text-secondary/70">
              Custom orders are final sale and cannot be returned or exchanged.
            </p>
          </div>
        </div>
      )}

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

      {/* Product type */}
      {product.productType && (
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-[11px] text-text-secondary">
            <span className="uppercase tracking-[0.15em]">Type:</span> {product.productType}
          </p>
        </div>
      )}
    </div>
  );
}
