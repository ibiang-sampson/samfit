import React from 'react';
import { SERVICES } from '../constants';
import * as LucideIcons from 'lucide-react';

const Services: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="bg-white dark:bg-brand-black py-20 text-center transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h1 
             className="font-display text-6xl md:text-8xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            OUR <span className="text-brand">SERVICES</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Comprehensive fitness solutions tailored to your unique journey.
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-light dark:bg-brand-gray transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => {
              // Dynamic icon component
              const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Dumbbell;
              
              return (
                <div
                  key={service.id}
                  className="bg-white dark:bg-brand-black p-8 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-brand shadow-lg hover:shadow-brand/20 transition-all group"
                >
                  <div className="w-14 h-14 bg-brand rounded-xl flex items-center justify-center mb-6 text-white group-hover:rotate-12 transition-transform">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-3xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-brand transition-colors">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <button className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white border-b-2 border-brand pb-1 hover:text-brand dark:hover:text-brand transition-colors">
                    Learn More
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