import { useNavigate } from 'react-router-dom'
import { useDemo } from '@/contexts/DemoContext'

import HeroSection from '../components/landing/HeroSection'
import StatsBar from '../components/landing/StatsBar'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import CategoriesSection from '../components/landing/CategoriesSection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

export function Landing() {
  const { enterDemo } = useDemo()
  const navigate = useNavigate()

  const handleTryDemo = (role: 'client' | 'freelancer') => {
    enterDemo(role)
    navigate(role === 'client' ? '/client' : '/freelancer')
  }

  return (
    <>
      <HeroSection onClientClick={() => handleTryDemo('client')} />
      <StatsBar />
      <FeaturesSection />
      <HowItWorksSection />
      <CategoriesSection />
      <CTASection
        onClientClick={() => handleTryDemo('client')}
        onFreelancerClick={() => handleTryDemo('freelancer')}
      />
      <Footer />
    </>
  )
}
