/**
 * Shared brand constants.
 * Update values here — they propagate across the entire site.
 */

export const BRAND = {
  name: 'Label N',
  email: 'labelnllc@gmail.com',
  phone: '+1 (972) 799-9072',
  phoneTel: 'tel:+19727999072',
  domain: 'shoplabeln.com',
} as const;

/**
 * Display names for Shopify variant values.
 * The key is the raw Shopify value, the display name is what customers see.
 * The Shopify variant value itself ("Custom") is what gets sent to Shopify on checkout.
 */
export const VARIANT_DISPLAY_NAMES: Record<string, string> = {
  Custom: 'Made to Measure',
} as const;

/** Check if a variant value represents a custom/made-to-measure order */
export function isCustomVariant(value: string): boolean {
  return value.toLowerCase() === 'custom';
}
