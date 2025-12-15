import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, Clock, Users, Trophy } from 'lucide-react';
import { PROGRAMS, TRAINERS, TESTIMONIALS, HERO_SLIDES, TRANSFORMATION_GALLERY } from '../constants';
import Stats from '../components/Stats';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {HERO_SLIDES.map((slide, index) => (
          index === currentSlide && (
            <div
              key={slide.id}
              className="absolute inset-0 z-0"
            >
              <img 
                src={slide.image}
                alt={slide.alt} 
                className="w-full h-full object-cover filter brightness-[0.4]"
              />
            </div>
          )
        ))}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-transparent to-white/5 dark:to-brand-black pointer-events-none"></div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 
            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-none mb-6 text-white"
          >
            Unleash Your <span className="text-brand">Power</span>
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-10 font-light"
          >
            Premium facilities. Expert coaching. The ultimate fitness community waiting for you.
          </p>
          <div 
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Link to="/program-signup" className="bg-brand text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-brand-dark transition-all transform hover:scale-105 flex items-center justify-center shadow-lg shadow-brand/30">
              Join Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/services" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-brand-black transition-all transform hover:scale-105">
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Featured Programs */}
      <section className="py-20 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">FEATURED <span className="text-brand">PROGRAMS</span></h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Find the perfect training style to match your goals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map((program, index) => (
              <Link 
                key={program.id}
                to="/program-signup" 
                state={{ programTitle: program.title }}
                className="block h-full"
              >
                <div 
                  className="group relative h-96 overflow-hidden rounded-2xl cursor-pointer shadow-xl bg-gray-200 dark:bg-brand-gray"
                >
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6">
                    <h3 className="font-display text-2xl font-bold mb-2 text-white group-hover:text-brand transition-colors">{program.title}</h3>
                    <p className="text-sm text-gray-300 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      {program.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-brand-light dark:bg-brand-gray relative overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">WHY CHOOSE <span className="text-brand">SAMFIT?</span></h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                We are not just a gym; we are a community dedicated to your growth. With state-of-the-art equipment and world-class trainers, we provide the environment you need to succeed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-brand/10 p-3 rounded-lg"><Trophy className="h-6 w-6 text-brand" /></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">Expert Trainers</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Certified professionals to guide your journey.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-brand/10 p-3 rounded-lg"><Clock className="h-6 w-6 text-brand" /></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">Flexible Hours</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Open 24/7 for your convenience.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-brand/10 p-3 rounded-lg"><Users className="h-6 w-6 text-brand" /></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">Community</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Join a supportive network of like-minded individuals.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-brand/10 p-3 rounded-lg"><CheckCircle className="h-6 w-6 text-brand" /></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">Top Equipment</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Latest gear for maximum results.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-brand/20 rounded-full blur-3xl"></div>
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800" alt="Gym Interior" className="relative rounded-2xl shadow-2xl border border-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section className="py-20 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">MEET THE <span className="text-brand">TEAM</span></h2>
            <p className="text-gray-600 dark:text-gray-400">Train with the best in the industry.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRAINERS.slice(0, 4).map((trainer, index) => (
              <div 
                key={trainer.id}
                className="bg-brand-light dark:bg-brand-gray rounded-xl overflow-hidden group shadow-lg"
              >
                <div className="h-96 overflow-hidden">
                  <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter grayscale group-hover:grayscale-0" />
                </div>
                <div className="p-6 text-center relative">
                   <div className="absolute -top-8 inset-x-0 flex justify-center">
                     <div className="bg-brand text-white px-4 py-1 font-bold text-sm uppercase tracking-wide rounded shadow-lg">
                       Trainer
                     </div>
                   </div>
                   <h3 className="font-display text-2xl font-bold mb-1 text-gray-900 dark:text-white">{trainer.name}</h3>
                   <p className="text-brand text-sm font-medium uppercase tracking-widest">{trainer.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-brand-gray/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
           <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-white">SUCCESS <span className="text-brand">STORIES</span></h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {TESTIMONIALS.map((t, i) => (
               <div 
                 key={t.id}
                 className="bg-white dark:bg-brand-black p-8 rounded-2xl border border-gray-100 dark:border-white/5 relative shadow-xl"
               >
                 <div className="flex text-brand mb-4">
                   {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                 </div>
                 <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{t.text}"</p>
                 <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-brand/10 dark:bg-brand/20 flex items-center justify-center font-bold text-brand mr-3">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                      <p className="text-xs text-gray-500 uppercase">{t.role}</p>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Moments of Transformation Gallery */}
      <section className="py-20 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">MOMENTS OF <span className="text-brand">TRANSFORMATION</span></h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Real people. Real effort. Real results. See what happens inside Samfit.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TRANSFORMATION_GALLERY.map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-2xl h-64 md:h-80 cursor-pointer">
                <img 
                  src={item.image} 
                  alt={item.caption} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white font-display text-2xl font-bold tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-brand relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">READY TO START?</h2>
          <p className="text-white/90 text-xl max-w-2xl mx-auto mb-10 font-medium">
            Join Samfit today and take the first step towards a stronger, healthier you.
          </p>
          <Link to="/bookings" className="inline-block bg-white text-brand px-10 py-5 rounded-full font-bold text-lg uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-2xl">
            Book Your Session
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;