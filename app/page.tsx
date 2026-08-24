import Image from 'next/image'
import Link from 'next/link'

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

const WAY = [
  { icon: '/images/1.svg', text: 'Проводимо діагностику здібностей' },
  {
    icon: '/images/2.svg',
    text: 'Визначаємо коло інтересів і можливості їх застосування в професії',
  },
  { icon: '/images/3.svg', text: 'Виділяємо напрямок майбутньої професії' },
  {
    icon: '/images/4.svg',
    text: 'Будуємо індивідуальний освітній трек',
  },
  {
    icon: '/images/5.svg',
    text: 'Формуємо ефективний маршрут навчання',
  },
]

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

const BASICS = [
  {
    icon: '/images/shield.svg',
    title: 'Контекст',
    text: 'Освіта невіддільна від того, що відбувається у світі. Промислова революція 4.0, стрімке зростання кількості інформації, цифрові екосистеми, штучний інтелект, онлайн-навчання. Середовище диктує свої умови для навчання й адаптації. Старі освітні системи занадто масивні для швидкого реагування, тому шлях нашого навчання в наших руках.',
  },
  {
    icon: '/images/gear.svg',
    title: 'Lifelong learning',
    text: 'Освіта й навчання більше не скуті віковими рамками. Наш освітній потенціал може зростати й розвиватися все життя. Найцінніша навичка сьогодні — самонавчання.',
  },
  {
    icon: '/images/bagage.svg',
    title: 'Мультипрофесіоналізм',
    text: 'Поняття «професія» сьогодні розмивається. Розвиваються гібридні та міждисциплінарні спеціалізації. Монопрофесій стає все менше, або вони зовсім зникають. Сучасний фахівець володіє широким набором компетенцій і навичок, які часто можуть належати до абсолютно різних галузей знань.',
  },
  {
    icon: '/images/pencile.svg',
    title: 'Освітній Форсайт',
    text: 'Форсайт — здатність дивитися вперед і планувати. Майбутнє — не низка випадкових подій, а спланований досвід. Освітній Форсайт — уміння планувати своє навчання й освіту на роки вперед. Так підвищується ефективність навчання й зникає проблема нестачі мотивації: ви чітко розумієте, навіщо ви це вчите.',
  },
]

const PRICING = [
  {
    price: '1700',
    title: 'Тестування',
    items: [
      'не визначилися з напрямком навчання',
      'не знаєте, яка сфера підходить вам найбільше для подальшої освіти',
      'не розумієте свої сильні сторони, здібності та задатки',
      'хотілося б отримати повну картину ваших освітніх перспектив',
      'сумніваєтеся між кількома варіантами і не можете обрати',
      'боїтеся помилитися з вибором спеціальності',
      'не розумієте, як ваші інтереси пов’язані з майбутньою освітою',
    ],
    cta: 'Почати тестування',
    variant: 'light' as const,
  },
  {
    price: '5200',
    title: 'Дизайн Освіти',
    tag: 'тестування + консультація',
    items: [
      'хочете індивідуально спроєктовану освітню стратегію',
      'важливо отримати індивідуальний план навчання',
      'потрібно пройти профорієнтаційне тестування і зрозуміти, як застосувати результати',
      'хочете об’єднати свої інтереси, здібності та реальні можливості',
      'розглядаєте різні країни або формати навчання і не можете визначитися',
      'хочете зрозуміти, який шлях буде найбільш ефективним саме для вас',
      'хочете уникнути помилок і зайвих витрат часу та ресурсів',
    ],
    cta: 'Замовити',
    variant: 'accent' as const,
  },
  {
    price: '3500',
    title: 'Консультація',
    items: [
      'визначилися з напрямком навчання та спеціальністю',
      'складно обрати між кількома університетами',
      'хочете оцінити реальні перспективи освіти в різних країнах',
      'не розумієте, яка мова навчання буде оптимальною',
      'не впевнені, який варіант дасть кращі кар’єрні можливості',
      'потрібно зрозуміти вимоги до вступу та шанси на зарахування',
      'хочете заздалегідь спланувати освітній шлях',
    ],
    cta: 'Замовити',
    variant: 'light' as const,
  },
]

