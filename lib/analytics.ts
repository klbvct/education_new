declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

export type PurchaseItem = {
  itemId: string
  itemName: string
  price: number
}

export type PurchaseUserData = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

// GA4 Enhanced Ecommerce "purchase" event, read by GTM's GA4 Event tag.
export function pushPurchaseEvent(params: {
  transactionId: string
  currency?: string
  items: PurchaseItem[]
  userData?: PurchaseUserData
}) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  const value = params.items.reduce((sum, item) => sum + item.price, 0)

  // Clears any previous ecommerce object so it isn't merged into this push.
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event: 'purchase',
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
    ecommerce: {
      transaction_id: params.transactionId,
      value,
      currency: params.currency ?? 'UAH',
      items: params.items.map((item) => ({
        item_id: item.itemId,
        item_name: item.itemName,
        price: item.price,
        quantity: 1,
      })),
    },
  })
}
