/**
 * Sentry client-side configuration.
 * Captures unhandled exceptions in the browser.
 */

import * as Sentry from '@sentry/nextjs';

// Default to 1.0 (100%) for launch visibility. Dial down via env var once traffic
// grows — avoids a code push to change sample rate.
const tracesSampleRate = parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACE_RATE ?? '1.0');

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate,
  debug: false,
  environment: process.env.NODE_ENV,
});
