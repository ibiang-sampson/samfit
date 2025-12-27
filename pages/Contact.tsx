
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="bg-white dark:bg-brand-black py-20 text-center transition-colors duration-300">
        <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-tight">GET IN <span className="text-gradient">TOUCH</span></h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto font-light text-lg">We'd love to hear from you. Visit our obsidian-themed facility or send a secure transmission.</p>
      </section>

      <section className="pb-20 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-8 rounded-2xl border border-white/5 shadow-lg">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-brand mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white uppercase tracking-tight">Location</h3>
                    <p className="text-gray-600 dark:text-gray-400">123 Fitness Blvd<br/>Gym City, GC 90210</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 rounded-2xl border border-white/5 shadow-lg">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-brand mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white uppercase tracking-tight">Contact</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Phone: (555) 123-4567<br/>Email: hello@jedafit.com</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 rounded-2xl border border-white/5 shadow-lg">
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-brand mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white uppercase tracking-tight">Access</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Members: 24/7 Access<br/>Staffed: 5am - 10pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 glass-card p-8 md:p-12 rounded-3xl border border-white/5 shadow-xl">
               <h3 className="font-display text-4xl font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-tight">SECURE <span className="text-brand">MESSAGE</span></h3>
               <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none transition-all placeholder-gray-500" />
                   <input type="email" placeholder="Your Email" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none transition-all placeholder-gray-500" />
                 </div>
                 <input type="text" placeholder="Subject" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none transition-all placeholder-gray-500" />
                 <textarea rows={6} placeholder="How can we help?" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none transition-all placeholder-gray-500"></textarea>
                 <button className="brand-gradient text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full hover:opacity-90 transition-all shadow-lg shadow-brand/20">
                   Transmit Message
                 </button>
               </form>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-12 h-96 w-full bg-gray-200 dark:bg-brand-gray rounded-3xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
             <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" alt="Map Location" className="w-full h-full object-cover opacity-30" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="brand-gradient p-5 rounded-full shadow-2xl animate-bounce">
                   <MapPin className="h-10 w-10 text-white" />
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
