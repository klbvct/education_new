import { NextResponse } from 'next/server'
import { getConsultationRequests } from '../../../../lib/consultation-requests'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = (searchParams.get('search') ?? '').trim().toLowerCase()
  const status = searchParams.get('status')
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const pageSize = Math.max(1, Number(searchParams.get('pageSize')) || 25)

  const all = await getConsultationRequests()
  let filtered = all
  if (search) {
    filtered = filtered.filter((r) =>
      [r.firstName, r.lastName, r.email, r.phone, r.message]
        .join(' ')
        .toLowerCase()
        .includes(search),
    )
  }
  if (status === 'new' || status === 'contacted' || status === 'closed') {
    filtered = filtered.filter((r) => r.status === status)
  }

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const requests = filtered.slice(start, start + pageSize)

  return NextResponse.json({ requests, pagination: { total, totalPages } })
}
