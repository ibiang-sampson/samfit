import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  CheckCircle, 
  Clock, 
  Users, 
  Trophy, 
  UserPlus, 
  CalendarCheck, 
  Dumbbell, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROGRAMS, TRAINERS, TESTIMONIALS, HERO_SLIDES, TRANSFORMATION_GALLERY } from '../constants';
import Stats from '../components/Stats';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Hero Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Testimonial Auto-Slider
  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(testimonialTimer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {HERO_SLIDES.map((slide, index) => (
          index === currentSlide && (
            <div key={slide.id} className="absolute inset-0 z-0">
              <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover filter brightness-[0.4]" />
            </div>
          )
        ))}
        
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-transparent to-white/5 dark:to-brand-black pointer-events-none"></div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-none mb-6 text-white">
            Unleash Your <span className="text-brand">Power</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-10 font-light">
            Premium facilities. Expert coaching. The ultimate fitness community at Jedafit.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/program-signup" className="bg-brand text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-brand-dark transition-all transform hover:scale-105 flex items-center justify-center shadow-lg shadow-brand/30">
              Join Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/services" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all transform hover:scale-105">
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
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-tight">FEATURED <span className="text-brand">PROGRAMS</span></h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">Find the perfect training style to match your goals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map((program) => (
              <Link key={program.id} to="/program-signup" state={{ programTitle: program.title }} className="block h-full group">
                <div className="relative h-96 overflow-hidden rounded-2xl shadow-xl bg-gray-200 dark:bg-brand-gray border border-transparent group-hover:border-brand/50 transition-all duration-300">
                  <img src={program.image} alt={program.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <h3 className="font-display text-2xl font-bold mb-2 text-white group-hover:text-brand transition-colors uppercase">{program.title}</h3>
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

      {/* Testimonials Slider */}
      <section className="py-24 bg-brand-light dark:bg-brand-gray transition-colors duration-300 overflow-hidden">
        <div className="container mx-auto px-4 relative">
           <div className="text-center mb-16">
             <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-tight">SUCCESS <span className="text-brand">STORIES</span></h2>
           </div>

           <div className="max-w-4xl mx-auto relative h-[300px] md:h-[250px]">
             <AnimatePresence mode='wait'>
               <motion.div key={currentTestimonial} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }} className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                 <div className="flex text-brand mb-6">
                   {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                     <Star key={i} className="h-6 w-6 fill-current" />
                   ))}
                 </div>
                 <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 italic mb-8 font-light">"{TESTIMONIALS[currentTestimonial].text}"</p>
                 <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg mr-4">
                      {TESTIMONIALS[currentTestimonial].name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">{TESTIMONIALS[currentTestimonial].name}</h4>
                      <p className="text-sm text-brand font-medium uppercase">{TESTIMONIALS[currentTestimonial].role}</p>
                    </div>
                 </div>
               </motion.div>
             </AnimatePresence>
           </div>

           <div className="flex justify-center items-center mt-8 space-x-4">
             <button onClick={prevTestimonial} className="p-3 rounded-full bg-white dark:bg-white/5 shadow-md hover:bg-brand hover:text-white transition-all">
                <ChevronLeft className="h-6 w-6" />
             </button>
             <button onClick={nextTestimonial} className="p-3 rounded-full bg-white dark:bg-white/5 shadow-md hover:bg-brand hover:text-white transition-all">
                <ChevronRight className="h-6 w-6" />
             </button>
           </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 brand-gradient relative overflow-hidden flex items-center justify-center">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 uppercase">READY TO JOIN JEDAFIT?</h2>
          <Link to="/bookings" className="inline-block bg-white text-brand px-10 py-5 rounded-full font-bold text-lg uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-2xl">
            Book Your Session
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;