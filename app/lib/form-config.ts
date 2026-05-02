// app/lib/form-config.ts
// Backend URL configuration for GAS (Google Apps Script) form endpoints

export const formConfig = {
  pledgeUrl: process.env.NEXT_PUBLIC_GAS_PLEDGE_URL ?? '',
  commitmentUrl: process.env.NEXT_PUBLIC_GAS_COMMITMENT_URL ?? '',
} as const;

if (process.env.NODE_ENV === 'development') {
  if (!formConfig.pledgeUrl) {
    console.warn('[form-config] NEXT_PUBLIC_GAS_PLEDGE_URL is not set — pledge submissions will be no-ops.');
  }
  if (!formConfig.commitmentUrl) {
    console.warn('[form-config] NEXT_PUBLIC_GAS_COMMITMENT_URL is not set — commitment submissions will be no-ops.');
  }
}
