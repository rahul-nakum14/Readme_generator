import { HOW_IT_WORKS } from '@/lib/constants'
import Image from 'next/image'

export default function HowItWorks() {
  return (
    <section className="w-full bg-secondary-900 text-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary-500">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step, index) => (
            <div key={index} className="bg-secondary-800 p-6 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary-400">{step.title}</h3>
              <p className="text-secondary-300 mb-4">{step.description}</p>
              <Image
                src="/placeholder.svg?height=150&width=200"
                alt={step.title}
                width={200}
                height={150}
                className="rounded-lg mx-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}