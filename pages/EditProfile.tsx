import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, storage, db } from '../firebase';
import { updateProfile, onAuthStateChanged, User, deleteUser } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { User as UserIcon, Upload, Loader, Save, ArrowLeft, AlertCircle, CheckCircle, Trash2, X } from 'lucide-react';
import { PROGRAMS } from '../constants';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    program: ''
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Fetch data from Firestore 'users' collection
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              name: data.name || currentUser.displayName || '',
              phone: data.phone || '',
              program: data.program || ''
            });
            setPhotoPreview(data.photoURL || currentUser.photoURL);
          } else {
             // Fallback to auth data
             setFormData(prev => ({ ...prev, name: currentUser.displayName || '' }));
             setPhotoPreview(currentUser.photoURL);
          }
        } catch (err: any) {
           console.warn("Could not fetch user profile:", err.code);
           // Fallback to auth data even if Firestore fails
           setFormData(prev => ({ ...prev, name: currentUser.displayName || '' }));
           setPhotoPreview(currentUser.photoURL);
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB.");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file.");
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    if (!user) return;
    setIsProcessing(true);

    try {
      // Delete Firestore Document from 'users'
      try {
        await deleteDoc(doc(db, 'users', user.uid));
      } catch (e) {
        // Ignore if document doesn't exist
      }
      
      // Delete Auth User
      await deleteUser(user);
      
      navigate('/');
    } catch (err: any) {
      console.error("Delete account error:", err.code || 'unknown');
      setError("Failed to delete account. You may need to sign out and sign in again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    if (!user) return;

    try {
      let photoURL = photoPreview || '';

      if (photo) {
        const fileRef = ref(storage, `profile_photos/${user.uid}/${Date.now()}_${photo.name}`);
        await uploadBytes(fileRef, photo);
        photoURL = await getDownloadURL(fileRef);
      }

      // Update Firestore 'users' collection
      await updateDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        phone: formData.phone,
        program: formData.program,
        photoURL: photoURL
      });

      // Update Auth Profile (for consistency in navbar etc)
      await updateProfile(user, {
        displayName: formData.name,
        photoURL: photoURL
      });

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (err: any) {
      console.error("Profile update error:", err.code || 'unknown');
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-light dark:bg-brand-black transition-colors duration-300">
      
      {/* Notifications Popups */}
      {error && (
        <div className="fixed top-24 right-4 left-4 md:left-auto md:right-8 z-50 md:max-w-md animate-[slideIn_0.3s_ease-out]">
          <div className="bg-white dark:bg-neutral-800 border-l-4 border-red-500 shadow-2xl rounded-r-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 shrink-0" />
            <div className="flex-grow">
              <h3 className="text-red-500 font-bold text-sm uppercase">Error</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white ml-4">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed top-24 right-4 left-4 md:left-auto md:right-8 z-50 md:max-w-md animate-[slideIn_0.3s_ease-out]">
          <div className="bg-white dark:bg-neutral-800 border-l-4 border-green-500 shadow-2xl rounded-r-lg p-4 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
            <div className="flex-grow">
              <h3 className="text-green-500 font-bold text-sm uppercase">Success</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Profile updated successfully! Redirecting...</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-brand mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
          </button>

          <div 
            className="bg-white dark:bg-brand-gray rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-white/5"
          >
            <h1 className="font-display text-4xl font-bold mb-8 text-gray-900 dark:text-white">EDIT <span className="text-brand">PROFILE</span></h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Photo Upload */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-brand/10 dark:bg-brand/20 rounded-full flex items-center justify-center mb-4 border-4 border-white dark:border-gray-700 shadow-md overflow-hidden relative group">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="h-12 w-12 text-brand" />
                  )}
                  
                  <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="h-8 w-8 text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                  </label>
                </div>
                
                <label className="cursor-pointer">
                  <span className="text-brand font-bold text-sm uppercase tracking-wide hover:underline">Change Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">Max size: 2MB</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">DISPLAY NAME</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">PHONE</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">PROGRAM</label>
                  <select 
                    name="program" 
                    value={formData.program}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors appearance-none"
                  >
                    <option value="">Select a Program</option>
                    {PROGRAMS.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isProcessing}
                className={`w-full bg-brand text-white font-bold text-lg uppercase py-4 rounded-lg hover:bg-brand-dark transition-all transform active:scale-95 shadow-lg shadow-brand/20 flex items-center justify-center ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
              <button 
                onClick={handleDeleteAccount}
                disabled={isProcessing}
                className="flex items-center text-red-600 hover:text-red-700 font-bold uppercase text-sm tracking-wide"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;