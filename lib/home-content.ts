import type { ComponentType } from 'react'

export type Step = {
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

export type PricingPlan = {
  id: 'design' | 'consultation'
  price: string
  title: string
  tag: string
  items: string[]
  cta: string
  variant: 'accent' | 'light'
}

export type BasicItem = {
  icon: ComponentType<{ className?: string }>
  title: string
  text: string
}

export type HomeContent = {
  hero: {
    title: string
    subtitleLines: string[]
    authorName: string
    authorBio: string
  }
  profits: { icon: string; text: string }[]
  about: {
    heading: string
    paragraphs: string[]
    reviewsCta: string
  }
  needs: {
    heading: string
    items: string[]
  }
  tasks: {
    heading: string
    items: string[]
  }
  way: {
    heading: string
    steps: Step[]
  }
  aboutMe: {
    heading: string
    items: string[]
    reviewsCta: string
  }
  pricing: {
    heading: string
    currency: string
    plans: PricingPlan[]
  }
  basics: {
    heading: string
    items: BasicItem[]
  }
  cta: {
    headingLines: string[]
    text: string
  }
}
