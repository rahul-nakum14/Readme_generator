import { FEATURES } from '@/lib/constants'

export default function Features() {
  return (
    <section className="w-full bg-secondary-800 text-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary-500">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="bg-secondary-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary-400">{feature.title}</h3>
              <p className="text-secondary-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}