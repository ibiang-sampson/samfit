import React, { useState } from 'react';
import { Check, Plus, Minus } from 'lucide-react';
import { PRICING_PLANS, PRICING_FAQS } from '../constants';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="pt-20">
      <section className="bg-white dark:bg-brand-black py-20 text-center transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 text-gray-900 dark:text-white">MEMBERSHIP <span className="text-brand">PLANS</span></h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Invest in yourself. Choose the plan that fits your lifestyle.
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-light dark:bg-brand-gray transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRICING_PLANS.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 flex flex-col h-full shadow-xl transition-all ${plan.isPopular ? 'bg-brand text-white transform md:-translate-y-4 shadow-brand/20' : 'bg-white dark:bg-brand-black border border-gray-100 dark:border-white/10'}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-3 py-1 uppercase rounded-bl-lg rounded-tr-lg">
                    Most Popular
                  </div>
                )}
                <h3 className={`font-display text-3xl font-bold mb-2 ${plan.isPopular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{plan.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className={`text-4xl font-bold ${plan.isPopular ? 'text-white' : 'text-brand'}`}>{plan.price}</span>
                  <span className={`ml-2 text-sm ${plan.isPopular ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={`h-5 w-5 mr-3 shrink-0 ${plan.isPopular ? 'text-white' : 'text-brand'}`} />
                      <span className={`text-sm ${plan.isPopular ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/program-signup"
                  state={{ membershipPlan: plan.name }}
                  className={`w-full py-3 rounded-full font-bold uppercase tracking-wider text-center transition-all ${
                    plan.isPopular 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white'
                  }`}
                >
                  Join Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white">FREQUENTLY ASKED <span className="text-brand">QUESTIONS</span></h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {PRICING_FAQS.map((faq, index) => (
              <div key={index} className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 bg-gray-50 dark:bg-brand-gray hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left focus:outline-none"
                >
                  <span className="font-bold text-lg text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  {openFaqIndex === index ? (
                    <Minus className="h-5 w-5 text-brand shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-brand shrink-0" />
                  )}
                </button>
                <div 
                  className={`bg-white dark:bg-black/20 px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-48 py-6 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                >
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;