import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Plus,
  Dumbbell,
  ShieldAlert
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'users' | 'classes'>('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      
      try {
        // Fetch Bookings (Ensure Collection Name is Correct)
        const bookingsQuery = query(collection(db, 'jedafit_bookings'), orderBy('createdAt', 'desc'));
        const unsubscribeBookings = onSnapshot(bookingsQuery, 
          (snapshot) => {
            setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }, 
          (err) => {
             console.warn("Admin Bookings Access Denied");
             if (err.code === 'permission-denied') setError("Admin access required.");
             setLoading(false);
          }
        );

        // Fetch Users
        const usersQuery = query(collection(db, 'users'));
        const unsubscribeUsers = onSnapshot(usersQuery, 
          (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
          },
          () => setLoading(false)
        );

        return () => {
          unsubscribeBookings();
          unsubscribeUsers();
        };
      } catch (err: any) {
         setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleBookingAction = async (id: string, action: 'approve' | 'cancel' | 'delete') => {
    try {
      if (action === 'delete') {
        if(window.confirm('Delete this booking permanently?')) {
            await deleteDoc(doc(db, 'jedafit_bookings', id));
        }
      } else {
        await updateDoc(doc(db, 'jedafit_bookings', id), {
          status: action === 'approve' ? 'confirmed' : 'cancelled'
        });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-black text-brand transition-colors duration-300">
        <Activity className="animate-spin h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-light dark:bg-brand-black transition-colors duration-300">
      <div className="flex h-[calc(100vh-80px)]">
        
        {/* Sidebar */}
        <aside className="w-20 md:w-64 bg-white dark:bg-brand-gray border-r border-gray-200 dark:border-white/5 flex flex-col transition-colors">
          <div className="p-4 md:p-6">
            <h2 className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Jedafit Admin</h2>
            <nav className="space-y-2">
              {[
                { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                { id: 'bookings', icon: Calendar, label: 'Bookings' },
                { id: 'users', icon: Users, label: 'Users' }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="hidden md:block font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-tight">ADMIN <span className="text-brand">OVERVIEW</span></h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Bookings</h3>
                  <p className="text-3xl font-bold text-brand">{bookings.length}</p>
                </div>
              </div>

              <div className="glass-card rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-tight">Recent Activity</h3>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-brand/30 transition-all">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{booking.name}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">{booking.service} - {booking.date}</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="glass-card rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
               <div className="p-6 border-b border-gray-100 dark:border-white/5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Manage Reservations</h2>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 text-[10px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="p-4">Member</th>
                        <th className="p-4">Program</th>
                        <th className="p-4">Schedule</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-gray-900 dark:text-white">{b.name}</div>
                            <div className="text-[10px] text-gray-400 uppercase">{b.email}</div>
                          </td>
                          <td className="p-4 text-brand font-bold text-xs uppercase">{b.service}</td>
                          <td className="p-4">
                             <div className="text-xs font-bold text-gray-700 dark:text-white">{b.date}</div>
                             <div className="text-[10px] text-gray-400">{b.time}</div>
                          </td>
                          <td className="p-4 text-right space-x-1">
                             <button onClick={() => handleBookingAction(b.id, 'approve')} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-all"><CheckCircle className="h-4 w-4" /></button>
                             <button onClick={() => handleBookingAction(b.id, 'delete')} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;