/**
 * Sentry server-side configuration.
 * Captures unhandled exceptions in API routes and server components.
 */

import * as Sentry from '@sentry/nextjs';

const tracesSampleRate = parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACE_RATE ?? '1.0');

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate,
  debug: false,
  environment: process.env.NODE_ENV,
});
