import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, LogIn, AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, sendEmailVerification, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const syncUserToFirestore = async (user: any) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName || 'Jedafit Athlete',
          email: user.email,
          photoURL: user.photoURL,
          role: 'member',
          createdAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (err) { console.warn("Firestore sync failed:", err); }
  };

  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await syncUserToFirestore(result.user);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') setError("Google authentication failed.");
    } finally { setIsProcessing(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        navigate('/email-verification', { state: { email: formData.email } });
        return;
      }
      await syncUserToFirestore(userCredential.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError("Invalid credentials. Please verify your email and password.");
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black px-4 pt-20">
      <div className="glass-card p-8 md:p-12 rounded-3xl w-full max-w-lg shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 brand-gradient"></div>
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold mb-2 text-white uppercase tracking-tight">WELCOME <span className="text-brand">BACK</span></h1>
          <p className="text-gray-400 font-light">Continue your performance journey at Jedafit.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Email Access</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-brand focus:outline-none transition-all" 
              placeholder="athlete@jedafit.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Secret Key</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-brand focus:outline-none transition-all" 
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="text-right mt-2">
              <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:text-white transition-colors">Forgot Password?</Link>
            </div>
          </div>

          <button type="submit" disabled={isProcessing} className="w-full brand-gradient text-white font-bold text-lg uppercase py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand/20 flex items-center justify-center">
            {isProcessing ? <Loader className="animate-spin h-5 w-5" /> : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="mx-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">Or Secure</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <button onClick={handleGoogleSignIn} disabled={isProcessing} className="w-full bg-white text-gray-900 font-bold text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center">
          <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="G" className="w-5 h-5 mr-3" />
          Login with Google
        </button>

        <p className="mt-8 text-center text-gray-500 text-sm">
          New to the movement? <Link to="/program-signup" className="text-brand font-bold hover:underline">Join Jedafit</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;