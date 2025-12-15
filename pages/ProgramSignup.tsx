import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader, Upload, AlertCircle, Eye, EyeOff, Lock, User as UserIcon, X } from 'lucide-react';
import { auth, storage } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProgramSignup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        return; 
      }

      // Log only safe properties to avoid circular structure errors
      console.error("Google Sign Up Error:", err.code ? err.code : "Unknown", err.message ? err.message : "");
      
      if (err.code === 'auth/unauthorized-domain') {
        setError(`Configuration Error: Domain ${window.location.hostname} is not authorized in Firebase Console.`);
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError("Sign up process interrupted. Please try again.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Failed to sign up with Google. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsProcessing(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password should be at least 6 characters.");
      setIsProcessing(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      let photoURL = null;
      if (photo) {
        try {
          // Create a reference to 'profile_photos/<uid>/<filename>'
          const photoRef = ref(storage, `profile_photos/${user.uid}/${Date.now()}_${photo.name}`);
          const snapshot = await uploadBytes(photoRef, photo);
          photoURL = await getDownloadURL(snapshot.ref);
        } catch (storageError) {
          console.warn("Failed to upload photo:", storageError);
          // Proceed without photo if upload fails
        }
      }

      // Update profile with name and photo
      await updateProfile(user, { 
        displayName: formData.name,
        photoURL: photoURL
      });
      
      // Send verification email
      await sendEmailVerification(user);

      // Sign out immediately so they aren't logged in
      await signOut(auth);

      // Redirect to email verification page
      navigate('/email-verification', { state: { email: formData.email } });

    } catch (err: any) {
      // Log only safe properties to prevent circular JSON error
      const errorCode = err.code || 'unknown';
      const errorMessage = err.message || 'Unknown error';
      console.error("Registration error:", errorCode, errorMessage);
      
      if (errorCode === 'auth/email-already-in-use') {
        setError('USER_EXISTS');
      } else if (errorCode === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.');
      } else {
        setError(errorMessage || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Error Popup */}
      {error && (
        <div className="fixed top-24 right-4 left-4 md:left-auto md:right-8 z-50 md:max-w-md animate-[slideIn_0.3s_ease-out]">
          <div className="bg-white dark:bg-neutral-800 border-l-4 border-red-500 shadow-2xl rounded-r-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 shrink-0" />
            <div className="flex-grow">
              <h3 className="text-red-500 font-bold text-sm uppercase">Registration Error</h3>
              {error === 'USER_EXISTS' ? (
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  User already exists. <Link to="/login" className="font-bold underline text-brand hover:text-brand-dark ml-1">Sign in?</Link>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{error}</p>
              )}
            </div>
            <button onClick={() => setError(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white ml-4">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Form Side */}
        <div className="bg-white dark:bg-brand-black p-8 md:p-16 lg:p-24 flex flex-col justify-center transition-colors duration-300 order-2 lg:order-1">
          <div className="mb-10">
            <h1 className="font-display text-5xl font-bold mb-4 text-gray-900 dark:text-white">CREATE <span className="text-brand">ACCOUNT</span></h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Register to join our community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">FULL NAME</label>
              <input 
                type="text" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors" 
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">EMAIL ADDRESS</label>
              <input 
                type="email" 
                name="email" 
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-brand-gray border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors" 
                placeholder="jane@example.com"
              />
            </div>

            {/* Authentication Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/5">
              <div className="md:col-span-2">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-brand" /> Security
                 </h3>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">PASSWORD</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg p-4 pr-12 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors" 
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
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">REPEAT PASSWORD</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword" 
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg p-4 pr-12 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors" 
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">PROFILE PHOTO (OPTIONAL)</label>
              <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-brand-gray hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                 <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 />
                 <div className="flex flex-col items-center pointer-events-none">
                    {photo ? (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                         <CheckCircle className="w-6 h-6 mr-2" />
                         <span className="font-medium truncate max-w-xs">{photo.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-brand transition-colors mb-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">Click to upload image</span>
                      </>
                    )}
                 </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full bg-brand text-white font-bold text-lg uppercase py-5 rounded-lg hover:bg-brand-dark transition-all transform active:scale-95 shadow-xl shadow-brand/20 mt-8 flex items-center justify-center ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isProcessing && !error ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-3" />
                  Creating Account...
                </>
              ) : (
                'Register & Sign Up'
              )}
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
              <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">Or</span>
              <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isProcessing}
              className="w-full bg-white dark:bg-white text-gray-700 font-bold text-lg py-4 rounded-lg hover:bg-gray-50 transition-all transform active:scale-95 shadow-lg border border-gray-200 flex items-center justify-center"
            >
              <img 
                src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" 
                alt="Google" 
                className="w-6 h-6 mr-3" 
              />
              Sign up with Google
            </button>
            
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
               Already have an account? <Link to="/login" className="font-bold text-brand hover:underline">Sign In</Link>
            </p>
          </form>
        </div>

        {/* Image Side */}
        <div className="relative h-64 lg:h-auto order-1 lg:order-2">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" alt="Gym Equipment" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-black/50 backdrop-blur-[2px]"></div>
          <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/90 to-transparent">
             <div className="max-w-md ml-auto">
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4 text-right">INVEST IN <br/><span className="text-brand">EXCELLENCE</span></h2>
                <p className="text-white/90 text-right">Join a community that pushes you to be your absolute best. No shortcuts, just results.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramSignup;