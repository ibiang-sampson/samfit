import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, storage } from '../firebase';
import { updateProfile, onAuthStateChanged, User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User as UserIcon, Upload, Loader, Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setPhotoPreview(currentUser.photoURL);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB.");
        return;
      }
      
      // Validate type
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file.");
        return;
      }

      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    if (!user) return;

    try {
      let photoURL = user.photoURL;

      if (photo) {
        // Create a unique file name
        const fileRef = ref(storage, `profile_photos/${user.uid}/${Date.now()}_${photo.name}`);
        await uploadBytes(fileRef, photo);
        photoURL = await getDownloadURL(fileRef);
      }

      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL
      });

      setSuccess(true);
      // Optional: Redirect back to dashboard after short delay
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (err: any) {
      console.error("Profile update error:", err);
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

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 shrink-0" />
                <p className="text-sm text-green-600 dark:text-green-400">Profile updated successfully! Redirecting...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Photo Upload */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-brand/10 dark:bg-brand/20 rounded-full flex items-center justify-center mb-4 border-4 border-white dark:border-gray-700 shadow-md overflow-hidden relative group">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="h-12 w-12 text-brand" />
                  )}
                  
                  {/* Overlay for hover */}
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

              {/* Name Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-2">DISPLAY NAME</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                  placeholder="Your Name"
                />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;