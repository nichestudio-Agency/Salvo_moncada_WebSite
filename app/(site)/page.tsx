import { sanityClient } from '@/lib/sanity/client'
import { opereInEvidenzaQuery } from '@/lib/sanity/queries'
import { Opera } from '@/types/sanity'
import HeroSection from '@/components/sections/HeroSection'
import OpereInEvidenzaSection from '@/components/sections/OpereInEvidenzaSection'
import AboutBriefSection from '@/components/sections/AboutBriefSection'
import ProcessoCreativoSection from '@/components/sections/ProcessoCreativoSection'
import QuoteSection from '@/components/sections/QuoteSection'

export default async function HomePage() {
  let opereInEvidenza: Opera[] = []

  try {
    opereInEvidenza = await sanityClient.fetch(opereInEvidenzaQuery)
  } catch {
    // Sanity non configurato o nessun dato — usa array vuoto
  }

  return (
    <>
      <HeroSection />
      <OpereInEvidenzaSection opere={opereInEvidenza} />
      <AboutBriefSection />
      <ProcessoCreativoSection />
      <QuoteSection />
    </>
  )
}
