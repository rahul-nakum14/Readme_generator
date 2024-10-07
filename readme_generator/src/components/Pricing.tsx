import { PRICING_PLANS } from '@/lib/constants'

export default function Pricing() {
  return (
    <section className="w-full bg-secondary-800 text-white py-20" id="pricing">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-primary-500">Pricing</h2>
        <p className="text-center text-secondary-300 mb-12 max-w-2xl mx-auto">Choose the perfect plan for your needs and start generating professional READMEs today!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan, index) => (
            <div key={index} className="bg-secondary-900 p-8 rounded-2xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-2xl font-bold mb-4 text-primary-400">{plan.name}</h3>
              <div className="mb-6">
                <p className="text-5xl font-bold text-white">
                  ${plan.price}
                  <span className="text-lg font-normal text-secondary-400">/month</span>
                </p>
              </div>
              <ul className="space-y-3 flex-grow mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-secondary-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-auto btn-primary">
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}