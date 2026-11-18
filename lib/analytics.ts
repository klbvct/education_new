declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

export type LeadUserData = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

// GA4 "generate_lead": a form submission, not a payment. Per the GA4 events
// reference it takes flat params (value, currency, lead_source) and no items,
// so it is pushed without an ecommerce object. value is the full service price.
// Ecommerce events (begin_checkout, purchase) go inside "ecommerce" and are
// sent only by the academy app, for confirmed WayForPay payments.
export function pushLeadEvent(params: {
  value: number
  currency?: string
  leadSource: string
  userData?: LeadUserData
}) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'generate_lead',
    value: params.value,
    currency: params.currency ?? 'UAH',
    lead_source: params.leadSource,
    // Google's standard "user-provided data" shape — read by GTM's Google
    // tag for GA4 user-provided data / Google Ads Enhanced Conversions.
    // Never map these fields into plain GA4 event params/custom
    // dimensions elsewhere — Google's ToS bans sending PII that way.
    ...(params.userData && {
      user_data: {
        email: params.userData.email,
        phone_number: params.userData.phone,
        address: {
          first_name: params.userData.firstName,
          last_name: params.userData.lastName,
        },
      },
    }),
  })
}
