import React from 'react'
import Layout from '../components/Layout'
import HeroSection from '../components/sections/HeroSection'
import HowItWorksSection from '../components/sections/HowItWorksSection'
import FeaturesSection from '../components/sections/FeaturesSection'
// import InvestorSection from '../components/sections/InvestorSection'
import WaitlistSection from '../components/sections/WaitlistSection'
import StatsSection from '../components/sections/StatsSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      {/* <InvestorSection /> */}
      <WaitlistSection />
    </Layout>
  )
}