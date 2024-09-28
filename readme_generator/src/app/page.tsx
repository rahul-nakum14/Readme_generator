// src/app/page.tsx
import { Metadata } from 'next'
import Header from '@/components/Header/Header'
import Hero from '@/components/Hero/Hero'
import Features from '@/components/Features/Features'
import HowItWorks from '@/components/HowItWorks/HowItWorks'
import CallToAction from '@/components/CallToAction/CallToAction'
import Footer from '@/components/Footer/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}
