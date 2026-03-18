-- Supabase schema for Label N
-- Run: supabase db push (or apply via Supabase dashboard)
-- Generate types: supabase gen types typescript --local > types/supabase.ts

-- Users table with Shopify identity mapping
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  shopify_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_shopify_customer_id ON users(shopify_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Measurements (user-specific)
CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bust NUMERIC,
  waist NUMERIC,
  hips NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_measurements_user_id ON measurements(user_id);

-- Orders (synced from Shopify webhooks, idempotent by order_id)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  shopify_order_id TEXT,
  user_id UUID REFERENCES users(id),
  shopify_customer_id TEXT,
  total_price DECIMAL(10,2),
  status TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);

-- Webhook idempotency (prevent duplicate processing on retries)
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id TEXT UNIQUE NOT NULL,
  topic TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_events_webhook_id ON webhook_events(webhook_id);
