import { Toaster } from 'react-hot-toast';

/**
 * Mounted once at the app root (see Module 3 — Application Layout).
 * Styling reads the same CSS variables as the rest of the UI so toasts
 * always match the current theme without a separate light/dark branch.
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'hsl(var(--surface))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          fontSize: '0.875rem',
          borderRadius: '0.75rem',
          padding: '0.75rem 1rem',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: 'hsl(var(--surface))' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: 'hsl(var(--surface))' },
        },
      }}
    />
  );
}
