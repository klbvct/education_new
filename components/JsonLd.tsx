// Escaping `<` (per Next.js's own docs on embedding JSON-LD) keeps a
// value like "</script><script>" inside the data from breaking out of
// the script tag — cheap insurance since blog post titles/excerpts are
// admin-authored but still user-supplied text.
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
