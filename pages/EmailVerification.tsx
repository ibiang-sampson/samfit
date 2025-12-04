import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, LogIn } from 'lucide-react';

const EmailVerification: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email || 'your email address';

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-black transition-colors duration-300 py-12 px-4">
      <div
        className="bg-white dark:bg-brand-gray p-8 md:p-12 rounded-3xl text-center max-w-lg mx-auto border border-gray-100 dark:border-brand/20 shadow-2xl w-full"
      >
        <div className="w-24 h-24 bg-brand/10 dark:bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <Mail className="h-10 w-10 text-brand" />
        </div>
        <h2 className="font-display text-3xl font-bold mb-4 text-gray-900 dark:text-white">VERIFY YOUR EMAIL</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
          We have sent you a verification email to <br/>
          <span className="font-bold text-gray-900 dark:text-white">{email}</span>.
          <br/><br/>
          Verify it and log in.
        </p>

        <Link to="/login" className="inline-flex items-center bg-brand text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20">
          <LogIn className="mr-2 h-4 w-4" /> Login
        </Link>
      </div>
    </div>
  );
};

export default EmailVerification;