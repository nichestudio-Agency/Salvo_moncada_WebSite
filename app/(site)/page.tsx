import { getOpereInEvidenza } from '@/lib/supabase/db'
import HeroSection from '@/components/sections/HeroSection'
import OpereInEvidenzaSection from '@/components/sections/OpereInEvidenzaSection'
import AboutBriefSection from '@/components/sections/AboutBriefSection'
import ProcessoCreativoSection from '@/components/sections/ProcessoCreativoSection'
import QuoteSection from '@/components/sections/QuoteSection'

export default async function HomePage() {
  const opereInEvidenza = await getOpereInEvidenza().catch(() => [])

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
