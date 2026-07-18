/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_TAX_RATE_PERCENT: string;
  readonly VITE_RESTAURANT_OPEN_HOUR: string;
  readonly VITE_RESTAURANT_CLOSE_HOUR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
