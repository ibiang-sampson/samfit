
import React from 'react';
import { SERVICES } from '../constants';
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="bg-white dark:bg-brand-black py-20 text-center transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h1 
             className="font-display text-6xl md:text-8xl font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-tight"
          >
            ELITE <span className="text-gradient">PROGRAMS</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-xl font-light">
            Comprehensive high-performance solutions engineered for your success.
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-light dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => {
              const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Dumbbell;
              
              return (
                <div
                  key={service.id}
                  className="glass-card p-8 rounded-3xl border border-white/5 hover:border-brand/40 shadow-xl transition-all group flex flex-col h-full"
                >
                  <div className="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform shadow-lg shadow-brand/30">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-4xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-brand transition-colors uppercase tracking-tight">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-grow font-light">
                    {service.description}
                  </p>
                  <button className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-brand group-hover:text-white transition-colors">
                    <span>Performance Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
