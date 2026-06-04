/**
 * Type declarations for Google Analytics 4 (gtag.js).
 *
 * Extends the global Window interface so `window.gtag` and
 * `window.dataLayer` can be used without TypeScript errors.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
  dataLayer: Record<string, any>[];
  gtag: (...args: any[]) => void;
}
