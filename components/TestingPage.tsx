import Image from 'next/image'
import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Locale } from '../lib/locale'
import { homeContentUk } from '../content/uk/home'
import { homeContentRu } from '../content/ru/home'
import ReportGallery from './ReportGallery'
import { IconCheck } from './HomeIcons'

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
}

type Item = { icon: ReactNode; title?: string; text: string }

type TestingStrings = {
  hero: { title: string; lead: string; cta: string; price: string; priceNote: string }
  author: { heading: string; name: string; items: string[]; reviewsCta: string }
  problems: { heading: string; items: Item[] }
  advantages: { heading: string; items: { title: string; text: string }[] }
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
    name: homeContentUk.hero.authorName,
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
      { title: 'Швидко, доступно, самостійно', text: 'Дитина проходить тест у будь-який зручний момент, без зайвих кроків.' },
      { title: 'Сучасна авторська методика', text: 'Тест поєднує перевірені міжнародні методики з урахуванням глобальних тенденцій в освіті.' },
      { title: 'Тренди ринку праці та штучного інтелекту', text: 'Аналіз враховує вплив штучного інтелекту й технологій на ринок праці, щоб вибір був актуальним сьогодні й завтра.' },
      { title: 'Усе в одному кабінеті', text: 'Особистий кабінет, онлайн-тест, детальний звіт і рекомендації в одному місці.' },
      { title: 'Здібності, а не лише інтереси', text: 'Аналізуємо когнітивні здібності, сильні й слабкі сторони, на які можна спиратися у виборі.' },
      { title: 'Індивідуальна освітня карта', text: 'Не просто перелік професій, а карта галузей, у яких дитина може досягти успіху.' },
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

const RU: TestingStrings = {
  hero: {
    title: 'Помогите ребенку определить направление обучения',
    lead: 'Онлайн-тестирование и подробный отчет с рекомендациями, чтобы вместе выстроить четкую стратегию образования и выбора будущей профессии.',
    cta: 'Начать тестирование',
    price: '2 500 грн',
    priceNote: 'полный доступ',
  },
  author: {
    heading: 'Автор методики',
    name: homeContentRu.hero.authorName,
    items: homeContentRu.aboutMe.items,
    reviewsCta: homeContentRu.aboutMe.reviewsCta,
  },
  problems: {
    heading: 'Вам это знакомо?',
    items: [
      { icon: ICONS.target, text: 'Ребенок не может определить свои таланты и способности' },
      { icon: ICONS.trend, text: 'Не знает, в какой сфере сможет успешно развиваться' },
      { icon: ICONS.question, text: 'Сомневается в своих силах и правильности выбора' },
      { icon: ICONS.cap, text: 'Приближается поступление, а направление обучения не выбрано' },
      { icon: ICONS.globe, text: 'Хотите выбрать актуальную отрасль для будущей карьеры ребенка' },
      { icon: ICONS.check, text: 'Хотите, чтобы выбор профессии и обучения был уверенным' },
    ],
  },
  advantages: {
    heading: 'Почему Дизайн Образования?',
    items: [
      { title: 'Быстро, доступно, самостоятельно', text: 'Ребенок проходит тест в любой удобный момент, без лишних шагов.' },
      { title: 'Современная авторская методика', text: 'Тест сочетает проверенные международные методики с учетом глобальных тенденций в образовании.' },
      { title: 'Тренды рынка труда и искусственного интеллекта', text: 'Анализ учитывает влияние искусственного интеллекта и технологий на рынок труда, чтобы выбор был актуальным сегодня и завтра.' },
      { title: 'Все в одном кабинете', text: 'Личный кабинет, онлайн-тест, подробный отчет и рекомендации в одном месте.' },
      { title: 'Способности, а не только интересы', text: 'Анализируем когнитивные способности, сильные и слабые стороны, на которые можно опираться при выборе.' },
      { title: 'Индивидуальная образовательная карта', text: 'Не просто перечень профессий, а карта отраслей, в которых ребенок может добиться успеха.' },
    ],
  },
  steps: {
    heading: 'Как это работает',
    items: [
      'Регистрация и создание личного кабинета.',
      'Оплата доступа к тестированию картой через WayForPay.',
      'Ребенок проходит тест в удобное время, это около 60 минут. Честные ответы дают более точные результаты.',
      'Тест состоит из 8 модулей. К каждому есть описание и инструкция, прогресс можно сохранить и продолжить позже.',
      'Сразу после завершения вы получаете развернутый анализ: направленность, типы мышления, мотивацию, ценности, интересы и особенности восприятия.',
      'Отчет содержит рекомендации по выбору направлений обучения.',
      'Результаты навсегда остаются в личном кабинете.',
    ],
  },
  results: {
    heading: 'Что вы получите после тестирования',
    items: [
      'Структурированное понимание сильных сторон, мышления и потенциала ребенка',
      'Четкое видение, в каких сферах он сможет реализоваться наиболее эффективно',
      'Определение его типа обучения и развития',
      'Понимание, какие направления ему подходят, а какие нет, и почему',
      'Основу для осознанных образовательных решений',
      'Индивидуальный профиль развития',
      'Природные склонности и потенциальные зоны роста',
      'Понимание, как выстраивать образовательную траекторию',
    ],
    note: 'После тестирования вы вместе с ребенком поймете, куда двигаться дальше. Неопределенность превратится в стратегию.',
    galleryAlt: 'Страница отчета',
    prev: 'Предыдущая страница отчета',
    next: 'Следующая страница отчета',
  },
  cta: {
    heading: 'Помогите ребенку сделать осознанный выбор',
    text: 'Пройдите тестирование и получите персональные рекомендации.',
    button: 'Начать тестирование',
  },
}

const STRINGS: Record<Locale, TestingStrings> = { uk: UK, ru: RU }

const H2 = 'text-3xl font-bold leading-tight text-dark md:text-4xl'
// Design system "Body L", the same body text as the homepage: 16px → 18px from 992px, line-height 1.5
const BODY = 'text-base leading-[1.5] min-[992px]:text-[18px]'
// Soft studyway card shadow, the same one the homepage uses (no off-palette bluish shadow)
const SOFT_SHADOW = 'shadow-[0_16px_29px_-8px_rgba(225,231,242,0.5)]'
// Blue check marker in the site colour (replaces the off-palette #5D71DD check_circle image)
const CHECK = <IconCheck className="mt-[2px] h-5 w-5 shrink-0 text-primary min-[992px]:mt-[3.5px]" />
const BUTTON = 'inline-flex h-14 items-center justify-center gap-2 rounded-[32px] px-8 text-base transition hover:opacity-60 lg:h-12'
// The same paper-plane icon as the homepage's main call-to-action button (ConsultationModal.tsx)
const BUTTON_ICON = (
  <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
  </svg>
)

function VideoFrame({ src, autoPlay }: { src: string; autoPlay?: boolean }) {
  return (
    <div className={`isolate overflow-hidden [transform:translateZ(0)] rounded-[24px] border border-black/[.06] bg-white ${SOFT_SHADOW}`}>
      <video className="block aspect-video w-full bg-white object-cover" src={src} muted loop playsInline autoPlay={autoPlay} preload="metadata" />
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
            <p className={`mb-10 ${BODY}`}>{t.hero.lead}</p>
            <a href={REGISTER_URL} className={`${BUTTON} bg-primary text-white`}>{t.hero.cta}{BUTTON_ICON}</a>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold">{t.hero.price}</span>
              <span className="h-6 w-px bg-black/[.12]" />
              <span className="text-base">{t.hero.priceNote}</span>
            </div>
          </div>
          <VideoFrame src="/test/report-preview.mp4" autoPlay />
        </div>
      </section>

      {/* Author, the same block as «Про мене» on the homepage. Sections alternate white / Surface #F5F5F5 */}
      <section className="bg-[#F5F5F5] py-20">
        <div className="mx-auto max-w-container px-4">
          <h2 className={`${H2} mb-12`}>{t.author.heading}</h2>
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <Image
              src="/images/mariana.webp"
              alt={t.author.name}
              width={480}
              height={560}
              className="mx-auto h-auto w-full max-w-[420px] rounded-[24px]"
            />
            <div>
              <div className="space-y-4">
                {t.author.items.map((text) => (
                  <div key={text} className="grid grid-cols-[24px_1fr] gap-3">
                    {/* Kept by request: the original circled-check image, as in «Про мене» on the homepage */}
                    <Image src="/images/check_circle_24px.svg" alt="" width={20} height={20} className="mt-1" />
                    <p className={BODY}>{text}</p>
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
              // Design system card: Surface #F5F5F5, 24px radius and padding, no border or shadow
              <div key={p.text} className="flex items-start gap-4 rounded-[24px] bg-[#F5F5F5] p-6">
                <span className="shrink-0 text-primary">{p.icon}</span>
                <p className={BODY}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages, in the style of «Кому необхідно» on the homepage */}
      <section className="bg-[#F5F5F5] py-20">
        <div className="mx-auto max-w-container px-4">
          <h2 className={`${H2} mb-12`}>{t.advantages.heading}</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {t.advantages.items.map((a) => (
              <div key={a.title} className="grid grid-cols-[24px_1fr] gap-3">
                {/* Radio-style marker drawn inline in the site blue (replaces the off-palette #5D71DD image) */}
                <svg viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 text-primary" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                </svg>
                <div>
                  <h3 className="mb-2 text-lg font-medium leading-snug">{a.title}</h3>
                  <p className={BODY}>{a.text}</p>
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
            {/* Steps divided by the same hairline as the homepage's way steps (1px rgba(0,0,0,.06)) */}
            <ol className="divide-y divide-black/[.06]">
              {t.steps.items.map((s, i) => (
                <li key={s} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                  {/* Same as the homepage's way steps: blue digits inline before the text, no circle */}
                  <span className={`w-7 shrink-0 font-medium text-primary min-[992px]:w-8 ${BODY}`}>{String(i + 1).padStart(2, '0')}</span>
                  <p className={`flex-1 ${BODY}`}>{s}</p>
                </li>
              ))}
            </ol>
            <VideoFrame src="/test/how-it-works.mp4" autoPlay />
          </div>
        </div>
      </section>

      {/* Results: list on the left, pages of a sample report on the right, as on the old landing */}
      <section className="bg-[#F5F5F5] py-20">
        <div className="mx-auto max-w-container px-4">
          <h2 className={`${H2} mb-12`}>{t.results.heading}</h2>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              {t.results.items.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  {CHECK}
                  <p className={BODY}>{item}</p>
                </div>
              ))}
              {/* Blue notice from the design system («Стани й нотифікації»): 8% blue, radius 20, padding 20 */}
              <p className={`mt-2 rounded-[20px] bg-[rgba(38,106,246,0.08)] p-5 ${BODY}`}>{t.results.note}</p>
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
            <p className={`text-white/80 ${BODY}`}>{t.cta.text}</p>
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
