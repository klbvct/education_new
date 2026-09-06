import { randomUUID } from 'crypto'
import { getDb } from './db'

export type ConsultationRequestStatus = 'new' | 'contacted' | 'closed'

export type ConsultationRequest = {
  id: string
  createdAt: string
  firstName: string
  lastName: string
  email: string
  phone: string
  messenger: string
  message: string
  serviceLabel: string | null
  locale: string
  status: ConsultationRequestStatus
}

type ConsultationRequestRow = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  messenger: string
  message: string
  service_label: string | null
  locale: string
  status: string
}

function fromRow(row: ConsultationRequestRow): ConsultationRequest {
  return {
    id: row.id,
    createdAt: row.created_at,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    messenger: row.messenger,
    message: row.message,
    serviceLabel: row.service_label,
    locale: row.locale,
    status: row.status === 'contacted' || row.status === 'closed' ? row.status : 'new',
  }
}

export async function getConsultationRequests(): Promise<ConsultationRequest[]> {
  const rows = getDb()
    .prepare('SELECT * FROM consultation_requests ORDER BY created_at DESC')
    .all() as ConsultationRequestRow[]
  return rows.map(fromRow)
}

export async function addConsultationRequest(input: {
  firstName: string
  lastName: string
  email: string
  phone: string
  messenger: string
  message: string
  serviceLabel?: string | null
  locale: string
}): Promise<ConsultationRequest> {
  const request: ConsultationRequest = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    messenger: input.messenger,
    message: input.message,
    serviceLabel: input.serviceLabel ?? null,
    locale: input.locale,
    status: 'new',
  }
  getDb()
    .prepare(
      `INSERT INTO consultation_requests (id, created_at, first_name, last_name, email, phone, messenger, message, service_label, locale, status)
       VALUES (@id, @createdAt, @firstName, @lastName, @email, @phone, @messenger, @message, @serviceLabel, @locale, @status)`,
    )
    .run(request)
  return request
}

export async function updateConsultationRequestStatus(
  id: string,
  status: ConsultationRequestStatus,
): Promise<boolean> {
  const result = getDb()
    .prepare('UPDATE consultation_requests SET status = ? WHERE id = ?')
    .run(status, id)
  return result.changes > 0
}

export async function deleteConsultationRequest(id: string): Promise<boolean> {
  const result = getDb().prepare('DELETE FROM consultation_requests WHERE id = ?').run(id)
  return result.changes > 0
}
