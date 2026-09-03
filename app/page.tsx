import Image from 'next/image'
import Link from 'next/link'
import ConsultationModal from '../components/ConsultationModal'
import PricingOrderButton from '../components/PricingOrderButton'

const PROFITS = [
  {
    icon: '/images/stars.svg',
    text: 'допомагає орієнтуватися в різноманітті освітніх закладів і курсів',
  },
  {
    icon: '/images/docs.svg',
    text: 'формує ефективний індивідуальний освітній трек',
  },
  {
    icon: '/images/circle_arrow.svg',
    text: 'створює унікальну траєкторію навчання для кожного',
  },
  {
    icon: '/images/doc.svg',
    text: 'сприяє ефективному процесу у виборі напрямків навчання та перекваліфікації у будь-якому віці',
  },
]

const ABOUT_PARAGRAPHS = [
  'Освіту, як і професійне майбутнє, слід планувати. Крок за кроком, враховуючи поточні зміни у світі та ваші індивідуальні інтереси.',
  'Навчання потрібно складати по кубиках, подібно до Лего. Якісь частини будуть глобальними та основними. Деякі — додаткові можливості, що розширюють ваші компетенції.',
  'Найефективніший шлях в освіті сьогодні — розробити власну траєкторію. Створити унікальний освітній дизайн. З безлічі можливостей вибрати ті, які будуть служити підтримкою у світі, повному несподіванок.',
  'Дизайн Освіти — процес формування індивідуальної освітньої траєкторії для кожного. Створення власного дизайну освіти із сучасних видів і типів навчання (довгострокові програми, онлайн-курси, стажування тощо), враховуючи унікальні особливості та цілі особистості.',
  'Дизайн Освіти допоможе відповісти на питання: хто ви → у чому ваш потенціал → які професійні напрями вам підходять → яку освіту обрати → де навчатись → які компетенції сформувати → як побудувати траєкторію до професійної реалізації.'
]

const NEEDS = [
  'Ви або ваша дитина не можете самостійно визначити ваші цілі навчання та вибрати ВНЗ, не розумієте на що орієнтуватися, як довго вчитися за тією чи іншою спеціальністю, які перспективи після закінчення навчання',
  'Розумієте, у якому професійному напрямку хочете рухатися, але вам потрібен чіткий план у формуванні вашого індивідуального шляху навчання',
  'Потрібна мотивація та підтримка у самореалізації, аналіз вашого потенціалу. Формування стратегії вашого кар&apos;єрного розвитку',
  'Бажаєте створити вашу унікальну модель кар&apos;єри, зібрати наявні навички, доповнити їх актуальними, скласти резюме та зробити новий крок у вашому професійному розвитку',
  'Вашій дитині потрібно пройти діагностику, тестування або залучити інші допоміжні стратегії. Визначитись з напрямком освіти, зрозуміти необхідний обʼєм підготовки, знайти оптимальні шляхи вирішення проблеми вибору спеціалізації',
  'Закінчили бакалаврат і сумніваєтеся, чи потрібно вам йти в магістратуру або вибрати додаткове навчання.',
  'Плануєте вашу базову чи додаткову освіту за кордоном. Але не розумієте який ВНЗ чи напрямок обрати, не знаєте міграційних нюансів',
  'Не знаєте як ваше навчання можливо скомбінувати з іншими навичками, щоб перетворити їх на вдалий карʼєрний шлях',
  'Не розумієте що таке гибридність професій майбутнього і які з них актуальні зараз і будуть потрібні в майбутньому',
]

const TASKS = [
  'Ваша дитина закінчує школу і ви не знаєте як вибрати напрямок навчання',
  'Ви хотіли б дізнатися, як вибрати спеціальність, актуальну в усьому світі',
  'Вам цікаво, які спеціальності затребувані на ринку праці сьогодні і будуть затребувані в майбутньому',
  'Особливості освіти у ВНЗ та Коледжах вам не зрозумілі, ви не знаєте, що таке шифр спеціальності або кваліфікаційний рівень',
  'Мають намір вчитися за кордоном, але не знаєте з чого розпочати підготовку',
  'Вас цікавить вибір спеціальності або професійного спрямування',
  'Хочете ефективно задіяти здібності та інтереси вашої дитини в її майбутній освіті',
  'Хочете спланувати навчання дитини заздалегідь',
]

