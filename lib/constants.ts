/**
 * ─── SITE CONSTANTS ──────────────────────────────────────────────────────────
 *
 * Single source of truth for all configurable values across the site.
 * Update values here — they propagate everywhere automatically.
 *
 * Sections:
 *  1. Brand identity
 *  2. Contact & location
 *  3. Founders
 *  4. SEO metadata
 *  5. Navigation & collections
 *  6. Policy values
 *  7. Product & variant display
 */

// ─── 1. BRAND IDENTITY ──────────────────────────────────────────────────────

export const BRAND = {
  name: 'Label N',
  tagline: 'The art of South Asian couture — made for you',
  description:
    'A contemporary South Asian brand redefining modern femininity through sculpted silhouettes and conscious design.',
  domain: 'shoplabeln.com',
} as const;

// ─── 2. CONTACT & LOCATION ──────────────────────────────────────────────────

export const CONTACT = {
  email: 'labelnllc@gmail.com',
  phone: '+1 (972) 799-9072',
  phoneTel: 'tel:+19727999072',
  responseTime: '24 hours',
  address: {
    street: '1378 Bridle Blvd',
    city: 'Frisco',
    state: 'TX',
    zip: '75036',
    country: 'US',
  },
} as const;

export const CONTACT_ADDRESS_FULL = `${CONTACT.address.street}, ${CONTACT.address.city}, ${CONTACT.address.state} ${CONTACT.address.zip}, ${CONTACT.address.country}`;

// ─── 3. FOUNDERS ─────────────────────────────────────────────────────────────

export const FOUNDERS = {
  names: 'Nash & Anu',
  title: 'Founders, Label N',
  photo: '/images/founders.jpg',
} as const;

// ─── 4. SEO METADATA ────────────────────────────────────────────────────────

export const SEO = {
  siteTitle: 'Label N — South Asian Couture',
  siteDescription:
    'Label N is a contemporary South Asian couture brand. Bespoke garments crafted to your measurements.',
  about: `The story behind ${BRAND.name} — bespoke South Asian couture by Nash & Anu.`,
  contact: `Get in touch with ${BRAND.name}. We respond within ${CONTACT.responseTime}.`,
  collections: `Explore ${BRAND.name} collections — each a distinct expression of South Asian artistry and modern design.`,
  privacy: `${BRAND.name} privacy policy — how we collect, use, and protect your personal information.`,
  terms: `${BRAND.name} terms of service, including product policies and custom order terms.`,
  returns: `${BRAND.name} return and refund policy for ready-to-wear and custom outfits.`,
  shipping: `${BRAND.name} shipping information, processing times, and order tracking.`,
  search: `Search ${BRAND.name} products and collections.`,
  couture: `${BRAND.name} Couture experience.`,
} as const;

// ─── 5. NAVIGATION & COLLECTIONS ────────────────────────────────────────────

/** Featured collection handles shown on the homepage (in order) */
export const FEATURED_COLLECTION_HANDLES = [
  'corsets',
  'redefined-drapes-the-contemporary-edit',
  'layered-fits',
] as const;

/** Best sellers collection handle */
export const BEST_SELLERS_HANDLE = 'best-sellers';

/** Footer shop links — update when collections change */
export const FOOTER_SHOP_LINKS = [
  { label: 'The Corset Core', href: '/collections/corsets' },
  { label: 'Drape Theory', href: '/collections/redefined-drapes-the-contemporary-edit' },
  { label: 'Layered Fits', href: '/collections/layered-fits' },
] as const;

/** Couture locations shown in the header dropdown */
export const COUTURE_LOCATIONS = [
  { label: 'New York', href: '/couture/new-york' },
] as const;

// ─── 6. POLICY VALUES ────────────────────────────────────────────────────────

export const POLICY = {
  returnWindow: '7 days',
  restockingFee: '3%',
  customOrderProductionTime: '2 to 3 weeks',
  customOrderFinalSale: true,
  orderResponseTime: '24 hours',
} as const;

// ─── 7. PRODUCT & VARIANT DISPLAY ───────────────────────────────────────────

/**
 * Display names for Shopify variant values.
 * Key = raw Shopify value, Value = what customers see on the product page.
 * The Shopify value ("Custom") is still sent to cart/checkout.
 */
export const VARIANT_DISPLAY_NAMES: Record<string, string> = {
  Custom: 'Made to Measure',
};

/** Check if a variant value represents a custom/made-to-measure order */
export function isCustomVariant(value: string): boolean {
  return value.toLowerCase() === 'custom';
}
