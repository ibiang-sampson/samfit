import React from 'react';
import { Target, History, Heart } from 'lucide-react';
import { TRAINERS, FACILITY_GALLERY } from '../constants';

const About: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-white dark:bg-brand-black py-20 md:py-32 relative overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-4 relative z-10">
          <h1 
            className="font-display text-6xl md:text-8xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            WHO WE <span className="text-brand">ARE</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl border-l-4 border-brand pl-6">
            Samfit isn't just a place to lift weights. It's a sanctuary for those who refuse to settle for average.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand/5 skew-x-12 hidden md:block"></div>
      </section>

      {/* Mission Vision History */}
      <section className="py-20 bg-brand-light dark:bg-brand-gray transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white dark:bg-brand-black p-8 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-brand/30 transition-colors shadow-lg">
              <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-brand" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400">To empower individuals to transcend their physical limits through discipline, community, and expert guidance.</p>
            </div>
            <div className="bg-white dark:bg-brand-black p-8 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-brand/30 transition-colors shadow-lg">
              <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mb-6">
                <History className="h-6 w-6 text-brand" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our History</h3>
              <p className="text-gray-600 dark:text-gray-400">Founded in 2015, Samfit started in a small garage and has grown into the city's premier fitness destination.</p>
            </div>
            <div className="bg-white dark:bg-brand-black p-8 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-brand/30 transition-colors shadow-lg">
              <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-brand" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-gray-900 dark:text-white">Philosophy</h3>
              <p className="text-gray-600 dark:text-gray-400">Fitness is a journey, not a destination. We believe in sustainable progress over quick fixes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Tour */}
      <section className="py-20 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-12 text-center text-gray-900 dark:text-white">OUR <span className="text-brand">FACILITY</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {FACILITY_GALLERY.map((item, index) => (
               <div 
                 key={item.id}
                 className="relative group rounded-xl overflow-hidden shadow-lg h-64"
               >
                 <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                   <h3 className="text-white font-bold text-xl">{item.title}</h3>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Team Section Again (condensed) */}
      <section className="py-20 bg-brand-light dark:bg-brand-gray transition-colors duration-300">
         <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-12 text-gray-900 dark:text-white">THE <span className="text-brand">LEADERSHIP</span></h2>
            <div className="flex flex-wrap justify-center gap-10">
               {TRAINERS.slice(0, 2).map((t) => (
                  <div key={t.id} className="text-center group">
                    <div className="overflow-hidden rounded-full w-48 h-48 mx-auto mb-4 border-4 border-brand">
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">{t.name}</h3>
                    <p className="text-brand text-sm uppercase">{t.role}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;