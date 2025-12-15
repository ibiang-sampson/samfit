import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { LogOut, User as UserIcon, Calendar, Settings, CreditCard, Activity, ArrowRight, Shield } from 'lucide-react';
import { PRICING_PLANS } from '../constants';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<number>(PRICING_PLANS[2].id);
  const navigate = useNavigate();

  // Dynamic Date calculation: 30 days from now
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Listen to Firestore updates
        try {
          const unsubscribeSnapshot = onSnapshot(
            doc(db, "samfit__user", currentUser.uid), 
            (doc) => {
              if (doc.exists()) {
                setUserData(doc.data());
              }
              setLoading(false);
            },
            (error) => {
              // Log code and message safely to avoid circular JSON error
              console.warn("Firestore access error (using auth profile instead):", error.code, error.message);
              // CRITICAL: Ensure loading is set to false even if firestore permission is denied
              setLoading(false);
            }
          );
          
          return () => unsubscribeSnapshot();
        } catch (e) {
          console.warn("Error setting up snapshot listener");
          setLoading(false);
        }
      } else {
        // Only redirect if explicitly checked and no user found
        navigate('/login');
        setLoading(false);
      }
    });

    const date = new Date();
    date.setDate(date.getDate() + 30);
    setExpiryDate(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleUpgrade = () => {
    const plan = PRICING_PLANS.find(p => p.id === Number(selectedPlanId));
    if (plan) {
      navigate('/payment', { state: { plan } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  // Helper to get display image (prioritize Firestore, then Auth, then default)
  const profileImage = userData?.photoURL || user?.photoURL;
  const displayName = userData?.name || user?.displayName || 'Member';
  const displayEmail = userData?.email || user?.email;

  return (
    <div className="pt-20 min-h-screen bg-brand-light dark:bg-brand-black transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              MY <span className="text-brand">DASHBOARD</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back to Samfit.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 md:mt-0 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div 
            className="bg-white dark:bg-brand-gray rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-white/5 lg:col-span-1 h-fit"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-brand/10 dark:bg-brand/20 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-brand-gray shadow-sm overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-10 w-10 text-brand" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {displayName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{displayEmail}</p>
              
              <div className="w-full text-left space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                 <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                    <span className="font-bold">Phone:</span>
                    <span>{userData?.phone || '-'}</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                    <span className="font-bold">Program:</span>
                    <span className="truncate max-w-[150px]">{userData?.program || '-'}</span>
                 </div>
              </div>

              <div className="w-full space-y-3">
                <Link to="/edit-profile" className="w-full flex items-center justify-center space-x-2 bg-gray-50 dark:bg-white/5 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-200 font-medium text-sm">
                  <Settings className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
                <button className="w-full flex items-center justify-center space-x-2 bg-gray-50 dark:bg-white/5 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-200 font-medium text-sm">
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats/Status */}
            <div 
               className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-brand text-white rounded-3xl p-6 shadow-lg shadow-brand/20 relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg"><Activity className="h-6 w-6 text-white" /></div>
                    <span className="font-bold uppercase tracking-wider text-sm opacity-90">Current Plan</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-1">{userData?.membership?.toUpperCase() || 'STANDARD'}</h3>
                  <p className="text-white/80 text-sm">Active until {expiryDate}</p>
                </div>
                
                {/* Upgrade Section */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/20">
                  <label className="text-xs font-bold uppercase text-white/80 mb-2 block">Upgrade Your Plan</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select 
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(Number(e.target.value))}
                      className="bg-white/20 border-none rounded-lg text-sm text-white font-bold p-2 focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-colors cursor-pointer flex-grow appearance-none"
                    >
                      {PRICING_PLANS.map(plan => (
                        <option key={plan.id} value={plan.id} className="text-gray-900">
                          {plan.name} - {plan.price}
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={handleUpgrade}
                      className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors flex items-center justify-center shrink-0 shadow-lg"
                    >
                      Pay to Upgrade
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>

                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 pointer-events-none">
                  <CreditCard className="h-32 w-32" />
                </div>
              </div>

              <div className="bg-white dark:bg-brand-gray rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5 flex flex-col justify-between">
                 <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-brand/10 rounded-lg"><Calendar className="h-6 w-6 text-brand" /></div>
                      <span className="font-bold uppercase tracking-wider text-sm text-gray-500 dark:text-gray-400">Next Session</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">HIIT & Cardio</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Tomorrow, 10:00 AM</p>
                 </div>
                 <Link to="/bookings" className="mt-4 text-brand font-bold text-sm uppercase tracking-wide flex items-center hover:underline">
                    View Schedule <ArrowRight className="h-4 w-4 ml-1" />
                 </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div 
              className="bg-white dark:bg-brand-gray rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-white/5"
            >
              <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">QUICK ACTIONS</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Link to="/bookings" className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-brand/5 dark:hover:bg-brand/20 border border-transparent hover:border-brand/30 transition-all group">
                    <div className="h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center mr-4 group-hover:bg-brand group-hover:text-white transition-colors">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Book a Class</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Schedule your next workout</p>
                    </div>
                 </Link>
                 <Link to="/services" className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-brand/5 dark:hover:bg-brand/20 border border-transparent hover:border-brand/30 transition-all group">
                    <div className="h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center mr-4 group-hover:bg-brand group-hover:text-white transition-colors">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">View Programs</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Explore training options</p>
                    </div>
                 </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;