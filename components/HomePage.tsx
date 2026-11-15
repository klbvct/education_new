import Image from 'next/image'
import Link from 'next/link'
import ConsultationModal from './ConsultationModal'
import { IconCheck } from './HomeIcons'
import JsonLd from './JsonLd'
import LiteYouTube from './LiteYouTube'
import PricingOrderButton from './PricingOrderButton'
import { homeJsonLd } from '../lib/jsonld'
import type { HomeContent } from '../lib/home-content'
import type { Locale } from '../lib/locale'

function ChipRow({ items, connector }: { items: string[]; connector: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {items.map((label, i) => (
        <span key={label} className="flex items-center gap-2">
          {/* Surface chip at body size (16px) so it reads like the surrounding text; 40px tall like design system tabs */}
          <span className="inline-flex min-h-10 items-center rounded-[20px] bg-[#F5F5F5] px-4 py-2 text-base leading-tight text-black">
            {label}
          </span>
          {i < items.length - 1 && (
            <span className="text-[#9D9D9D]" aria-hidden="true">
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
          <p className="max-w-[500px] text-[18px] leading-6">
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
              <p className="mt-4 text-center text-[18px] text-white">{item.text}</p>
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
              <LiteYouTube videoId="j9enEB92tLM" title={content.hero.title} />
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {content.tasks.items.map((text) => (
            <div
              key={text}
              className="h-full rounded-3xl border border-black/[0.04] bg-white p-6 shadow-[0_16px_29px_-8px_rgba(225,231,242,0.5)]"
            >
              {/* Design system "Body L": black, 16px → 18px from 992px, line-height 1.5 */}
              <p className="text-[16px] leading-[1.5] text-black min-[992px]:text-[18px]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Way: full-width white band, like studyway.com.ua's "Що ви хочете вивчати?" section */}
      <section className="bg-white">
      <div className="mx-auto max-w-container px-4 py-16">
        <h2 className="mb-12 text-3xl font-bold text-dark md:text-5xl">{content.way.heading}</h2>
        {/* No cards: steps are separated by space plus a hairline divider (the design system's table-row
            line, 1px rgba(0,0,0,.06)) — between every step on one column, only between the rows on two */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2">
          {content.way.steps.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col ${i > 0 ? 'border-t border-black/[0.06] pt-10' : ''} ${
                i === 1 ? 'lg:border-t-0 lg:pt-0' : ''
              }`}
            >
              {/* Blue counter digits sit inline before the title, no circle */}
              <h3 className="mb-2 flex items-baseline gap-3 text-2xl font-medium text-dark">
                <span className="text-primary">{step.number}</span>
                <span>{step.title}</span>
              </h3>
              <p className="mb-4 text-base leading-[1.5] min-[992px]:text-[18px]">{step.intro}</p>

              {step.combo && <ChipRow items={step.combo} connector="+" />}

              {step.quote && (
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex min-h-10 items-center rounded-[20px] bg-[#F5F5F5] px-4 py-2 text-base leading-tight text-[#757474]">
                    «{step.quote.from}»
                  </span>
                  <span className="text-[#9D9D9D]" aria-hidden="true">
                    →
                  </span>
                  <span className="inline-flex min-h-10 items-center rounded-[20px] bg-[#F5F5F5] px-4 py-2 text-base font-medium leading-tight text-black">
                    «{step.quote.to}»
                  </span>
                </div>
              )}

              {step.listIntro && (
                <p className="mb-3 font-medium text-dark text-base leading-[1.5] min-[992px]:text-[18px]">{step.listIntro}</p>
              )}

              {step.items && (
                <div className="space-y-1">
                  {step.items.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span
                        className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary min-[992px]:mt-[11px]"
                        aria-hidden="true"
                      />
                      <p className="text-base leading-[1.5] min-[992px]:text-[18px]">{item}</p>
                    </div>
                  ))}
                </div>
              )}

              {step.flowIntro && (
                <p className="mb-3 font-medium text-dark text-base leading-[1.5] min-[992px]:text-[18px]">{step.flowIntro}</p>
              )}

              {step.flow && <ChipRow items={step.flow} connector="→" />}

              {step.note && <p className="mt-4 text-base leading-[1.5] min-[992px]:text-[18px]">{step.note}</p>}
            </div>
          ))}
        </div>
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

      {/* Pricing. Design system: white section, no shadows, both plans on Surface #F5F5F5 24px-radius cards
          (blue is never a large-block background). The main plan is accented only with blue where the system
          allows it (border as a status marker, list markers, the Primary button); the other plan stays black,
          with the design system's Black button (a Bordered one was too faint on the grey card). */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-12 text-3xl font-bold text-dark md:text-5xl">{content.pricing.heading}</h2>
          <div className="mx-auto grid max-w-[920px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            {content.pricing.plans.map((plan) => {
              const isAccent = plan.variant === 'accent'
              return (
                <div
                  key={plan.title}
                  className={`flex flex-col rounded-3xl border-2 bg-[#F5F5F5] p-6 text-black md:p-10 ${
                    isAccent ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <div className="mb-6 border-b border-black/[0.06] pb-6">
                    <div className="mb-1 text-4xl font-medium">
                      {plan.price}
                      <span className="ml-2 text-base font-normal">{content.pricing.currency}</span>
                    </div>
                    <h3 className="text-2xl font-medium">{plan.title}</h3>
                    {plan.tag && (
                      <p className="mt-5 text-base leading-[1.5] text-[#757474] min-[992px]:text-[18px]">
                        {plan.tag}
                      </p>
                    )}
                  </div>
                  <ul className="flex-1 space-y-3">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <IconCheck
                          className={`mt-[2px] h-5 w-5 shrink-0 min-[992px]:mt-[3.5px] ${
                            isAccent ? 'text-primary' : 'text-black'
                          }`}
                        />
                        <p className="text-base leading-[1.5] min-[992px]:text-[18px]">{item}</p>
                      </li>
                    ))}
                  </ul>
                  <PricingOrderButton
                    service={plan.id}
                    label={plan.cta}
                    className={`mt-8 flex h-14 items-center justify-center rounded-[32px] px-6 text-base transition lg:h-12 ${
                      isAccent
                        ? 'bg-primary text-white hover:opacity-60'
                        : 'border-2 border-black bg-black text-white hover:bg-white hover:text-black'
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
            <div key={item.title}>
              {/* Icon sits inline before the title (like the way-step numbers): blue icon as the accent, black title */}
              <h3 className="mb-3 flex items-center gap-3 text-2xl font-medium text-dark">
                <item.icon className="h-10 w-10 shrink-0 text-primary min-[992px]:h-12 min-[992px]:w-12" />
                <span>{item.title}</span>
              </h3>
              <p className="text-base leading-[1.5] min-[992px]:text-[18px]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {/* Deliberate exception kept by request: a blue section background. Flat primary, no gradient, so it
          doesn't add the off-palette #0a4fc4 shade; the form card inside uses the 40px form radius. */}
      <section className="bg-primary py-16">
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
            <p className="max-w-[390px] text-base leading-[1.5] text-white min-[992px]:text-[18px]">{content.cta.text}</p>
          </div>
          <div className="rounded-[40px] bg-white p-6 md:p-10">
            <ConsultationModal />
          </div>
        </div>
      </section>
    </main>
  )
}
