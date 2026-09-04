import { NextResponse } from 'next/server'
import { getReviews } from '../../../../lib/reviews'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = (searchParams.get('search') ?? '').trim().toLowerCase()
  const ratingParam = searchParams.get('rating')
  const rating = ratingParam ? Number(ratingParam) : null
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const pageSize = Math.max(1, Number(searchParams.get('pageSize')) || 25)

  const allReviews = await getReviews()
  let filtered = allReviews
  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(search) || r.text.toLowerCase().includes(search),
    )
  }
  if (rating && rating >= 1 && rating <= 5) {
    filtered = filtered.filter((r) => r.rating === rating)
  }

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const reviews = filtered.slice(start, start + pageSize)

  return NextResponse.json({ reviews, pagination: { total, totalPages } })
}
