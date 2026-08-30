import nodemailer from 'nodemailer'

// Sends a plain-text notification email to the site admin. Configured
// via env vars (see .env.example); if they're not set, this silently
// no-ops so review submission never fails because email isn't wired
// up yet.
export async function sendAdminNotification({
  subject,
  text,
}: {
  subject: string
  text: string
}): Promise<void> {
  const { SMTP_USER, SMTP_PASSWORD, ADMIN_EMAIL } = process.env
  const to = ADMIN_EMAIL || SMTP_USER

  if (!SMTP_USER || !SMTP_PASSWORD || !to) {
    console.warn(
      '[mailer] SMTP_USER/SMTP_PASSWORD/ADMIN_EMAIL not set — skipping admin notification email.',
    )
    return
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 465)

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  })

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || SMTP_USER,
      to,
      subject,
      text,
    })
  } catch (err) {
    // Never let a broken mail setup break the actual feature (review
    // submission / moderation) that triggered the notification.
    console.error('[mailer] Failed to send admin notification email:', err)
  }
}
