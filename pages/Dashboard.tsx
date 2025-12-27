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
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const unsubscribeSnapshot = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
            if (doc.exists()) setUserData(doc.data());
            setLoading(false);
          }, () => setLoading(false));
          return () => unsubscribeSnapshot();
        } catch { setLoading(false); }
      } else {
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
    await signOut(auth);
    navigate('/');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-black transition-colors duration-300">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div>
    </div>
  );

  const profileImage = userData?.photoURL || user?.photoURL;

  return (
    <div className="pt-20 min-h-screen bg-brand-light dark:bg-brand-black transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h1 className="font-display text-5xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">MY <span className="text-gradient">STATUS</span></h1>
            <p className="text-gray-500 dark:text-gray-400 font-light">Performance tracking for <span className="text-brand font-medium">{userData?.name || 'Member'}</span>.</p>
          </div>
          <button onClick={handleLogout} className="mt-4 md:mt-0 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-brand transition-colors font-bold uppercase text-xs tracking-widest">
            <LogOut className="h-4 w-4" /> <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="glass-card rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-white/5 lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 brand-gradient rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-brand-gray overflow-hidden">
                {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon className="h-10 w-10 text-white" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-tight">{userData?.name || user?.displayName || 'Member'}</h2>
              <p className="text-brand text-xs font-black uppercase tracking-widest mb-6">Level: {userData?.role?.toUpperCase() || 'ATHLETE'}</p>
              
              <div className="w-full space-y-3">
                <Link to="/edit-profile" className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-white/5 p-3 rounded-xl hover:bg-brand/10 dark:hover:bg-brand/20 transition-all text-gray-700 dark:text-white font-bold text-xs uppercase tracking-widest border border-gray-200 dark:border-white/5">
                  <Settings className="h-4 w-4" /> <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Dashboard Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="brand-gradient text-white rounded-3xl p-8 shadow-xl relative overflow-hidden h-64 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4 opacity-80">
                    <Activity className="h-5 w-5" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Membership Plan</span>
                  </div>
                  <h3 className="text-4xl font-display font-bold uppercase">{userData?.membership || 'STANDARD'}</h3>
                  <p className="text-white/80 text-sm font-light mt-1">Renewal: {expiryDate}</p>
                </div>
                <Link to="/pricing" className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all w-fit backdrop-blur-md">Upgrade Plan</Link>
                <CreditCard className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 rotate-12" />
              </div>

              <div className="glass-card rounded-3xl p-8 border border-gray-100 dark:border-white/5 flex flex-col justify-between h-64">
                <div>
                   <div className="flex items-center space-x-3 mb-4 opacity-60">
                     <Calendar className="h-5 w-5 text-brand" />
                     <span className="font-black uppercase tracking-widest text-[10px]">Next Training</span>
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Personal Session</h3>
                   <p className="text-brand text-sm font-bold mt-1">Tomorrow @ 09:00 AM</p>
                </div>
                <Link to="/bookings" className="text-gray-400 hover:text-brand text-xs font-black uppercase tracking-widest flex items-center transition-colors">
                  Change Schedule <ArrowRight className="h-3 w-3 ml-2" />
                </Link>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-gray-100 dark:border-white/5">
              <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-tight">QUICK <span className="text-brand">ACTIONS</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { to: '/bookings', label: 'Book Session', desc: 'Secure your next slot', icon: Calendar },
                   { to: '/services', label: 'Our Programs', desc: 'Browse available tracks', icon: Activity }
                 ].map((link, i) => (
                   <Link key={i} to={link.to} className="flex items-center p-5 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-brand/5 dark:hover:bg-brand/20 border border-transparent hover:border-brand/30 transition-all group">
                      <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mr-4 group-hover:bg-brand group-hover:text-white transition-all">
                        <link.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">{link.label}</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{link.desc}</p>
                      </div>
                   </Link>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;