import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === 'auth/user-not-found') {
        setError("No account found with this email address.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-black transition-colors duration-300 py-12 px-4">
        <div
          className="bg-white dark:bg-brand-gray p-8 md:p-12 rounded-3xl text-center max-w-lg mx-auto border border-gray-100 dark:border-brand/20 shadow-2xl w-full"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-4 text-gray-900 dark:text-white">CHECK YOUR EMAIL</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
            We sent you a password change link to <br/>
            <span className="font-bold text-gray-900 dark:text-white">{email}</span>.
          </p>

          <Link to="/login" className="inline-flex items-center bg-brand text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-black transition-colors duration-300 px-4">
        <div
          className="bg-white dark:bg-brand-gray p-8 md:p-12 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-white/10"
        >
          <Link to="/login" className="inline-flex items-center text-gray-500 hover:text-brand mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
          </Link>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <KeyRound className="h-8 w-8 text-brand" />
            </div>
            <h1 className="font-display text-4xl font-bold mb-2 text-gray-900 dark:text-white">RESET PASSWORD</h1>
            <p className="text-gray-600 dark:text-gray-400">Enter your email to receive instructions.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg p-4 pl-12 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full bg-brand text-white font-bold text-lg uppercase py-4 rounded-lg hover:bg-brand-dark transition-all transform active:scale-95 shadow-lg shadow-brand/20 flex items-center justify-center ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-3" />
                  Sending Link...
                </>
              ) : (
                'Get Reset Link'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;