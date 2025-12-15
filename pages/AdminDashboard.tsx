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
      
      // In a real app, check for admin custom claims here
      // if (!currentUser.getIdTokenResult().claims.admin) { navigate('/'); }
      
      try {
        // Fetch Bookings
        const bookingsQuery = query(collection(db, 'samfit__bookings'), orderBy('createdAt', 'desc'));
        const unsubscribeBookings = onSnapshot(bookingsQuery, 
          (snapshot) => {
            setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }, 
          (err) => {
             // Safe log to prevent circular JSON error
             console.warn("Admin Bookings Fetch Error:", err.code);
             if (err.code === 'permission-denied') {
                 setError("Access Denied: You do not have permission to view admin data.");
             }
             setLoading(false);
          }
        );

        // Fetch Users
        const usersQuery = query(collection(db, 'samfit__user'));
        const unsubscribeUsers = onSnapshot(usersQuery, 
          (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
          },
          (err) => {
             // Safe log
             console.warn("Admin Users Fetch Error:", err.code);
             // If one fails due to permission, usually both fail.
             setLoading(false);
          }
        );

        return () => {
          unsubscribeBookings();
          unsubscribeUsers();
        };
      } catch (err: any) {
         // Safe log
         console.error("Admin Dashboard Setup Error:", err.code || 'unknown');
         setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleBookingAction = async (id: string, action: 'approve' | 'cancel' | 'delete') => {
    try {
      if (action === 'delete') {
        if(window.confirm('Are you sure you want to delete this booking?')) {
            await deleteDoc(doc(db, 'samfit__bookings', id));
        }
      } else {
        await updateDoc(doc(db, 'samfit__bookings', id), {
          status: action === 'approve' ? 'confirmed' : 'cancelled'
        });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleUserDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this user data? This does not delete the Auth account.')) {
        try {
            await deleteDoc(doc(db, 'samfit__user', id));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-black text-brand">
        <Activity className="animate-spin h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return (
        <div className="pt-20 min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-black p-4">
            <div className="bg-white dark:bg-brand-gray p-8 rounded-2xl shadow-xl text-center max-w-md">
                <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <button onClick={() => navigate('/dashboard')} className="bg-brand text-white px-6 py-2 rounded-full font-bold uppercase hover:bg-brand-dark transition-colors">
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-light dark:bg-brand-black transition-colors duration-300">
      <div className="flex h-[calc(100vh-80px)]">
        
        {/* Sidebar */}
        <aside className="w-20 md:w-64 bg-white dark:bg-brand-gray border-r border-gray-200 dark:border-white/5 flex flex-col">
          <div className="p-4 md:p-6">
            <h2 className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Admin Panel</h2>
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="hidden md:block font-medium">Overview</span>
              </button>
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'bookings' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <Calendar className="h-5 w-5" />
                <span className="hidden md:block font-medium">Bookings</span>
                {bookings.filter(b => b.status === 'pending').length > 0 && (
                   <span className="hidden md:flex h-5 w-5 bg-red-500 text-white text-xs items-center justify-center rounded-full ml-auto">
                     {bookings.filter(b => b.status === 'pending').length}
                   </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <Users className="h-5 w-5" />
                <span className="hidden md:block font-medium">Users</span>
              </button>
              <button 
                onClick={() => setActiveTab('classes')}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'classes' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <Dumbbell className="h-5 w-5" />
                <span className="hidden md:block font-medium">Classes</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-brand-light dark:bg-black/20">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">DASHBOARD OVERVIEW</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-brand-gray p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-bold text-green-500 flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +12%</span>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Total Members</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                </div>

                <div className="bg-white dark:bg-brand-gray p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-brand/10 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-brand" />
                    </div>
                    <span className="text-xs font-bold text-green-500 flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +5%</span>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Active Bookings</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{bookings.filter(b => b.status === 'confirmed').length}</p>
                </div>

                <div className="bg-white dark:bg-brand-gray p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Est. Revenue</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">$12,450</p>
                </div>
              </div>

              <div className="bg-white dark:bg-brand-gray rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-4">
                         <div className="h-10 w-10 bg-brand text-white rounded-full flex items-center justify-center font-bold">
                           {booking.name.charAt(0)}
                         </div>
                         <div>
                           <p className="font-bold text-gray-900 dark:text-white">{booking.name} booked {booking.service}</p>
                           <p className="text-xs text-gray-500">{booking.date} at {booking.time}</p>
                         </div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                  {bookings.length === 0 && <p className="text-gray-500 text-center py-4">No recent activity.</p>}
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">MANAGE BOOKINGS</h1>
              </div>
              <div className="bg-white dark:bg-brand-gray rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                      <tr>
                        <th className="p-4">Client</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Trainer</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-gray-900 dark:text-white">{booking.name}</div>
                            <div className="text-xs text-gray-500">{booking.email}</div>
                          </td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">{booking.service}</td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">
                             <div>{booking.date}</div>
                             <div className="text-xs opacity-70">{booking.time}</div>
                          </td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">{booking.trainer || '-'}</td>
                          <td className="p-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                              booking.status === 'confirmed' ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' : 
                              booking.status === 'cancelled' ? 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' :
                              'text-yellow-600 bg-yellow-100'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                             {booking.status !== 'confirmed' && (
                                <button onClick={() => handleBookingAction(booking.id, 'approve')} className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Confirm">
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                             )}
                             {booking.status !== 'cancelled' && (
                                <button onClick={() => handleBookingAction(booking.id, 'cancel')} className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Cancel">
                                  <XCircle className="h-5 w-5" />
                                </button>
                             )}
                             <button onClick={() => handleBookingAction(booking.id, 'delete')} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                               <Trash2 className="h-5 w-5" />
                             </button>
                          </td>
                        </tr>
                      ))}
                      {bookings.length === 0 && (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">No bookings found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">REGISTERED USERS</h1>
              </div>
              <div className="bg-white dark:bg-brand-gray rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Program</th>
                        <th className="p-4">Joined</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="p-4">
                             <div className="flex items-center space-x-3">
                               <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center overflow-hidden">
                                  {u.photoURL ? <img src={u.photoURL} alt={u.name} className="w-full h-full object-cover"/> : <span className="font-bold text-brand">{u.name?.charAt(0) || 'U'}</span>}
                               </div>
                               <span className="font-bold text-gray-900 dark:text-white">{u.name || 'Unknown'}</span>
                             </div>
                          </td>
                          <td className="p-4">
                             <div className="text-sm text-gray-900 dark:text-white">{u.email}</div>
                             <div className="text-xs text-gray-500">{u.phone || '-'}</div>
                          </td>
                          <td className="p-4">
                             <span className="bg-brand/10 text-brand px-2 py-1 rounded text-xs font-bold uppercase">{u.program || 'None'}</span>
                          </td>
                          <td className="p-4 text-sm text-gray-500">
                             - 
                          </td>
                          <td className="p-4 text-right">
                             <button onClick={() => handleUserDelete(u.id)} className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors">
                               <Trash2 className="h-4 w-4" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

           {/* Classes Tab */}
           {activeTab === 'classes' && (
            <div>
               <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">MANAGE CLASSES</h1>
                <button className="bg-brand text-white px-4 py-2 rounded-lg font-bold uppercase text-sm flex items-center hover:bg-brand-dark transition-colors">
                   <Plus className="h-4 w-4 mr-2" /> Add Class
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Mock Card for adding */}
                 <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 min-h-[200px] text-gray-400 hover:text-brand hover:border-brand transition-colors cursor-pointer group">
                    <Plus className="h-10 w-10 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold uppercase tracking-wide">Create New Service</span>
                 </div>

                 {/* Example existing cards (Visual representation) */}
                 <div className="bg-white dark:bg-brand-gray rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 relative">
                    <div className="flex justify-between items-start mb-4">
                       <div className="bg-brand/10 p-3 rounded-xl text-brand">
                          <Dumbbell className="h-6 w-6" />
                       </div>
                       <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-brand"><Settings className="h-4 w-4" /></button>
                       </div>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Personal Training</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">One-on-one coaching tailored to your specific goals.</p>
                    <div className="flex items-center text-xs text-gray-400 font-bold uppercase">
                       <Users className="h-3 w-3 mr-1" /> 12 Active Trainers
                    </div>
                 </div>

                 <div className="bg-white dark:bg-brand-gray rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 relative">
                    <div className="flex justify-between items-start mb-4">
                       <div className="bg-brand/10 p-3 rounded-xl text-brand">
                          <Activity className="h-6 w-6" />
                       </div>
                       <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-brand"><Settings className="h-4 w-4" /></button>
                       </div>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Crossfit</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">High intensity functional training for total body.</p>
                    <div className="flex items-center text-xs text-gray-400 font-bold uppercase">
                       <Users className="h-3 w-3 mr-1" /> 5 Active Trainers
                    </div>
                 </div>
              </div>
            </div>
           )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;