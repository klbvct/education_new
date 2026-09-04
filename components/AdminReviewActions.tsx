'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminReviewActions({
  id,
  onDeleted,
}: {
  id: string
  onDeleted?: () => void
}) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function remove() {
    if (!confirm('Видалити цей відгук назавжди?')) return
    setIsPending(true)
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
      if (onDeleted) {
        onDeleted()
      } else {
        router.refresh()
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={remove}
      className="h-10 rounded-full border border-black/10 px-5 text-sm text-dark transition hover:border-primary hover:text-primary disabled:opacity-50"
    >
      Видалити
    </button>
  )
}