type Step = {
  number: string
  title: string
  intro: string
  combo?: string[]
  quote?: { from: string; to: string }
  listIntro?: string
  items?: string[]
  flowIntro?: string
  flow?: string[]
  note?: string
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Діагностика',
    intro:
      'Авторська діагностична система є внутрішнім інструментом методології Дизайну Освіти. Вона допомагає комплексно дослідити:',
    items: [
      'цінності',
      'мотивацію',
      'інтереси',
      'сильні сторони',
      'типи мислення',
      'професійні інтереси',
      'здібності',
      'тип сприйняття інформації',
      'особливості інтелектуального профілю',
      'рівень абстрактного мислення',
      'потенційні професійні напрями',
    ],
  },
  {
    number: '02',
    title: 'Індивідуальний профіль',
    intro:
      "Результати діагностики аналізуються не ізольовано. Ми досліджуємо взаємозв'язок між:",
    combo: ['здібності', 'інтереси', 'мислення', 'мотивація', 'цінності', 'професійні середовища'],
    listIntro: 'Це дозволяє визначити:',
    items: [
      'найбільш перспективні галузі навчання',
      'альтернативні напрями',
      'сильні сторони',
      'можливі точки розвитку',
      'компетенції, які варто посилити',
      'потенційні міждисциплінарні комбінації',
    ],
  },
  {
    number: '03',
    title: 'Освітня архітектура',
    intro: 'Перетворити схильності і напрями на конкретний освітній маршрут.',
    quote: { from: 'Що мені підходить?', to: 'Що саме мені потрібно вивчати?' },
    listIntro: 'Ми визначаємо:',
    items: [
      'напрям освіти',
      'можливі спеціальності',
      'тип освітньої програми',
      'необхідний рівень освіти',
      'ключові компетенції',
      'додаткові знання та навички',
      'можливості комбінування різних напрямів',
      'логіку послідовності навчання',
    ],
    note: 'Освіта складається як архітектура, а не вибирається одним рішенням.',
  },
  {
    number: '04',
    title: 'Освітня траєкторія',
    intro: 'Що? Де? У якій послідовності? Навіщо?',
    flowIntro: 'Ми допомагаємо побудувати персональну траєкторію:',
    flow: [
      'Базова освіта',
      'Спеціалізація',
      'Додаткові компетенції',
      'Практичний досвід',
      'Міжнародний досвід',
      'Наступний освітній крок',
    ],
    note: 'Для кожної людини ця комбінація може бути різною. Дизайн Освіти допомагає побачити всю систему цілком.',
  },
]

