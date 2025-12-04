import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, AlertTriangle, ArrowLeft, CheckCircle } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  const planName = location.state?.plan?.name || 'Premium Plan';
  const planPrice = location.state?.plan?.price || '$99';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Optional: Redirect if not logged in, but for read-only demo we can stay
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-brand-light dark:bg-brand-black transition-colors duration-300 flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-brand-gray w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden"
      >
        {/* Warning Header */}
        <div className="bg-amber-500 text-white p-4 text-center font-bold flex items-center justify-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>PAYMENT NOT ENABLED YET</span>
        </div>

        <div className="p-8 md:p-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-500 hover:text-brand mb-6 transition-colors text-sm font-bold uppercase"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-gray-100 dark:border-white/5">
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">CHECKOUT</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Complete your upgrade to the <span className="text-brand font-bold">{planName}</span>.</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <span className="block text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Due</span>
              <span className="font-display text-4xl font-bold text-gray-900 dark:text-white">{planPrice}</span>
            </div>
          </div>

          <form className="space-y-6 opacity-70 pointer-events-none select-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Cardholder Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    readOnly 
                    value={user?.displayName || "John Doe"}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3 pl-10 text-gray-900 dark:text-white font-medium"
                  />
                  <div className="absolute left-3 top-3 text-gray-400">
                    <UserIcon />
                  </div>
                </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Email Receipt To</label>
                 <div className="relative">
                  <input 
                    type="email" 
                    readOnly 
                    value={user?.email || "email@example.com"}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3 pl-10 text-gray-900 dark:text-white font-medium"
                  />
                   <div className="absolute left-3 top-3 text-gray-400">
                    <MailIcon />
                  </div>
                 </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Card Information</label>
              <div className="relative">
                <input 
                  type="text" 
                  readOnly 
                  value="•••• •••• •••• 4242"
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3 pl-10 text-gray-900 dark:text-white font-mono"
                />
                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <div className="absolute right-3 top-3 flex space-x-2">
                   <div className="h-5 w-8 bg-gray-300 rounded"></div>
                   <div className="h-5 w-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Expiry Date</label>
                <input 
                  type="text" 
                  readOnly 
                  value="12 / 25"
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center text-gray-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">CVC</label>
                <div className="relative">
                  <input 
                    type="text" 
                    readOnly 
                    value="•••"
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center text-gray-900 dark:text-white font-mono"
                  />
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
            <button 
              disabled 
              className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold text-lg uppercase py-4 rounded-xl cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Lock className="h-5 w-5" />
              <span>Confirm Payment</span>
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
              <Lock className="h-3 w-3 mr-1" /> Payments are secure and encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Icons for internal use
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

export default Payment;