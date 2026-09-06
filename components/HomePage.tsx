import Image from 'next/image'
import Link from 'next/link'
import ConsultationModal from './ConsultationModal'
import JsonLd from './JsonLd'
import PricingOrderButton from './PricingOrderButton'
import { homeJsonLd } from '../lib/jsonld'
import type { HomeContent } from '../lib/home-content'
import type { Locale } from '../lib/locale'

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

export default function HomePage({ content, locale }: { content: HomeContent; locale: Locale }) {
  const feedbackHref = locale === 'ru' ? '/ru/feedback' : '/feedback'

  return (
    <main className="bg-bg-base">
      <JsonLd data={homeJsonLd(locale, content.hero.authorBio)} />
      {/* Offer */}
      <section className="mx-auto grid max-w-container grid-cols-1 gap-10 px-4 pt-16 pb-16 md:grid-cols-2 md:pt-24 md:pb-20">
        <div>
          <h1 className="mb-6 text-3xl font-bold text-dark md:text-5xl">{content.hero.title}</h1>
          <p className="mb-8 text-2xl">
            {content.hero.subtitleLines.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
          <Image
            src="/images/subtract.svg"
            alt=""
            width={64}
            height={64}
            className="mb-8"
          />
          <p className="max-w-[500px] text-[16px] leading-6">
            <span className="font-medium">{content.hero.authorName}</span>
            <br />
            {content.hero.authorBio}
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/images/mariana.webp"
            alt={content.hero.authorName}
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
          {content.profits.map((item) => (
            <div key={item.text} className="flex flex-col items-center">
              <Image src={item.icon} alt="" width={40} height={40} />
              <p className="mt-4 text-center text-[16px] text-white">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-8 text-3xl font-bold text-dark md:text-5xl">{content.about.heading}</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-2.5 text-base leading-6">
              {content.about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="aspect-video overflow-hidden rounded-2xl">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/j9enEB92tLM?controls=0"
                title={content.hero.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-[320px]">
            <Link
              href={feedbackHref}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[32px] bg-[#266AF6] px-6 text-base text-white transition hover:opacity-60 lg:h-12"
            >
              {content.about.reviewsCta}
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
          <h2 className="mb-8 text-3xl font-bold text-dark md:text-5xl">{content.needs.heading}</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {content.needs.items.map((text) => (
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
        <h2 className="py-8 text-3xl font-bold text-dark md:text-5xl">{content.tasks.heading}</h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {content.tasks.items.map((text) => (
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
        <h2 className="mb-12 text-3xl font-bold text-dark md:text-5xl">{content.way.heading}</h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {content.way.steps.map((step) => (
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

              {step.note && <p className="mt-4 text-base leading-6">{step.note}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* About me */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-8 text-3xl font-bold text-dark md:text-5xl">{content.aboutMe.heading}</h2>
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <Image
              src="/images/mariana.webp"
              alt={content.hero.authorName}
              width={480}
              height={560}
              className="mx-auto h-auto w-full max-w-[420px] rounded-2xl"
            />
            <div>
              <div className="space-y-4">
                {content.aboutMe.items.map((text) => (
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
                  href={feedbackHref}
                  className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[32px] bg-[#266AF6] px-6 text-base text-white transition hover:opacity-60 lg:h-12"
                >
                  {content.aboutMe.reviewsCta}
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
          <h2 className="mb-12 text-3xl font-bold text-dark md:text-5xl">{content.pricing.heading}</h2>
          <div className="mx-auto grid max-w-[920px] grid-cols-1 gap-10 md:grid-cols-2 md:gap-20">
            {content.pricing.plans.map((plan) => {
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
                      <span className="ml-2 text-base font-normal">{content.pricing.currency}</span>
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
        <h2 className="mb-12 text-3xl font-bold text-dark md:text-5xl">{content.basics.heading}</h2>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {content.basics.items.map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-4 text-left md:flex-row md:items-start md:text-left">
              <item.icon className="h-14 w-14 shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 text-2xl font-medium text-primary">{item.title}</h3>
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
              {content.cta.headingLines.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h2>
            <p className="max-w-[390px] text-base leading-6 text-white">{content.cta.text}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 md:p-10">
            <ConsultationModal />
          </div>
        </div>
      </section>
    </main>
  )
}
