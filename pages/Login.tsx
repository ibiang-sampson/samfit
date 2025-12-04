import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendEmailVerification, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on type
  };

  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Google users are verified by default, so we can redirect straight to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Google Sign In Error:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      if (!userCredential.user.emailVerified) {
        // Try to resend verification email, but ignore if it fails (e.g. rate limit)
        try {
          await sendEmailVerification(userCredential.user);
        } catch (err) {
          console.log("Verification email might already be sent or rate limited", err);
        }

        // Sign out immediately
        await signOut(auth);

        // Redirect to verification screen
        navigate('/email-verification', { state: { email: formData.email } });
        return;
      }

      // Login successful, redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Password or Email Incorrect');
      } else {
        setError('An error occurred during sign in. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-20">
      <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-black transition-colors duration-300 px-4">
        <div 
          className="bg-white dark:bg-brand-gray p-8 md:p-12 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-white/10"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-8 w-8 text-brand" />
            </div>
            <h1 className="font-display text-4xl font-bold mb-2 text-gray-900 dark:text-white">WELCOME BACK</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to access your account.</p>
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
              <input 
                type="email" 
                name="email" 
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors" 
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">PASSWORD</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password" 
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg p-4 pr-12 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors" 
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link 
                  to="/forgot-password" 
                  state={{ email: formData.email }}
                  className="text-sm font-bold text-gray-500 hover:text-brand dark:text-gray-400 dark:hover:text-brand transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full bg-brand text-white font-bold text-lg uppercase py-4 rounded-lg hover:bg-brand-dark transition-all transform active:scale-95 shadow-lg shadow-brand/20 flex items-center justify-center ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isProcessing && !error ? (
                 <Loader className="animate-spin h-5 w-5" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
            <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">Or</span>
            <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isProcessing}
            className="w-full bg-white dark:bg-white text-gray-700 font-bold text-lg py-4 rounded-lg hover:bg-gray-50 transition-all transform active:scale-95 shadow-lg border border-gray-200 flex items-center justify-center"
          >
            <img 
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" 
              alt="Google" 
              className="w-6 h-6 mr-3" 
            />
            Sign in with Google
          </button>

          <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-white/5">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/program-signup" className="text-brand font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;