import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="bg-white dark:bg-brand-black py-20 text-center transition-colors duration-300">
        <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 text-gray-900 dark:text-white">GET IN <span className="text-brand">TOUCH</span></h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">We'd love to hear from you. Visit us, call us, or send a message.</p>
      </section>

      <section className="pb-20 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-brand-light dark:bg-brand-gray p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-lg">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-brand mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Location</h3>
                    <p className="text-gray-600 dark:text-gray-400">123 Fitness Blvd<br/>Gym City, GC 90210</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-light dark:bg-brand-gray p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-lg">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-brand mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Contact</h3>
                    <p className="text-gray-600 dark:text-gray-400">Phone: (555) 123-4567<br/>Email: hello@samfit.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-light dark:bg-brand-gray p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-lg">
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-brand mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Hours</h3>
                    <p className="text-gray-600 dark:text-gray-400">Mon-Fri: 5am - 11pm<br/>Sat-Sun: 7am - 9pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-brand-light dark:bg-brand-gray p-8 md:p-12 rounded-2xl border border-gray-100 dark:border-white/5 shadow-lg">
               <h3 className="font-display text-3xl font-bold mb-6 text-gray-900 dark:text-white">SEND A MESSAGE</h3>
               <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <input type="text" placeholder="Your Name" className="w-full bg-white dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none placeholder-gray-500" />
                   <input type="email" placeholder="Your Email" className="w-full bg-white dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none placeholder-gray-500" />
                 </div>
                 <input type="text" placeholder="Subject" className="w-full bg-white dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none placeholder-gray-500" />
                 <textarea rows={6} placeholder="How can we help?" className="w-full bg-white dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none placeholder-gray-500"></textarea>
                 <button className="bg-brand text-white font-bold uppercase px-8 py-4 rounded-lg hover:bg-brand-dark transition-colors shadow-lg">
                   Send Message
                 </button>
               </form>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-12 h-96 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden relative grayscale invert dark:invert-0 hover:grayscale-0 hover:invert-0 transition-all duration-500">
             <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200&grayscale" alt="Map Location" className="w-full h-full object-cover opacity-50" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-brand p-4 rounded-full shadow-2xl animate-bounce">
                   <MapPin className="h-8 w-8 text-white" />
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;