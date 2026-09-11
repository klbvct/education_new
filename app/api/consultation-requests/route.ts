import { NextResponse } from 'next/server'
import { addConsultationRequest } from '../../../lib/consultation-requests'
import { sendAdminNotification } from '../../../lib/mailer'

type Body = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  messenger?: string
  message?: string
  serviceLabel?: string
  locale?: string
  requestType?: string
}

export async function POST(request: Request) {
  let body: Body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некоректний запит' }, { status: 400 })
  }

  const firstName = (body.firstName ?? '').trim()
  const lastName = (body.lastName ?? '').trim()
  const email = (body.email ?? '').trim()
  const phone = (body.phone ?? '').trim()
  const messenger = (body.messenger ?? '').trim()
  const message = (body.message ?? '').trim()
  const serviceLabel = (body.serviceLabel ?? '').trim()
  const locale = body.locale === 'ru' ? 'ru' : 'uk'
  const isCourse = body.requestType === 'course'

  if (!firstName || !lastName || !email || !phone || !messenger) {
    return NextResponse.json({ error: "Заповніть усі обов'язкові поля" }, { status: 400 })
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Некоректний email' }, { status: 400 })
  }

  const saved = await addConsultationRequest({
    firstName,
    lastName,
    email,
    phone,
    messenger,
    message,
    serviceLabel: serviceLabel || null,
    locale,
  })

  await sendAdminNotification({
    subject: isCourse
      ? locale === 'ru'
        ? 'Новая заявка на Курс - Дизайн Образования'
        : 'Нова заявка на Курс - Дизайн Освіти'
      : locale === 'ru'
        ? `Новая заявка на консультацию${serviceLabel ? ` — ${serviceLabel}` : ''}`
        : `Нова заявка на консультацію${serviceLabel ? ` — ${serviceLabel}` : ''}`,
    text: [
      `Ім'я: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Телефон: ${phone}`,
      `Месенджер: ${messenger}`,
      serviceLabel ? `Послуга: ${serviceLabel}` : null,
      `Мова сайту: ${locale}`,
      '',
      message || '(без повідомлення)',
    ]
      .filter((line) => line !== null)
      .join('\n'),
  })

  return NextResponse.json({ ok: true, id: saved.id }, { status: 201 })
}