export default function HomePage() {
  return (
    <main className="bg-bg-base">
      {/* Offer */}
      <section className="mx-auto grid max-w-container grid-cols-1 gap-10 px-4 pt-16 md:grid-cols-2">
        <div>
          <h1 className="mb-4 text-3xl font-bold text-dark md:text-5xl">
            Дизайн Освіти
          </h1>
          <p className="mb-6 text-2xl">Сучасна система освітнього проєктування, 
            <br/>
            профільне тестування</p>
          <Image
            src="/images/subtract.svg"
            alt="Дизайн Освіти"
            width={64}
            height={64}
            className="mb-6"
          />
          <p className="max-w-[500px] text-base leading-6">
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
      <section className="mt-16 bg-gradient-to-br from-primary to-secondary py-12">
        <div className="mx-auto grid max-w-container grid-cols-1 gap-10 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROFITS.map((item) => (
            <div key={item.text} className="flex flex-col items-center">
              <Image src={item.icon} alt="" width={40} height={40} />
              <p className="mt-4 text-center text-base text-white">
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
            <div className="space-y-4 text-lg leading-6">
              {ABOUT_PARAGRAPHS.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="aspect-video overflow-hidden rounded-2xl">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/vayiliOI0RI?controls=0"
                title="Дизайн Освіти"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
          <div className="mt-8 max-w-[350px]">
            <Link
              href="/feedback"
              className="flex h-[50px] items-center justify-center rounded-[20px] bg-primary text-lg text-white"
            >
              Відгуки
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
              <p className="text-primary">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Way */}
      <section className="mx-auto max-w-container px-4 py-12">
        <h2 className="mb-4 text-3xl font-bold text-dark md:text-5xl">
          З чого складається Дизайн Освіти
        </h2>
        <div className="grid grid-cols-1 gap-10 py-8 sm:grid-cols-2 lg:grid-cols-5">
          {WAY.map((step) => (
            <div key={step.text} className="flex flex-col items-center gap-3 text-center">
              <Image src={step.icon} alt="" width={56} height={56} />
              <p className="text-base leading-6">{step.text}</p>
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
                    <p>{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 max-w-[350px]">
                <Link
                  href="/feedback"
                  className="flex h-[50px] items-center justify-center rounded-[20px] bg-primary text-lg text-white"
                >
                  Відгуки
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
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
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
                      <p className="mt-1 text-sm text-white/90">{plan.tag}</p>
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
                        <p className="text-sm leading-6">{item}</p>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contacts"
                    className={`mt-8 flex h-[50px] items-center justify-center rounded-[20px] text-lg ${
                      isAccent ? 'bg-white text-primary' : 'bg-primary text-white'
                    }`}
                  >
                    {plan.cta}
                  </Link>
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
              <Image src={item.icon} alt="" width={80} height={80} className="shrink-0" />
              <div>
                <h3 className="mb-2 text-2xl font-medium text-primary">
                  {item.title}
                </h3>
                <p className="leading-6">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="mx-auto grid max-w-container grid-cols-1 items-center gap-10 px-4 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-medium leading-tight text-white md:text-4xl">
              Давайте зробимо ваше
              <br />
              навчання ефективним
            </h2>
            <p className="max-w-[390px] text-white">
              Створити свій власний освітній дизайн, сформувати свою унікальну
              модель навчання, розвитку та кар&apos;єри!
            </p>
          </div>
          <div className="rounded-2xl bg-white p-10">
            <h2 className="mb-5 text-2xl font-medium">
              Отримай індивідуальну профорієнтаційну діагностику
            </h2>
            <p className="mb-2 text-xl font-semibold text-primary">
              1&nbsp;700 грн <span className="text-sm font-normal text-gray-500">/ повний доступ</span>
            </p>
            <Link
              href="/contacts"
              className="mt-6 flex h-[50px] items-center justify-center rounded-[20px] bg-primary text-lg text-white"
            >
              Почати тестування
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
