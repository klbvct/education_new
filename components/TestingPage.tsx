import Image from 'next/image'
import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Locale } from '../lib/locale'
import { homeContentUk } from '../content/uk/home'
import ReportGallery from './ReportGallery'

// Based on the old academy landing (../academy/app/page.tsx), reworked for parents and the design system.
// The test itself, payment and the report all live in the academy app; this page sends visitors to registration there.
// Prices are written here by hand: change them together with the academy settings.
const REGISTER_URL = 'https://academy.education-design.com.ua/register'

// Pages of the report mockup with invented results (sample name «Анна Коваленко»), never a real client's report
const REPORT_PAGES = Array.from({ length: 10 }, (_, i) => `/test/report-${String(i + 1).padStart(2, '0')}.webp`)

// Inline icons, as in HomeIcons.tsx: no icon package
const icon = (paths: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
    {paths}
  </svg>
)
const ICONS = {
  target: icon(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>),
  trend: icon(<><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>),
  question: icon(<><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14" /><path d="M12 17h.01" /></>),
  cap: icon(<><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c0 1 3 3 6 3s6-2 6-3v-5" /></>),
  globe: icon(<><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>),
  check: icon(<><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>),
  bolt: icon(<path d="M13 2 4 14h7l-1 8 9-12h-7z" />),
  flask: icon(<><path d="M9 3h6" /><path d="M10 3v6L4 20a1 1 0 0 0 .9 1.5h14.2A1 1 0 0 0 20 20l-6-11V3" /><path d="M7 15h10" /></>),
  chip: icon(<><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>),
  box: icon(<><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></>),
  brain: icon(<><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z" /><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" /></>),
  map: icon(<><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>),
}

type Item = { icon: ReactNode; title?: string; text: string }

type TestingStrings = {
  hero: { title: string; lead: string; cta: string; price: string; priceNote: string }
  author: { heading: string; items: string[]; reviewsCta: string }
  problems: { heading: string; items: Item[] }
  advantages: { heading: string; items: Item[] }
  steps: { heading: string; items: string[] }
  results: { heading: string; items: string[]; note: string; galleryAlt: string; prev: string; next: string }
  cta: { heading: string; text: string; button: string }
}

const UK: TestingStrings = {
  hero: {
    title: 'Допоможіть дитині визначити напрям навчання',
    lead: 'Онлайн-тестування й детальний звіт із рекомендаціями, щоб разом скласти чітку стратегію освіти та вибору майбутньої професії.',
    cta: 'Розпочати тестування',
    price: '2 500 грн',
    priceNote: 'повний доступ',
  },
  author: {
    heading: 'Автор методики',
    items: homeContentUk.aboutMe.items,
    reviewsCta: homeContentUk.aboutMe.reviewsCta,
  },
  problems: {
    heading: 'Чи знайоме вам це?',
    items: [
      { icon: ICONS.target, text: 'Дитина не може визначити свої таланти та здібності' },
      { icon: ICONS.trend, text: 'Не знає, в якій сфері зможе успішно розвиватися' },
      { icon: ICONS.question, text: 'Сумнівається у своїх силах і правильності вибору' },
      { icon: ICONS.cap, text: 'Наближається вступ, а напрям навчання не обрано' },
      { icon: ICONS.globe, text: "Хочете обрати актуальну галузь для майбутньої кар'єри дитини" },
      { icon: ICONS.check, text: 'Хочете, щоб вибір професії й навчання був упевненим' },
    ],
  },
  advantages: {
    heading: 'Чому Дизайн Освіти?',
    items: [
      { icon: ICONS.bolt, title: 'Швидко, доступно, самостійно', text: 'Дитина проходить тест у будь-який зручний момент, без зайвих кроків.' },
      { icon: ICONS.flask, title: 'Сучасна авторська методика', text: 'Тест поєднує перевірені міжнародні методики з урахуванням глобальних тенденцій в освіті.' },
      { icon: ICONS.chip, title: 'Тренди ринку праці та штучного інтелекту', text: 'Аналіз враховує вплив штучного інтелекту й технологій на ринок праці, щоб вибір був актуальним сьогодні й завтра.' },
      { icon: ICONS.box, title: 'Усе в одному кабінеті', text: 'Особистий кабінет, онлайн-тест, детальний звіт і рекомендації в одному місці.' },
      { icon: ICONS.brain, title: 'Здібності, а не лише інтереси', text: 'Аналізуємо когнітивні здібності, сильні й слабкі сторони, на які можна спиратися у виборі.' },
      { icon: ICONS.map, title: 'Індивідуальна освітня карта', text: 'Не просто перелік професій, а карта галузей, у яких дитина може досягти успіху.' },
    ],
  },
  steps: {
    heading: 'Як це працює',
    items: [
      'Реєстрація і створення особистого кабінету.',
      'Оплата доступу до тестування карткою через WayForPay.',
      'Дитина проходить тест у зручний час, це близько 60 хвилин. Чесні відповіді дають точніші результати.',
      'Тест складається з 8 модулів. До кожного є опис та інструкція, прогрес можна зберегти й продовжити пізніше.',
      'Одразу після завершення ви отримуєте розгорнутий аналіз: спрямованість, типи мислення, мотивацію, цінності, інтереси й особливості сприйняття.',
      'Звіт містить рекомендації до вибору напрямів навчання.',
      'Результати назавжди залишаються в особистому кабінеті.',
    ],
  },
  results: {
    heading: 'Що ви отримаєте після тестування',
    items: [
      'Структуроване розуміння сильних сторін, мислення й потенціалу дитини',
      'Чітке бачення, в яких сферах вона зможе реалізуватися найефективніше',
      'Визначення її типу навчання та розвитку',
      'Розуміння, які напрями їй підходять, а які ні, і чому',
      'Основу для усвідомлених освітніх рішень',
      'Індивідуальний профіль розвитку',
      'Природні схильності та потенційні зони росту',
      'Розуміння, як будувати освітню траєкторію',
    ],
    note: 'Після тестування ви разом із дитиною зрозумієте, куди рухатися далі. Невизначеність перетвориться на стратегію.',
    galleryAlt: 'Сторінка звіту',
    prev: 'Попередня сторінка звіту',
    next: 'Наступна сторінка звіту',
  },
  cta: {
    heading: 'Допоможіть дитині зробити свідомий вибір',
    text: 'Пройдіть тестування й отримайте персональні рекомендації.',
    button: 'Розпочати тестування',
  },
}

// Russian copy follows once the Ukrainian page is approved
const STRINGS: Record<Locale, TestingStrings> = { uk: UK, ru: UK }

const H2 = 'text-3xl font-bold leading-tight text-dark md:text-4xl'
const BUTTON = 'inline-flex h-14 items-center justify-center gap-2 rounded-[32px] px-8 text-base transition hover:opacity-60 lg:h-12'
// The same paper-plane icon as the homepage's main call-to-action button (ConsultationModal.tsx)
const BUTTON_ICON = (
  <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
  </svg>
)

function VideoFrame({ src, autoPlay }: { src: string; autoPlay?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-black/[.06] bg-white shadow-[0_38px_56px_rgba(191,204,225,0.39)]">
      <video className="block aspect-video w-full object-cover" src={src} muted loop playsInline autoPlay={autoPlay} preload="metadata" />
    </div>
  )
}

export default function TestingPage({ locale }: { locale: Locale }) {
  const t = STRINGS[locale]

  return (
    <main className="bg-white text-dark">
      {/* Hero */}
      <section className="pt-16 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto grid max-w-container grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">{t.hero.title}</h1>
            <p className="mb-10 text-lg text-[#757474]">{t.hero.lead}</p>
            <a href={REGISTER_URL} className={`${BUTTON} bg-primary text-white`}>{t.hero.cta}{BUTTON_ICON}</a>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold">{t.hero.price}</span>
              <span className="h-6 w-px bg-black/[.12]" />
              <span className="text-base text-[#757474]">{t.hero.priceNote}</span>
            </div>
          </div>
          <VideoFrame src="/test/report-preview.mp4" autoPlay />
        </div>
      </section>

      {/* Author, the same block as «Про мене» on the homepage */}
      <section className="bg-bg-base py-20">
        <div className="mx-auto max-w-container px-4">
          <h2 className={`${H2} mb-12`}>{t.author.heading}</h2>
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <Image
              src="/images/mariana.webp"
              alt={homeContentUk.hero.authorName}
              width={480}
              height={560}
              className="mx-auto h-auto w-full max-w-[420px] rounded-2xl"
            />
            <div>
              <div className="space-y-4">
                {t.author.items.map((text) => (
                  <div key={text} className="grid grid-cols-[24px_1fr] gap-3">
                    <Image src="/images/check_circle_24px.svg" alt="" width={20} height={20} className="mt-1" />
                    <p className="text-base leading-6">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mx-auto mt-8 max-w-[320px]">
                <Link href={locale === 'ru' ? '/ru/feedback' : '/feedback'} className={`${BUTTON} w-full bg-primary text-white`}>
                  {t.author.reviewsCta}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="py-20">
        <div className="mx-auto max-w-container px-4">
          <h2 className={`${H2} mb-12`}>{t.problems.heading}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.problems.items.map((p) => (
              <div key={p.text} className="flex items-start gap-4 rounded-[16px] border border-black/[.06] bg-white p-5">
                <span className="shrink-0 text-primary">{p.icon}</span>
                <p className="text-base leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-bg-base py-20">
        <div className="mx-auto max-w-container px-4">
          <h2 className={`${H2} mb-12`}>{t.advantages.heading}</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {t.advantages.items.map((a, i) => (
              <div key={a.title} className="flex items-start gap-4 rounded-[16px] border border-black/[.06] bg-white p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-primary/[0.06] text-primary">{a.icon}</span>
                <div>
                  <div className="mb-1 text-[13px] font-medium text-primary">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="mb-2 text-lg font-medium leading-snug">{a.title}</h3>
                  <p className="text-base leading-relaxed text-[#757474]">{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-container px-4">
          <h2 className={`${H2} mb-12`}>{t.steps.heading}</h2>
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            {/* Steps divided by thin grey lines, like the detailed lists in the report */}
            <ol className="divide-y divide-black/[.08]">
              {t.steps.items.map((s, i) => (
                <li key={s} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  {/* Same number style as the report sections: grey Surface circle, blue digits */}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5] text-[14px] font-medium leading-none text-primary min-[992px]:h-12 min-[992px]:w-12 min-[992px]:text-[16px]">{String(i + 1).padStart(2, '0')}</span>
                  <p className="flex-1 text-base leading-relaxed">{s}</p>
                </li>
              ))}
            </ol>
            <VideoFrame src="/test/how-it-works.mp4" autoPlay />
          </div>
        </div>
      </section>

      {/* Results: list on the left, pages of a sample report on the right, as on the old landing */}
      <section className="bg-bg-base py-20">
        <div className="mx-auto max-w-container px-4">
          <h2 className={`${H2} mb-12`}>{t.results.heading}</h2>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              {t.results.items.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Image src="/images/check_circle_24px.svg" alt="" width={20} height={20} className="mt-1 shrink-0" />
                  <p className="text-base leading-relaxed">{item}</p>
                </div>
              ))}
              <p className="mt-2 border-l-2 border-primary pl-4 text-base leading-relaxed text-[#757474]">{t.results.note}</p>
            </div>
            <ReportGallery images={REPORT_PAGES} alt={t.results.galleryAlt} prevLabel={t.results.prev} nextLabel={t.results.next} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 px-4 text-center">
          <div>
            <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl">{t.cta.heading}</h2>
            <p className="text-lg text-white/80">{t.cta.text}</p>
          </div>
          <div className="flex flex-col items-center gap-5">
            <a href={REGISTER_URL} className={`${BUTTON} bg-white text-primary`}>{t.cta.button}{BUTTON_ICON}</a>
            <div className="flex items-center gap-2 text-white/80">
              <span className="text-xl font-bold text-white">{t.hero.price}</span>
              <span className="h-4 w-px bg-white/40" />
              <span className="text-base">{t.hero.priceNote}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
