// app/lib/form-config.ts
// Single GAS endpoint for all forms. Each form sends a `formType` field so the
// script routes submissions to the correct Google Sheet tab.

export const formConfig = {
  formUrl: process.env.NEXT_PUBLIC_GAS_URL ?? '',
} as const;

if (process.env.NODE_ENV === 'development' && !formConfig.formUrl) {
  console.warn('[form-config] NEXT_PUBLIC_GAS_URL is not set — form submissions will fail.');
}
