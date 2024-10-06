import { HERO_CONTENT } from '@/lib/constants'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="w-full bg-secondary-900 text-white py-32 mt-16">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-5xl font-bold mb-6 text-primary-500">{HERO_CONTENT.title}</h1>
          <p className="text-xl mb-8 text-secondary-200">{HERO_CONTENT.description}</p>
          <button className="btn-primary">
            {HERO_CONTENT.cta}
          </button>
        </div>
        <div className="lg:w-1/2">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="AI-powered README generation"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}