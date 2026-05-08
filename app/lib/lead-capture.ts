// app/lib/lead-capture.ts
// SSR-safe localStorage helpers for lead capture gating.
// Imported by client components; no React dependency.

/** The localStorage key used to persist lead capture completion. Stores the user's email string. */
export const LEAD_CAPTURE_KEY = 'gghn_lead_email';

/**
 * Returns true if the user has already submitted the lead capture form.
 * Guards against SSR — always returns false on the server.
 */
export function hasCompletedLeadCapture(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(LEAD_CAPTURE_KEY));
}

/**
 * Marks lead capture as complete by writing the user's email to localStorage.
 * Guards against SSR — no-op on the server.
 */
export function markLeadCaptureComplete(email: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LEAD_CAPTURE_KEY, email);
}
