/**
 * Centralized, typed access to build-time environment variables.
 * Never read `import.meta.env` directly anywhere else in the app —
 * always import `env` from this module so misconfiguration fails fast,
 * in one place, at boot.
 */
function requireEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key] as string | undefined;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  apiBaseUrl: requireEnv('VITE_API_BASE_URL'),
  socketUrl: requireEnv('VITE_SOCKET_URL'),
  appName: import.meta.env.VITE_APP_NAME || 'Restaurant POS',
  taxRatePercent: Number(import.meta.env.VITE_TAX_RATE_PERCENT ?? 20),
  restaurantOpenHour: Number(import.meta.env.VITE_RESTAURANT_OPEN_HOUR ?? 12),
  restaurantCloseHour: Number(import.meta.env.VITE_RESTAURANT_CLOSE_HOUR ?? 23),
  appVersion: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0',
} as const;
