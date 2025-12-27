
import React from 'react';
import { Target, Heart, Users, MessageSquare, ArrowRight, Shield, Globe } from 'lucide-react';
import { TRAINERS } from '../constants';
import { Link } from 'react-router-dom';
import Stats from '../components/Stats';

const About: React.FC = () => {
  // Show 6 trainers for leadership
  const leadershipTeam = TRAINERS.slice(0, 6);

  return (
    <div className="pt-20">
      {/* Hero / Who We Are */}
      <section className="bg-white dark:bg-brand-black py-20 md:py-32 relative overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10 order-2 lg:order-1">
               <h1 className="font-display text-6xl md:text-8xl font-bold mb-8 text-gray-900 dark:text-white leading-none">
                WHO WE <span className="text-brand">ARE</span>
              </h1>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  Jedafit is more than just a gym; it is a movement dedicated to the pursuit of physical and mental excellence. Founded on the belief that strength belongs to everyone, we have cultivated a space where beginners and elite athletes alike can push their boundaries without judgment.
                </p>
                <p>
                  Our facility is not merely a collection of weights and machines—it is a laboratory for personal transformation. We combine old-school grit with modern sports science to provide an environment that demands your best and supports you every step of the way. 
                </p>
                <p className="font-bold text-brand text-xl pt-2 border-l-4 border-brand pl-4">
                  We don't just build bodies; we build character, resilience, and community.
                </p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-brand transform rotate-3 rounded-2xl opacity-20 translate-x-4 translate-y-4"></div>
              <img 
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=1200" 
                alt="Jedafit Team Group Photo" 
                className="relative rounded-2xl shadow-2xl w-full h-[400px] md:h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Vision & Mission */}
      <section className="py-24 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Mission */}
              <div className="bg-gray-50 dark:bg-brand-gray p-10 rounded-3xl border-l-8 border-brand shadow-lg hover:shadow-xl transition-shadow">
                 <div className="bg-brand/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-brand" />
                 </div>
                 <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-4">OUR MISSION</h2>
                 <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                   To empower individuals of all fitness levels to exceed their potential through world-class coaching, a supportive community, and an environment that fosters relentless growth. We strive to make fitness accessible, engaging, and transformative.
                 </p>
              </div>

              {/* Vision */}
              <div className="bg-gray-50 dark:bg-brand-gray p-10 rounded-3xl border-l-8 border-gray-900 dark:border-white shadow-lg hover:shadow-xl transition-shadow">
                 <div className="bg-black/5 dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Globe className="h-8 w-8 text-gray-900 dark:text-white" />
                 </div>
                 <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-4">OUR VISION</h2>
                 <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                   To be the global standard for fitness excellence, creating a healthier world where physical strength translates to mental resilience. We envision a community where every member is the hero of their own journey.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="py-24 bg-brand-light dark:bg-brand-gray transition-colors duration-300 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">OUR CORE <span className="text-brand">VALUES</span></h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The principles that guide every rep, every class, and every interaction.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-brand-black p-8 rounded-2xl border-b-4 border-brand shadow-lg hover:-translate-y-2 transition-transform duration-300 group">
               <div className="bg-brand/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand transition-colors">
                  <Users className="h-8 w-8 text-brand group-hover:text-white transition-colors" />
               </div>
               <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Community First</h3>
               <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">We rise by lifting others. Our strength lies in our supportive network where everyone belongs.</p>
            </div>
            
            <div className="bg-white dark:bg-brand-black p-8 rounded-2xl border-b-4 border-brand shadow-lg hover:-translate-y-2 transition-transform duration-300 group">
               <div className="bg-brand/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand transition-colors">
                  <Target className="h-8 w-8 text-brand group-hover:text-white transition-colors" />
               </div>
               <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Relentless Progress</h3>
               <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">We believe in getting 1% better every day. Stagnation is the enemy; growth is the goal.</p>
            </div>

            <div className="bg-white dark:bg-brand-black p-8 rounded-2xl border-b-4 border-brand shadow-lg hover:-translate-y-2 transition-transform duration-300 group">
               <div className="bg-brand/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand transition-colors">
                  <Shield className="h-8 w-8 text-brand group-hover:text-white transition-colors" />
               </div>
               <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Integrity</h3>
               <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">We do the work even when no one is watching. Honest effort yields honest results.</p>
            </div>

            <div className="bg-white dark:bg-brand-black p-8 rounded-2xl border-b-4 border-brand shadow-lg hover:-translate-y-2 transition-transform duration-300 group">
               <div className="bg-brand/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand transition-colors">
                  <Heart className="h-8 w-8 text-brand group-hover:text-white transition-colors" />
               </div>
               <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Inclusivity</h3>
               <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Fitness is for every body. We celebrate diversity and create a safe space for all.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team - Expanded to 6 */}
      <section className="py-20 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="mb-6 md:mb-0">
               <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">THE <span className="text-brand">LEADERSHIP</span></h2>
               <p className="text-gray-600 dark:text-gray-400">The experts guiding your journey.</p>
            </div>
            <Link to="/services" className="text-brand font-bold uppercase tracking-wider flex items-center hover:text-brand-dark">
               View All Staff <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipTeam.map((trainer) => (
              <div key={trainer.id} className="group relative">
                <div className="h-[400px] rounded-2xl overflow-hidden mb-4 relative">
                   <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-multiply"></div>
                   <img 
                      src={trainer.image} 
                      alt={trainer.name} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105" 
                   />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{trainer.name}</h3>
                <p className="text-brand text-sm font-bold uppercase tracking-widest">{trainer.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Talk CTA */}
      <section className="bg-brand py-20 relative overflow-hidden">
         <div className="absolute inset-0 bg-black/10"></div>
         <div className="container mx-auto px-4 relative z-10">
            <div className="bg-white dark:bg-brand-black p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 transform md:translate-y-0">
               <div className="flex items-start space-x-6">
                  <div className="bg-brand/10 p-4 rounded-full hidden sm:block">
                     <MessageSquare className="h-8 w-8 text-brand" />
                  </div>
                  <div>
                     <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">READY TO TALK?</h2>
                     <p className="text-gray-600 dark:text-gray-400 text-lg">Have questions about memberships or programs? We're here to help.</p>
                  </div>
               </div>
               <Link 
                  to="/contact" 
                  className="whitespace-nowrap bg-brand text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-brand-dark transition-colors shadow-lg"
               >
                  Contact Us
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;
