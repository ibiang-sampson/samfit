import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, TRAINERS, BOOKING_FAQS } from '../constants';
import { Calendar, Clock, CheckCircle, Mail, Loader, AlertCircle, LayoutDashboard, Plus, Minus, X } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Bookings: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    trainer: '',
    date: '',
    time: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailPreview, setEmailPreview] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Default fallback email content
    let finalEmailContent = `Subject: Jedafit Booking Confirmation - ${formData.service}

Dear ${formData.name},

Your booking for ${formData.service} on ${formData.date} at ${formData.time} is confirmed!
${formData.trainer ? `Trainer: ${formData.trainer}` : ''}

Please arrive 10 minutes early.

Best,
Jedafit Team`;

    try {
      // 1. Save to Firestore (Renamed Collection)
      const userId = auth.currentUser ? auth.currentUser.uid : 'guest';
      
      await addDoc(collection(db, 'jedafit_bookings'), {
        ...formData,
        userId: userId,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });

      // 2. Trigger Email (Using Red #dc2626)
      try {
        await addDoc(collection(db, 'mail'), {
          to: [formData.email],
          message: {
            subject: `Jedafit Booking Confirmed: ${formData.service}`,
            html: `
              <div style="font-family: sans-serif; padding: 40px; color: #1e293b; background-color: #f8fafc;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <div style="background-color: #dc2626; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Session Confirmed</h1>
                  </div>
                  <div style="padding: 30px;">
                    <p style="font-size: 16px; line-height: 1.6;">Hi ${formData.name},</p>
                    <p style="font-size: 16px; line-height: 1.6;">Your training session for <strong>${formData.service}</strong> at Jedafit is locked in.</p>
                    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
                      <table style="width: 100%;">
                        <tr>
                          <td style="padding-bottom: 10px; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Date</td>
                          <td style="padding-bottom: 10px; color: #1e293b; font-weight: bold;">${formData.date}</td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 10px; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Time</td>
                          <td style="padding-bottom: 10px; color: #1e293b; font-weight: bold;">${formData.time}</td>
                        </tr>
                        <tr>
                          <td style="color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Trainer</td>
                          <td style="color: #1e293b; font-weight: bold;">${formData.trainer || 'Jedafit Staff'}</td>
                        </tr>
                      </table>
                    </div>
                    <p style="font-size: 14px; color: #64748b;">Please arrive 10 minutes early. Remember to bring your towel and water bottle.</p>
                  </div>
                  <div style="padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; background: #fafafa;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} Jedafit. All rights reserved.</p>
                  </div>
                </div>
              </div>
            `
          }
        });
      } catch (emailError) {
        console.warn("Email service error:", emailError);
      }

      // 3. AI Email Preview
      try {
        const prompt = `Write a short, professional, high-energy confirmation email for a gym session booking at Jedafit. 
              Details:
              - Client: ${formData.name}
              - Class: ${formData.service}
              - Date: ${formData.date}
              - Time: ${formData.time}`;

        const response = await fetch('/.netlify/functions/generate-email', {
          method: 'POST',
          body: JSON.stringify({ prompt }),
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.text) {
            finalEmailContent = data.text;
          }
        }
      } catch (aiError) {
        console.warn("AI preview failed:", aiError);
      }
      
      setEmailPreview(finalEmailContent);
      setSubmitted(true);
      window.scrollTo(0, 0);

    } catch (error: any) {
      console.error("Booking error:", error.code || 'unknown');
      setError("Unable to process booking. Please check your credentials.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-black transition-colors duration-300 py-12 px-4 text-center">
        <div className="glass-card p-8 md:p-12 rounded-3xl max-w-2xl mx-auto shadow-2xl w-full border border-brand/10">
          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-brand" />
          </div>
          <h2 className="font-display text-4xl font-bold mb-4 text-gray-900 dark:text-white uppercase">BOOKING <span className="text-brand">CONFIRMED</span></h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            See you soon, <span className="font-bold text-gray-900 dark:text-white">{formData.name}</span>!
          </p>
          
          <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-white/10 text-left">
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div>
                    <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Class</p>
                    <p className="font-bold text-gray-900 dark:text-white">{formData.service}</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Date</p>
                    <p className="font-bold text-gray-900 dark:text-white">{formData.date}</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Time</p>
                    <p className="font-bold text-gray-900 dark:text-white">{formData.time}</p>
                 </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/dashboard" className="bg-brand text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 flex items-center justify-center">
               <LayoutDashboard className="w-4 h-4 mr-2" />
               Dashboard
             </Link>
             <button onClick={() => setSubmitted(false)} className="bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
               Book Another
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="relative hidden lg:block overflow-hidden">
          <img src="https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&q=80&w=1200" alt="Jedafit Training" className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-brand-black/40"></div>
          <div className="absolute bottom-20 left-10 p-10 max-w-lg">
             <h2 className="font-display text-7xl font-bold text-white mb-4 leading-none uppercase">COMMIT TO <br/><span className="text-brand">YOURSELF</span></h2>
             <p className="text-xl text-white/90">Experience elite fitness at Jedafit. Lock in your session and push your limits.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-black p-8 md:p-16 lg:p-24 flex flex-col justify-center transition-colors duration-300">
          <h1 className="font-display text-5xl font-bold mb-2 text-gray-900 dark:text-white uppercase tracking-tight">BOOK A <span className="text-brand">SESSION</span></h1>
          <p className="text-gray-600 dark:text-gray-400 mb-10">Choose your training track and trainer below.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none transition-all" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 uppercase tracking-widest">Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none transition-all" 
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none transition-all" 
                placeholder="john@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 uppercase tracking-widest">Service</label>
                <select 
                  name="service" 
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none transition-all"
                >
                  <option value="">Select Service</option>
                  {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 uppercase tracking-widest">Trainer</label>
                <select 
                  name="trainer"
                  value={formData.trainer}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none transition-all"
                >
                  <option value="">Any Staff Expert</option>
                  {TRAINERS.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 uppercase tracking-widest">Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="date" 
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none transition-all"
                  />
                  <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 uppercase tracking-widest">Time</label>
                <div className="relative">
                  <select 
                    name="time" 
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none transition-all"
                  >
                    <option value="">Select Slot</option>
                    <option value="06:00">06:00 AM</option>
                    <option value="08:00">08:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="20:00">08:00 PM</option>
                  </select>
                  <Clock className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full bg-brand text-white font-bold text-lg uppercase py-4 rounded-xl hover:bg-brand-dark transition-all transform active:scale-95 shadow-lg shadow-brand/20 mt-4 flex items-center justify-center ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? <Loader className="animate-spin h-5 w-5" /> : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Bookings;