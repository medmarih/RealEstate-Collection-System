import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { ProjetsPhares } from '@/components/ProjetsPhares'
import { ExpertiseSection } from '@/components/ExpertiseSection'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <HeroSection />
      <ProjetsPhares />
      <ExpertiseSection />
      <Footer />
    </div>
  )
}
