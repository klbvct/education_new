import CourseRequestForm from './CourseRequestForm'
import { IconGlobe, IconInfinity, IconLayers, IconForesight } from './HomeIcons'
import type { Locale } from '../lib/locale'

const STRINGS: Record<
  Locale,
  {
    hiddenTitle: string
    heroTag: string
    heroTitle: string
    heroSubtitle: string
    heroCta: string
    priceLabel: string
    forWhomHeading: string
    forWhomItems: string[]
    programHeading: string
    programSteps: { number: string; title: string; text: string }[]
    detailsHeading: string
    detailsItems: { icon: typeof IconGlobe; title: string; text: string }[]
    priceHeading: string
    priceTag: string
    priceCta: string
    formHeading: string
  }
> = {
  uk: {
    hiddenTitle: 'Курс для спеціалістів',
    heroTag: 'Новий курс',
    heroTitle: 'Курс для спеціалістів [назва курсу]',
    heroSubtitle:
      'Короткий опис курсу — для кого він, яку проблему вирішує і що учасник отримає в результаті. [Текст-заглушка, замінити на фінальний опис.]',
    heroCta: 'Записатися на курс',
    priceLabel: '20 000 грн',
    forWhomHeading: 'Кому підійде цей курс',
    forWhomItems: [
      '[Заглушка] Спеціалістам, які хочуть отримати нову навичку',
      '[Заглушка] Тим, хто хоче систематизувати наявний досвід',
      '[Заглушка] Тим, хто планує змінити напрямок роботи',
    ],
    programHeading: 'Програма курсу',
    programSteps: [
      { number: '01', title: '[Модуль 1 — назва]', text: '[Заглушка] Короткий опис теми модуля та що на ньому розглядається.' },
      { number: '02', title: '[Модуль 2 — назва]', text: '[Заглушка] Короткий опис теми модуля та що на ньому розглядається.' },
      { number: '03', title: '[Модуль 3 — назва]', text: '[Заглушка] Короткий опис теми модуля та що на ньому розглядається.' },
      { number: '04', title: '[Модуль 4 — назва]', text: '[Заглушка] Короткий опис теми модуля та що на ньому розглядається.' },
    ],
    detailsHeading: 'Формат навчання',
    detailsItems: [
      { icon: IconGlobe, title: '[Заглушка] Онлайн', text: 'Формат проведення занять — уточнити й замінити.' },
      { icon: IconInfinity, title: '[Заглушка] Доступ до матеріалів', text: 'Тривалість доступу до записів і матеріалів курсу.' },
      { icon: IconLayers, title: '[Заглушка] Структура', text: 'Кількість модулів/занять і їх тривалість.' },
      { icon: IconForesight, title: '[Заглушка] Результат', text: 'Що учасник отримає по завершенню курсу.' },
    ],
    priceHeading: 'Вартість курсу',
    priceTag: '[Заглушка] Що входить у вартість — уточнити перелік.',
    priceCta: 'Записатися на курс',
    formHeading: 'Залишити заявку',
  },
  ru: {
    hiddenTitle: 'Курс для специалистов',
    heroTag: 'Новый курс',
    heroTitle: 'Курс для специалистов [название курса]',
    heroSubtitle:
      'Краткое описание курса — для кого он, какую проблему решает и что участник получит в результате. [Текст-заглушка, заменить на финальное описание.]',
    heroCta: 'Записаться на курс',
    priceLabel: '20 000 грн',
    forWhomHeading: 'Кому подойдёт этот курс',
    forWhomItems: [
      '[Заглушка] Специалистам, которые хотят получить новый навык',
      '[Заглушка] Тем, кто хочет систематизировать имеющийся опыт',
      '[Заглушка] Тем, кто планирует сменить направление работы',
    ],
    programHeading: 'Программа курса',
    programSteps: [
      { number: '01', title: '[Модуль 1 — название]', text: '[Заглушка] Краткое описание темы модуля и что на нём рассматривается.' },
      { number: '02', title: '[Модуль 2 — название]', text: '[Заглушка] Краткое описание темы модуля и что на нём рассматривается.' },
      { number: '03', title: '[Модуль 3 — название]', text: '[Заглушка] Краткое описание темы модуля и что на нём рассматривается.' },
      { number: '04', title: '[Модуль 4 — название]', text: '[Заглушка] Краткое описание темы модуля и что на нём рассматривается.' },
    ],
    detailsHeading: 'Формат обучения',
    detailsItems: [
      { icon: IconGlobe, title: '[Заглушка] Онлайн', text: 'Формат проведения занятий — уточнить и заменить.' },
      { icon: IconInfinity, title: '[Заглушка] Доступ к материалам', text: 'Длительность доступа к записям и материалам курса.' },
      { icon: IconLayers, title: '[Заглушка] Структура', text: 'Количество модулей/занятий и их длительность.' },
      { icon: IconForesight, title: '[Заглушка] Результат', text: 'Что участник получит по завершении курса.' },
    ],
    priceHeading: 'Стоимость курса',
    priceTag: '[Заглушка] Что входит в стоимость — уточнить перечень.',
    priceCta: 'Записаться на курс',
    formHeading: 'Оставить заявку',
  },
}

