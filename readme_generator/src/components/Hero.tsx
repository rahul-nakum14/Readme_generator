import { HERO_CONTENT } from '@/lib/constants'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="w-full bg-secondary-900 text-white py-32 mt-16">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-5xl font-bold mb-6 text-primary-500">{HERO_CONTENT.title}</h1>
          <p className="text-xl mb-8 text-secondary-200">{HERO_CONTENT.description}</p>
          <a href="/signup" className="btn-primary">
            {HERO_CONTENT.cta}
          </a>
        </div>
        <div className="lg:w-1/2">
          <svg
            width="600"
            height="400"
            viewBox="0 0 600 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-lg shadow-2xl"
          >
            <rect width="600" height="400" fill="#1F2937" />
            <path d="M300 50L550 300H50L300 50Z" fill="#4B5563" />
            <circle cx="300" cy="200" r="100" fill="#6B7280" />
            <rect x="250" y="150" width="100" height="150" fill="#9CA3AF" />
            <path d="M275 175L325 175L300 150L275 175Z" fill="#D1D5DB" />
            <rect x="275" y="200" width="50" height="10" fill="#E5E7EB" />
            <rect x="275" y="220" width="50" height="10" fill="#E5E7EB" />
            <rect x="275" y="240" width="50" height="10" fill="#E5E7EB" />
            <path d="M320 270L280 270L300 290L320 270Z" fill="#F3F4F6" />
            <circle cx="460" cy="80" r="30" fill="#EF4444" />
            <path d="M450 70L470 70L460 60L450 70Z" fill="#F87171" />
            <path d="M450 90L470 90L460 100L450 90Z" fill="#F87171" />
            <rect x="455" y="75" width="10" height="10" fill="#F87171" />
          </svg>
        </div>
      </div>
    </section>
  )
}