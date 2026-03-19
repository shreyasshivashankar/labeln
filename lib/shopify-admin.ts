/**
 * Shopify Admin API client.
 * Used by the admin panel to fetch orders.
 * Requires SHOPIFY_ADMIN_ACCESS_TOKEN from a Custom App in Shopify admin.
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

const endpoint = `https://${domain}/admin/api/2024-10/graphql.json`;

export async function shopifyAdminFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!domain || !adminToken) {
    throw new Error('Shopify Admin API not configured. Set SHOPIFY_ADMIN_ACCESS_TOKEN.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };

  if (json.errors?.length) {
    throw new Error(`Shopify Admin API error: ${json.errors.map((e) => e.message).join(', ')}`);
  }

  if (!json.data) {
    throw new Error('Shopify Admin API returned no data');
  }

  return json.data;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ShopifyAdminOrder {
  id: string;
  name: string; // e.g. "#1001"
  createdAt: string;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  customer: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        variantTitle: string | null;
        quantity: number;
        product: {
          id: string;
        } | null;
      };
    }>;
  };
}

// ─── Queries ─────────────────────────────────────────────────────────────────

const ordersQuery = `
  query Orders($first: Int!, $query: String) {
    orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          createdAt
          displayFulfillmentStatus
          displayFinancialStatus
          customer {
            firstName
            lastName
            email
          }
          lineItems(first: 20) {
            edges {
              node {
                title
                variantTitle
                quantity
                product {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Fetchers ────────────────────────────────────────────────────────────────

/** Fetch recent orders, optionally filtered by query string */
export async function getOrders(first = 50, query?: string) {
  const data = await shopifyAdminFetch<{
    orders: { edges: Array<{ node: ShopifyAdminOrder }> };
  }>(ordersQuery, { first, query: query || null });

  return data.orders.edges.map((e) => e.node);
}

/** Check if an order has any "Custom" size line items */
export function hasCustomItems(order: ShopifyAdminOrder): boolean {
  return order.lineItems.edges.some(
    (e) => e.node.variantTitle?.toLowerCase().includes('custom')
  );
}