export default function CoursePage({ locale }: { locale: Locale }) {
  const t = STRINGS[locale]

  return (
    <main className="bg-bg-base">
      <h1 className="sr-only">{t.hiddenTitle}</h1>

      {/* Hero */}
      <section className="mx-auto max-w-container px-4 py-16 md:py-24">
        <span className="mb-4 inline-block rounded-full bg-primary/[0.06] px-4 py-2 text-sm font-medium text-primary">
          {t.heroTag}
        </span>
        <h2 className="mb-6 max-w-[800px] text-3xl font-bold text-dark md:text-5xl">{t.heroTitle}</h2>
        <p className="mb-8 max-w-[600px] text-base leading-6">{t.heroSubtitle}</p>
        <div className="mb-8 text-4xl font-medium text-primary">{t.priceLabel}</div>
        <a
          href="#course-form"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-[32px] bg-primary px-8 text-base text-white transition hover:opacity-60 lg:h-12"
        >
          {t.heroCta}
          <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.6 10.1l7.4-104.9L367.5 151c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
          </svg>
        </a>
      </section>

      {/* For whom */}
      <section className="bg-primary/[0.03] py-12">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-8 text-3xl font-bold text-dark md:text-5xl">{t.forWhomHeading}</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {t.forWhomItems.map((text) => (
              <div key={text} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <p className="text-base leading-6">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program */}
      <section className="mx-auto max-w-container px-4 py-16">
        <h2 className="mb-12 text-3xl font-bold text-dark md:text-5xl">{t.programHeading}</h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {t.programSteps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col rounded-3xl border border-black/5 bg-white p-8 shadow-[0_38px_56px_rgba(191,204,225,0.2)]"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {step.number}
              </div>
              <h3 className="mb-2 text-2xl font-medium text-dark">{step.title}</h3>
              <p className="text-base leading-6">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Details */}
      <section className="bg-primary/[0.03] py-16">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-12 text-3xl font-bold text-dark md:text-5xl">{t.detailsHeading}</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {t.detailsItems.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <item.icon className="h-10 w-10 shrink-0 text-primary" />
                <div>
                  <h3 className="mb-1 text-xl font-medium text-dark">{item.title}</h3>
                  <p className="text-base leading-6">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price + form */}
      <section id="course-form" className="mx-auto max-w-container px-4 py-16 scroll-mt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl bg-primary p-10 text-white shadow-[4px_8px_40px_rgba(8,24,111,0.2)]">
            <div className="mb-6 border-b border-white/20 pb-6">
              <div className="mb-1 text-4xl font-medium">{t.priceLabel}</div>
              <h3 className="text-2xl font-medium text-white">{t.priceHeading}</h3>
              <p className="mt-5 text-base leading-6 text-white/90">{t.priceTag}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-[0_38px_56px_rgba(191,204,225,0.4)] md:p-10">
            <h2 className="mb-6 text-2xl font-medium">{t.formHeading}</h2>
            <CourseRequestForm />
          </div>
        </div>
      </section>
    </main>
  )
}
