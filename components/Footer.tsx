
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dumbbell, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-light dark:bg-brand-gray pt-16 pb-8 border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Dumbbell className="h-6 w-6 text-brand" />
              <span className="font-display text-2xl font-bold tracking-wider text-gray-900 dark:text-white">JEDA<span className="text-brand">FIT</span></span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              We are a premium fitness center dedicated to helping you achieve your physical potential through expert coaching and top-tier facilities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-display text-xl font-bold mb-6 tracking-wide">QUICK LINKS</h3>
            <ul className="space-y-3">
              <li><NavLink to="/about" className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors">About Us</NavLink></li>
              <li><NavLink to="/services" className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors">Services</NavLink></li>
              <li><NavLink to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors">Membership</NavLink></li>
              <li><NavLink to="/bookings" className="text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors">Book a Class</NavLink></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-display text-xl font-bold mb-6 tracking-wide">PROGRAMS</h3>
            <ul className="space-y-3">
              <li className="text-gray-600 dark:text-gray-400">Personal Training</li>
              <li className="text-gray-600 dark:text-gray-400">Group Fitness</li>
              <li className="text-gray-600 dark:text-gray-400">Yoga & Pilates</li>
              <li className="text-gray-600 dark:text-gray-400">Strength & Conditioning</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-display text-xl font-bold mb-6 tracking-wide">CONTACT US</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                <MapPin className="h-5 w-5 text-brand shrink-0 mt-1" />
                <span>123 Fitness Blvd, Gym City, GC 90210</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <Phone className="h-5 w-5 text-brand shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <Mail className="h-5 w-5 text-brand shrink-0" />
                <span>hello@jedafit.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Jedafit. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-brand text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-brand text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
