'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminReviewActions({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function act(action: 'approve' | 'reject') {
    setIsPending(true)
    try {
      if (action === 'approve') {
        await fetch(`/api/admin/reviews/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' }),
        })
      } else {
        await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
      }
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => act('approve')}
        className="h-10 rounded-full bg-primary px-5 text-sm text-white transition hover:opacity-60 disabled:opacity-50"
      >
        Схвалити
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => act('reject')}
        className="h-10 rounded-full border border-black/10 px-5 text-sm text-dark transition hover:border-primary hover:text-primary disabled:opacity-50"
      >
        Відхилити
      </button>
    </div>
  )
}
