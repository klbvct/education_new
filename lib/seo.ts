export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

// uk is always the base/default language (x-default); ru is passed only
// when a ru version of this exact page actually exists (e.g. an
// untranslated blog post has no ru alternate).
export function localizedAlternates(opts: { canonical: string; uk: string; ru?: string }) {
  return {
    alternates: {
      canonical: opts.canonical,
      languages: {
        uk: opts.uk,
        ...(opts.ru ? { ru: opts.ru } : {}),
        'x-default': opts.uk,
      },
    },
  }
}