function ChipRow({ items, connector }: { items: string[]; connector: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {items.map((label, i) => (
        <span key={label} className="flex items-center gap-2">
          <span className="rounded-full bg-primary/[0.06] px-4 py-2 text-sm font-medium text-primary">
            {label}
          </span>
          {i < items.length - 1 && (
            <span className="text-primary/40" aria-hidden="true">
              {connector}
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

const ABOUT_ME = [
  'Понад 15 років працюю у сфері освіти, міжнародного навчання та освітнього консалтингу.',
  'Маю ступінь кандидата наук, сама пройшла складний академічний шлях, працювала викладачем університету і маю досвід в формуванні академічних програм і шляхів їх реалізації у вищої школи. Цей досвід дає мені повноцінне усвідомлення функціонування освіти як багаторівневої складної системи. ',
  'Досвід підприємницької діяльності та освітнього менеджменту: співпраці з Коледжами, Школами та Університетами по всьому світу',
  'Проведено більше 1000 індивідуальних консультацій з визначення професійного шляху для дíтей і дорослих',
  'Маю сертифíкацíю вíд British Council -  фахiвець з навчання в Британiї ',
  'Є дiючим членом мiжнародної органiзацiї ICEF - професiйна пiдготовка у сферi мiжнародного студентського консультування',
  'Пройшла квалiфiкацiйний курс в NYU (New York University, School of Professional Studies) – Executive and Organizational Coaching Certificate',
  'Моя мета: Допомогти людинi навчитися проєктувати власне майбутнє через освiту.'
]

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18" />
    </svg>
  )
}

function IconInfinity({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
    </svg>
  )
}

function IconLayers({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  )
}

function IconForesight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  )
}

const BASICS = [
  {
    icon: IconGlobe,
    title: 'Контекст',
    text: 'Освіта невіддільна від того, що відбувається у світі. Промислова революція 4.0, стрімке зростання кількості інформації, цифрові екосистеми, штучний інтелект, онлайн-навчання. Середовище диктує свої умови для навчання й адаптації. Старі освітні системи занадто масивні для швидкого реагування, тому шлях нашого навчання в наших руках.',
  },
  {
    icon: IconInfinity,
    title: 'Lifelong learning',
    text: 'Освіта й навчання більше не скуті віковими рамками. Наш освітній потенціал може зростати й розвиватися все життя. Найцінніша навичка сьогодні — самонавчання.',
  },
  {
    icon: IconLayers,
    title: 'Мультипрофесіоналізм',
    text: 'Поняття «професія» сьогодні розмивається. Розвиваються гібридні та міждисциплінарні спеціалізації. Монопрофесій стає все менше, або вони зовсім зникають. Сучасний фахівець володіє широким набором компетенцій і навичок, які часто можуть належати до абсолютно різних галузей знань.',
  },
  {
    icon: IconForesight,
    title: 'Освітній Форсайт',
    text: 'Форсайт — здатність дивитися вперед і планувати. Майбутнє — не низка випадкових подій, а спланований досвід. Освітній Форсайт — уміння планувати своє навчання й освіту на роки вперед. Так підвищується ефективність навчання й зникає проблема нестачі мотивації: ви чітко розумієте, навіщо ви це вчите.',
  },
]

const PRICING = [
  {
    id: 'design' as const,
    price: '7200',
    title: 'Дизайн Освіти',
    tag: 'Коли потрібна діогностика + індивідуальна освітня стратегія',
    items: [
      'хочете зрозуміти свої сильні сторони, здібності, задатки, потенціал',
      'не знаєте, який освітній напрям буде найбільш відповідним саме для вас',
      'хочете поєднати свої інтереси, здібності та реальні можливості в єдину освітню стратегію',
      'потребуєте індивідуального плану навчання: що вчити, де вчити та в якій послідовності',
      'розглядаєте різні країни, університети або формати навчання й не можете визначитися з оптимальним варіантом',
      'хочете спланувати вступ і подальший освітній шлях з урахуванням перспектив освітнього напрямку та змін на ринку праці',
      'хочете побудувати довгострокову освітню траєкторію, яка залишатиметься актуальною навіть за зміни професійних планів',
      'хочете уникнути випадкових рішень, зайвих витрат часу та ресурсів і одразу вибудувати ефективний освітній маршрут',
    ],
    cta: 'Замовити',
    variant: 'accent' as const,
  },
  {
    id: 'consultation' as const,
    price: '5500',
    title: 'Консультація',
    tag: 'Коли напрям уже визначений, але потрібно зрозуміти, як рухатися далі',
    items: [
      'не знаєте, де краще навчатися',
      'не впевнені, який варіант дасть кращі кар’єрні можливості',
      'потрібно зрозуміти вимоги до вступу та шанси на зарахування',
      'яку країну розглядати або яка мова навчання буде оптимальною',
      'які компетенції додати або якою має бути наступна освітня сходинка',
      'як спроєктувати освітній шлях',
    ],
    cta: 'Замовити',
    variant: 'light' as const,
  },
]

export default function HomePage() {
  return (
    <main className="bg-bg-base">
      {/* Offer */}
      <section className="mx-auto grid max-w-container grid-cols-1 gap-10 px-4 pt-16 pb-16 md:grid-cols-2 md:pt-24 md:pb-20">
        <div>
          <h1 className="mb-6 text-3xl font-bold text-dark md:text-5xl">
            Дизайн Освіти
          </h1>
          <p className="mb-8 text-2xl">Сучасна система освітнього проєктування,
            <br/>
            профільне тестування</p>
          <Image
            src="/images/subtract.svg"
            alt="Дизайн Освіти"
            width={64}
            height={64}
            className="mb-8"
          />
          <p className="max-w-[500px] text-[16px] leading-6">
            <span className="font-medium">Мар&apos;яна Калабухова</span>
            <br />
            Автор методики Дизайн Освіти, консультант з освіти, навчання і кар&apos;єри, ментор, ступінь PhD, 8 років роботи в університеті, 12+ років досвіду підготовки і зарахування учнів і студентів в найкращі навчальні заклади світу
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/images/mariana.png"
            alt="Мар'яна Калабухова"
            width={420}
            height={500}
            className="h-auto max-h-[500px] w-auto"
            priority
          />
        </div>
      </section>

      {/* Profits */}
      <section className="bg-gradient-to-br from-[#0a4fc4] to-primary py-12">
        <div className="mx-auto grid max-w-container grid-cols-1 gap-10 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROFITS.map((item) => (
            <div key={item.text} className="flex flex-col items-center">
              <Image src={item.icon} alt="" width={40} height={40} />
              <p className="mt-4 text-center text-[16px] text-white">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-8 text-3xl font-bold text-dark md:text-5xl">
            Про проєкт
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-2.5 text-base leading-6">
              {ABOUT_PARAGRAPHS.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="aspect-video overflow-hidden rounded-2xl">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/j9enEB92tLM?controls=0"
                title="Дизайн Освіти"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-[320px]">
            <Link
              href="/feedback"
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[32px] bg-[#266AF6] px-6 text-base text-white transition hover:opacity-60 lg:h-12"
            >
              Відгуки
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Who needs it */}
      <section className="bg-primary/[0.03] py-12">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-8 text-3xl font-bold text-dark md:text-5xl">
            Кому необхідно
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {NEEDS.map((text) => (
              <div key={text} className="grid grid-cols-[24px_1fr] gap-3">
                <Image
                  src="/images/radio_button_checked_24px.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="mt-1"
                />
                <p className="text-base leading-6">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tasks */}
      <section className="mx-auto max-w-container px-4 py-16">
        <h2 className="py-8 text-3xl font-bold text-dark md:text-5xl">
          Вирішує низку комплексних завдань
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {TASKS.map((text) => (
            <div
              key={text}
              className="mx-auto w-full max-w-[300px] rounded-lg bg-[#F9FAFC] p-4 shadow-[0_38px_56px_rgba(191,204,225,0.39)]"
            >
              <p className="text-base leading-6 text-primary">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Way */}
      <section className="mx-auto max-w-container px-4 py-16">
        <h2 className="mb-12 text-3xl font-bold text-dark md:text-5xl">
          З чого складається Дизайн Освіти
        </h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col rounded-3xl border border-black/5 bg-white p-8 shadow-[0_38px_56px_rgba(191,204,225,0.2)]"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {step.number}
              </div>
              <h3 className="mb-2 text-2xl font-medium text-dark">{step.title}</h3>
              <p className="mb-4 text-base leading-6">{step.intro}</p>

              {step.combo && <ChipRow items={step.combo} connector="+" />}

              {step.quote && (
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-lg bg-primary/[0.06] px-4 py-2 text-sm text-gray-500">
                    «{step.quote.from}»
                  </span>
                  <span className="text-primary" aria-hidden="true">
                    →
                  </span>
                  <span className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
                    «{step.quote.to}»
                  </span>
                </div>
              )}

              {step.listIntro && (
                <p className="mb-3 font-medium text-dark">{step.listIntro}</p>
              )}

              {step.items && (
                <div className="space-y-2.5">
                  {step.items.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                      <p className="text-[16px] leading-6">{item}</p>
                    </div>
                  ))}
                </div>
              )}

              {step.flowIntro && (
                <p className="mb-3 font-medium text-dark">{step.flowIntro}</p>
              )}

              {step.flow && <ChipRow items={step.flow} connector="→" />}

              {step.note && (
                <p className="mt-4 text-base leading-6">{step.note}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* About me */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-8 text-3xl font-bold text-dark md:text-5xl">
            Про мене
          </h2>
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <Image
              src="/images/mariana_about.png"
              alt="Мар'яна Калабухова"
              width={480}
              height={560}
              className="mx-auto h-auto w-full max-w-[420px] rounded-2xl"
            />
            <div>
              <div className="space-y-4">
                {ABOUT_ME.map((text) => (
                  <div key={text} className="grid grid-cols-[24px_1fr] gap-3">
                    <Image
                      src="/images/check_circle_24px.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <p className="text-base leading-6">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mx-auto mt-8 max-w-[320px]">
                <Link
                  href="/feedback"
                  className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[32px] bg-[#266AF6] px-6 text-base text-white transition hover:opacity-60 lg:h-12"
                >
                  Відгуки
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-primary/[0.03] py-16">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-12 text-3xl font-bold text-dark md:text-5xl">
            Вартість
          </h2>
          <div className="mx-auto grid max-w-[920px] grid-cols-1 gap-10 md:grid-cols-2 md:gap-20">
            {PRICING.map((plan) => {
              const isAccent = plan.variant === 'accent'
              return (
                <div
                  key={plan.title}
                  className={`flex flex-col rounded-2xl p-10 shadow-[4px_8px_40px_rgba(8,24,111,0.2)] ${
                    isAccent ? 'bg-primary text-white' : 'bg-white'
                  }`}
                >
                  <div
                    className={`mb-6 border-b pb-6 ${
                      isAccent ? 'border-white/20' : 'border-black/10'
                    }`}
                  >
                    <div className="mb-1 text-4xl font-medium">
                      {plan.price}
                      <span className="ml-2 text-base font-normal">гривень</span>
                    </div>
                    <h3
                      className={`text-2xl font-medium ${
                        isAccent ? 'text-white' : 'text-primary'
                      }`}
                    >
                      {plan.title}
                    </h3>
                    {plan.tag && (
                      <p
                        className={`mt-5 text-base leading-6 ${
                          isAccent ? 'text-white/90' : 'text-gray-500'
                        }`}
                      >
                        {plan.tag}
                      </p>
                    )}
                  </div>
                  <ul className="flex-1 space-y-6">
                    {plan.items.map((item) => (
                      <li key={item} className="grid grid-cols-[24px_1fr] gap-3">
                        <Image
                          src={isAccent ? '/images/check-circle-2.svg' : '/images/check-circle-1.svg'}
                          alt=""
                          width={20}
                          height={20}
                          className="mt-0.5"
                        />
                        <p className="text-[16px] leading-6">{item}</p>
                      </li>
                    ))}
                  </ul>
                  <PricingOrderButton
                    service={plan.id}
                    label={plan.cta}
                    className={`mt-8 flex h-14 items-center justify-center rounded-[32px] text-base transition hover:opacity-60 lg:h-12 ${
                      isAccent ? 'bg-white text-primary' : 'bg-primary text-white'
                    }`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Basics */}
      <section className="mx-auto max-w-container px-4 py-16">
        <h2 className="mb-12 text-3xl font-bold text-dark md:text-5xl">
          Основи Дизайну Освіти
        </h2>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {BASICS.map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
              <item.icon className="h-14 w-14 shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 text-2xl font-medium text-primary">
                  {item.title}
                </h3>
                <p className="text-base leading-6">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#0a4fc4] to-primary py-16">
        <div className="mx-auto grid max-w-container grid-cols-1 items-center gap-10 px-4 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-medium leading-tight text-white md:text-4xl">
              Давайте зробимо ваше
              <br />
              навчання ефективним
            </h2>
            <p className="max-w-[390px] text-base leading-6 text-white">
              Створити свій власний освітній дизайн, сформувати свою унікальну
              модель навчання, розвитку та кар&apos;єри!
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 md:p-10">
            <ConsultationModal />
          </div>
        </div>
      </section>
    </main>
  )
}
