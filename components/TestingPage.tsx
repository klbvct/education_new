import type { Locale } from '../lib/locale'

// The test itself, payment and the report all live in the academy app; this
// page only explains the offer and sends the visitor to registration there.
const REGISTER_URL = 'https://academy.education-design.com.ua/register'
const LOGIN_URL = 'https://academy.education-design.com.ua/login'

const STRINGS: Record<
  Locale,
  {
    title: string
    lead: string
    cta: string
    login: string
    price: string
    priceNote: string
    stepsHeading: string
    steps: { title: string; text: string }[]
    includedHeading: string
    included: string[]
    consultHeading: string
    consultText: string
    consultPrice: string
  }
> = {
  uk: {
    title: 'Профорієнтаційне тестування',
    lead: 'Пройдіть тест самостійно у зручному темпі й отримайте повний звіт із персональними рекомендаціями у власному кабінеті.',
    cta: 'Створити кабінет',
    login: 'Вже маєте кабінет? Увійти',
    price: '2 500 грн',
    priceNote: 'Рекомендації входять у вартість',
    stepsHeading: 'Як це працює',
    steps: [
      { title: 'Створіть кабінет', text: 'Реєстрація займає кілька хвилин.' },
      { title: 'Оплатіть тест', text: 'Доступ відкривається автоматично після оплати.' },
      { title: 'Пройдіть 8 модулів', text: 'Прогрес зберігається, тож можна робити паузи.' },
      { title: 'Отримайте звіт', text: 'Звіт і рекомендації з’являться в кабінеті одразу після завершення.' },
    ],
    includedHeading: 'Що ви отримаєте',
    included: [
      'Повний звіт за 8 модулями тестування',
      'Персональні рекомендації',
      'Постійний доступ до результатів у кабінеті',
      'Можливість завантажити або надрукувати звіт',
    ],
    consultHeading: 'Консультація за результатами',
    consultText:
      'Після тесту можна записатися на консультацію з Мар’яною Калабуховою, авторкою методики Дизайн Освіти. Ви пропонуєте зручний час, а після його узгодження отримуєте рахунок. Консультація не входить у вартість тесту.',
    consultPrice: '5 500 грн',
  },
  ru: {
    title: 'Профориентационное тестирование',
    lead: 'Пройдите тест самостоятельно в удобном темпе и получите полный отчёт с персональными рекомендациями в собственном кабинете.',
    cta: 'Создать кабинет',
    login: 'Уже есть кабинет? Войти',
    price: '2 500 грн',
    priceNote: 'Рекомендации входят в стоимость',
    stepsHeading: 'Как это работает',
    steps: [
      { title: 'Создайте кабинет', text: 'Регистрация занимает несколько минут.' },
      { title: 'Оплатите тест', text: 'Доступ открывается автоматически после оплаты.' },
      { title: 'Пройдите 8 модулей', text: 'Прогресс сохраняется, поэтому можно делать паузы.' },
      { title: 'Получите отчёт', text: 'Отчёт и рекомендации появятся в кабинете сразу после завершения.' },
    ],
    includedHeading: 'Что вы получите',
    included: [
      'Полный отчёт по 8 модулям тестирования',
      'Персональные рекомендации',
      'Постоянный доступ к результатам в кабинете',
      'Возможность скачать или распечатать отчёт',
    ],
    consultHeading: 'Консультация по результатам',
    consultText:
      'После теста можно записаться на консультацию с Марьяной Калабуховой, автором методики Дизайн Образования. Вы предлагаете удобное время, а после его согласования получаете счёт. Консультация не входит в стоимость теста.',
    consultPrice: '5 500 грн',
  },
}

export default function TestingPage({ locale }: { locale: Locale }) {
  const t = STRINGS[locale]

  return (
    <main className="bg-bg-base">
      <section className="mx-auto max-w-container px-4 py-16 md:px-16 lg:px-28">
        <h1 className="text-4xl font-semibold text-dark md:text-5xl">{t.title}</h1>
        <p className="mt-6 max-w-2xl text-dark">{t.lead}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <a
            href={REGISTER_URL}
            className="inline-flex h-14 items-center justify-center rounded-[32px] bg-primary px-10 font-medium text-white transition hover:opacity-60"
          >
            {t.cta}
          </a>
          <div>
            <p className="text-2xl font-semibold text-dark">{t.price}</p>
            <p className="text-sm text-muted">{t.priceNote}</p>
          </div>
        </div>
        <a href={LOGIN_URL} className="mt-6 inline-block text-primary transition hover:opacity-60">
          {t.login}
        </a>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-container px-4 py-16 md:px-16 lg:px-28">
          <h2 className="text-3xl font-semibold text-dark">{t.stepsHeading}</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-2">
            {t.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-[30px] bg-bg-secondary p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-dark">{step.title}</h3>
                  <p className="mt-1 text-dark">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-container gap-10 px-4 py-16 md:grid-cols-2 md:px-16 lg:px-28">
        <div>
          <h2 className="text-3xl font-semibold text-dark">{t.includedHeading}</h2>
          <ul className="mt-6 list-disc space-y-3 pl-5 text-dark">
            {t.included.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[30px] bg-white p-8">
          <h2 className="text-2xl font-semibold text-dark">{t.consultHeading}</h2>
          <p className="mt-4 text-dark">{t.consultText}</p>
          <p className="mt-4 text-2xl font-semibold text-dark">{t.consultPrice}</p>
        </div>
      </section>
    </main>
  )
}
