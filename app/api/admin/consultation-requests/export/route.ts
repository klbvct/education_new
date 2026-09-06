import * as XLSX from 'xlsx'
import { getConsultationRequests, type ConsultationRequestStatus } from '../../../../../lib/consultation-requests'

const STATUS_LABEL: Record<ConsultationRequestStatus, string> = {
  new: 'Нова',
  contacted: 'Зв’язались',
  closed: 'Закрита',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  let requests = await getConsultationRequests()
  if (status === 'new' || status === 'contacted' || status === 'closed') {
    requests = requests.filter((r) => r.status === status)
  }

  const rows = requests.map((r) => ({
    'Дата': new Date(r.createdAt).toLocaleString('uk-UA'),
    "Ім'я": `${r.firstName} ${r.lastName}`.trim(),
    Email: r.email,
    Телефон: r.phone,
    Месенджер: r.messenger,
    Послуга: r.serviceLabel ?? '',
    Повідомлення: r.message,
    Мова: r.locale,
    Статус: STATUS_LABEL[r.status],
  }))

  const sheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Заявки')
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer

  const date = new Date().toISOString().slice(0, 10)
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="zayavky-${date}.xlsx"`,
    },
  })
}
