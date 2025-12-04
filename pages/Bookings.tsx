import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, TRAINERS } from '../constants';
import { Calendar, Clock, CheckCircle, Mail, Loader, Send } from 'lucide-react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Default fallback email content
    let finalEmailContent = `Subject: Booking Confirmation - ${formData.service}

Dear ${formData.name},

Your booking for ${formData.service} on ${formData.date} at ${formData.time} is confirmed!
${formData.trainer ? `Trainer: ${formData.trainer}` : ''}

Please arrive 10 minutes early with your gear.

Best,
Samfit Team`;

    try {
      // Safe check for API key to prevent runtime crashes if process is undefined
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;

      if (apiKey) {
        // Use dynamic import for the official SDK
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Use standard stable model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Write a friendly, high-energy confirmation email for a gym session booking. 
            Do not include placeholders. Use the provided data below.
            
            Booking Details:
            - Client Name: ${formData.name}
            - Service: ${formData.service}
            - Trainer: ${formData.trainer || 'Our Expert Staff'}
            - Date: ${formData.date}
            - Time: ${formData.time}
            
            The email should be professional but motivating. Mention bringing a towel and water bottle.
            Format it clearly with a Subject line.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
          finalEmailContent = text;
        }
      }
    } catch (error) {
      console.warn("Failed to generate personalized email, using fallback.", error);
    }

    setEmailPreview(finalEmailContent);
    setSubmitted(true);
    setIsProcessing(false);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    // Construct mailto link for client-side sending
    const mailSubject = `Booking Confirmation: ${formData.service}`;
    const mailBody = `Hi ${formData.name},

Your booking is confirmed!

Here are your session details:
Service: ${formData.service}
Trainer: ${formData.trainer || 'Expert Staff'}
Date: ${formData.date}
Time: ${formData.time}

Please arrive 10 minutes early.

Best regards,
The Samfit Team`;

    const mailtoLink = `mailto:${formData.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-black transition-colors duration-300 py-12 px-4">
        <div 
          className="bg-white dark:bg-brand-gray p-8 md:p-10 rounded-3xl text-center max-w-3xl mx-auto border border-gray-100 dark:border-brand/20 shadow-2xl w-full"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="font-display text-4xl font-bold mb-4 text-gray-900 dark:text-white">BOOKING CONFIRMED</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Awesome job, <span className="font-bold text-gray-900 dark:text-white">{formData.name}</span>! You're booked in.
          </p>
          
          {/* Email Preview Section */}
          <div className="mb-8 text-left bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-lg relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>
            <div className="bg-gray-50 dark:bg-white/5 px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <div className="bg-brand/10 p-2 rounded-full">
                   <Mail className="w-5 h-5 text-brand" />
                 </div>
                 <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Confirmation Sent To</span>
                    <span className="block text-sm font-bold text-gray-900 dark:text-white">{formData.email}</span>
                 </div>
              </div>
              <span className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">SUCCESS</span>
            </div>
            <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
               <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
                  {emailPreview}
               </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Link to="/" className="px-6 py-3 rounded-full font-bold uppercase text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
               Home
             </Link>
             <button onClick={() => { setSubmitted(false); setFormData({...formData, date: '', time: '', service: '', trainer: ''}); }} className="bg-brand text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20">
               Book Another
             </button>
             <a 
                href={mailtoLink}
                className="bg-gray-800 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold uppercase hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors shadow-lg flex items-center"
             >
                <Send className="w-4 h-4 mr-2" />
                Email App
             </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
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
    </div>
  );
};

export default Bookings;