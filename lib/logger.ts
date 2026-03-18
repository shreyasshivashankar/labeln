export function logEvent(
  event: string,
  payload: Record<string, unknown>
) {
  const entry = {
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };
  console.info(JSON.stringify(entry));
}

export function logError(event: string, error: unknown, payload?: Record<string, unknown>) {
  const entry = {
    event,
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? error.message : String(error),
    ...payload,
  };
  console.error(JSON.stringify(entry));
}
