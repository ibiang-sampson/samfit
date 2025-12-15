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
    let finalEmailContent = `Subject: Booking Confirmation - ${formData.service}

Dear ${formData.name},

Your booking for ${formData.service} on ${formData.date} at ${formData.time} is confirmed!
${formData.trainer ? `Trainer: ${formData.trainer}` : ''}

Please arrive 10 minutes early with your gear.

Best,
Samfit Team`;

    try {
      // 1. Save to Firestore (Bookings Collection)
      // Check auth state for userId, default to 'guest' if not logged in
      const userId = auth.currentUser ? auth.currentUser.uid : 'guest';
      
      await addDoc(collection(db, 'samfit__bookings'), {
        ...formData,
        userId: userId,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });

      // 2. Trigger Email (Mail Collection for Firebase Extension)
      try {
        await addDoc(collection(db, 'mail'), {
          to: [formData.email],
          message: {
            subject: `Booking Confirmed: ${formData.service}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #dc2626;">Booking Confirmed!</h2>
                <p>Hi ${formData.name},</p>
                <p>You are all set for <strong>${formData.service}</strong>.</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 8px;"><strong>Date:</strong> ${formData.date}</li>
                    <li style="margin-bottom: 8px;"><strong>Time:</strong> ${formData.time}</li>
                    <li><strong>Trainer:</strong> ${formData.trainer || 'Expert Staff'}</li>
                  </ul>
                </div>
                <p>Please arrive 10 minutes early with your towel and water bottle.</p>
                <p>See you at the gym,<br/>The Samfit Team</p>
              </div>
            `
          }
        });
      } catch (emailError) {
        // Log safely
        console.warn("Could not write to mail collection:", emailError);
      }

      // 3. Generate AI Email Preview (Optional enhancement for UI via Netlify Function)
      try {
        const prompt = `Write a short, friendly, high-energy confirmation email for a gym session booking. 
              Details:
              - Client: ${formData.name}
              - Class: ${formData.service}
              - Date: ${formData.date}
              - Time: ${formData.time}
              `;

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
        console.warn("AI generation failed, using fallback.", aiError);
      }
      
      setEmailPreview(finalEmailContent);
      setSubmitted(true);
      window.scrollTo(0, 0);

    } catch (error: any) {
      // Log sanitized error
      console.error("Booking process error:", error.code || 'unknown', error.message || 'unknown');
      
      if (error.code === 'permission-denied') {
        setError("Permission denied. You may need to sign in to book a session.");
      } else if (error.code === 'unavailable') {
        setError("Network connection issue. Please check your internet.");
      } else {
        setError("We encountered an error saving your booking. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (submitted) {
    const mailSubject = `Booking Confirmation: ${formData.service}`;
    const mailBody = `Hi ${formData.name},\n\nYour booking is confirmed!\n\nService: ${formData.service}\nDate: ${formData.date}\nTime: ${formData.time}\n\nSee you there!`;
    const mailtoLink = `mailto:${formData.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-black transition-colors duration-300 py-12 px-4">
        <div 
          className="bg-white dark:bg-brand-gray p-8 md:p-12 rounded-3xl text-center max-w-2xl mx-auto border border-gray-100 dark:border-brand/20 shadow-2xl w-full"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="font-display text-4xl font-bold mb-4 text-gray-900 dark:text-white">BOOKING CONFIRMED</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            You're all set, <span className="font-bold text-gray-900 dark:text-white">{formData.name}</span>!
          </p>
          
          {/* Booking Details Summary */}
          <div className="bg-brand-light dark:bg-white/5 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-white/10 shadow-inner">
             <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-white/10 pb-2">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Session Details</h3>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded">CONFIRMED</span>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                 <div>
                    <p className="text-xs text-gray-500 mb-1 font-bold">CLASS</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{formData.service}</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 mb-1 font-bold">DATE</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{formData.date}</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 mb-1 font-bold">TIME</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{formData.time}</p>
                 </div>
             </div>
             <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 text-left flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">Confirmation email sent</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">We've sent the details to {formData.email}</p>
                  </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Link to="/dashboard" className="w-full sm:w-auto bg-brand text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 flex items-center justify-center">
               <LayoutDashboard className="w-4 h-4 mr-2" />
               Go to Dashboard
             </Link>
             <button onClick={() => { setSubmitted(false); setFormData({...formData, date: '', time: '', service: '', trainer: ''}); }} className="w-full sm:w-auto bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
               Book Another
             </button>
          </div>
          
          <div className="mt-6">
             <a href={mailtoLink} className="text-xs text-gray-400 hover:text-brand transition-colors flex items-center justify-center">
                Didn't get the email? Click here to open mail app
             </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Error Popup */}
      {error && (
        <div className="fixed top-24 right-4 left-4 md:left-auto md:right-8 z-50 md:max-w-md animate-[slideIn_0.3s_ease-out]">
          <div className="bg-white dark:bg-neutral-800 border-l-4 border-red-500 shadow-2xl rounded-r-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 shrink-0" />
            <div className="flex-grow">
              <h3 className="text-red-500 font-bold text-sm uppercase">Booking Error</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white ml-4">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Image Side */}
        <div className="relative hidden lg:block">
          <img src="https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&q=80&w=800" alt="Training" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-black/40 backdrop-blur-[2px]"></div>
          <div className="absolute bottom-20 left-10 p-10 max-w-lg">
             <h2 className="font-display text-6xl font-bold text-white mb-4">COMMIT TO <br/><span className="text-brand">YOURSELF</span></h2>
             <p className="text-xl text-white/90">Consistency is the key to progress. Book your next session now and keep the momentum going.</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="bg-white dark:bg-brand-black p-8 md:p-16 lg:p-24 flex flex-col justify-center transition-colors duration-300">
          <h1 className="font-display text-5xl font-bold mb-2 text-gray-900 dark:text-white">BOOK A SESSION</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-10">Fill out the form below to secure your spot.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">FULL NAME</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">PHONE</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors" 
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">EMAIL ADDRESS</label>
              <input 
                type="email" 
                name="email" 
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors" 
                placeholder="john@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">SERVICE</label>
                <select 
                  name="service" 
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                >
                  <option value="">Select Service</option>
                  {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">TRAINER (OPTIONAL)</label>
                <select 
                  name="trainer"
                  value={formData.trainer}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                >
                  <option value="">Any Trainer</option>
                  {TRAINERS.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">DATE</label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="date" 
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors appearance-none"
                  />
                  <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">TIME</label>
                <div className="relative">
                  <select 
                    name="time" 
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors appearance-none"
                  >
                    <option value="">Select Time</option>
                    <option value="06:00">06:00 AM</option>
                    <option value="08:00">08:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="20:00">08:00 PM</option>
                  </select>
                  <Clock className="absolute right-3 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full bg-brand text-white font-bold text-lg uppercase py-4 rounded-lg hover:bg-brand-dark transition-all transform active:scale-95 shadow-lg shadow-brand/20 mt-4 flex items-center justify-center ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-3" />
                  Processing Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-20 bg-brand-light dark:bg-brand-gray transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white">BOOKING <span className="text-brand">FAQS</span></h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {BOOKING_FAQS.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-brand-black border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-md">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left focus:outline-none"
                >
                  <span className="font-bold text-lg text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  {openFaqIndex === index ? (
                    <Minus className="h-5 w-5 text-brand shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-brand shrink-0" />
                  )}
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-48 py-6 opacity-100 border-t border-gray-100 dark:border-white/5' : 'max-h-0 py-0 opacity-0'}`}
                >
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bookings;