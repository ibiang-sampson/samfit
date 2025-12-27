
import React, { useState, useEffect } from 'react';
import { Check, Plus, Minus, Zap } from 'lucide-react';
import { PRICING_PLANS, PRICING_FAQS } from '../constants';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Pricing: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="pt-20">
      <section className="bg-white dark:bg-brand-black py-20 text-center transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-tight">INVEST IN <span className="text-gradient">YOU</span></h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-xl font-light">
            Choose the tier that matches your commitment level. No limits.
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-light dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col h-full transition-all duration-500 overflow-hidden ${plan.isPopular ? 'brand-gradient text-white transform md:-translate-y-6 shadow-2xl shadow-brand/30 scale-105' : 'glass-card border border-white/5 text-white shadow-xl'}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-full flex items-center">
                    <Zap className="w-3 h-3 mr-1 fill-current" />
                    Recommended
                  </div>
                )}
                <h3 className="font-display text-4xl font-bold mb-2 uppercase tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className={`ml-2 text-xs font-bold uppercase tracking-widest ${plan.isPopular ? 'text-white/60' : 'text-gray-500'}`}>/month</span>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={`h-5 w-5 mr-3 shrink-0 ${plan.isPopular ? 'text-white' : 'text-brand'}`} />
                      <span className={`text-sm font-light ${plan.isPopular ? 'text-white/90' : 'text-gray-400'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to={user ? "/payment" : "/program-signup"}
                  state={user ? { plan } : { membershipPlan: plan.name }}
                  className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-sm text-center transition-all ${
                    plan.isPopular 
                      ? 'bg-white text-brand hover:bg-gray-100' 
                      : 'bg-white/5 hover:bg-brand hover:text-white border border-white/10'
                  }`}
                >
                  {user ? 'Select Plan' : 'Join Jedafit'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white uppercase tracking-tight">FREQUENTLY ASKED <span className="text-brand">GUIDANCE</span></h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {PRICING_FAQS.map((faq, index) => (
              <div key={index} className="glass-card border border-white/5 rounded-3xl overflow-hidden shadow-lg transition-all hover:border-brand/30">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-7 hover:bg-white/5 transition-colors text-left focus:outline-none"
                >
                  <span className="font-bold text-lg text-gray-900 dark:text-white pr-4 uppercase tracking-tight">{faq.question}</span>
                  {openFaqIndex === index ? (
                    <Minus className="h-5 w-5 text-brand shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-brand shrink-0" />
                  )}
                </button>
                <div 
                  className={`px-7 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-64 py-7 opacity-100 border-t border-white/5' : 'max-h-0 py-0 opacity-0'}`}
                >
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">{faq.answer}</p>
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
