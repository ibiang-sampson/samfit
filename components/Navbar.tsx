import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Dumbbell, Sun, Moon, LogIn, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial system preference or class
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 dark:bg-brand-black/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-brand-gray' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <NavLink to="/" className="flex items-center space-x-2 group">
              <Dumbbell className="h-8 w-8 text-brand transition-transform group-hover:rotate-12" />
              <span className="font-display text-3xl font-bold tracking-wider text-gray-900 dark:text-white">SAM<span className="text-brand">FIT</span></span>
            </NavLink>
            
            {/* Mobile Dashboard Icon (visible only when logged in on mobile) */}
            {user && (
              <NavLink 
                to="/dashboard" 
                className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand transition-colors"
                aria-label="Dashboard"
              >
                <LayoutDashboard className="h-6 w-6" />
              </NavLink>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-baseline space-x-8">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-brand'
                        : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              
              {user && (
                 <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-bold flex items-center space-x-1 transition-colors duration-200 ${
                      isActive
                        ? 'text-brand'
                        : 'text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand'
                    }`
                  }
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </NavLink>
              )}
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
               <NavLink to="/dashboard" className="bg-brand text-white px-5 py-2 rounded-full font-bold uppercase text-sm tracking-wide hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 flex items-center space-x-2">
                 <User className="h-4 w-4" />
                 <span>Dashboard</span>
               </NavLink>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink to="/login" className="text-gray-700 dark:text-gray-300 font-bold text-sm hover:text-brand dark:hover:text-brand transition-colors">
                  LOG IN
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 dark:text-gray-300 hover:text-black dark:hover:text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="md:hidden bg-white dark:bg-brand-black border-b border-gray-200 dark:border-brand-gray overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-brand bg-brand/5 dark:bg-white/5'
                      : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            {user && (
               <NavLink
                to="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand"
              >
                Admin Panel
              </NavLink>
            )}
            
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5">
              {user ? (
                  <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white px-5 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex flex-col space-y-3">
                  <NavLink 
                    to="/login"
                    className="block w-full text-center text-gray-700 dark:text-white font-bold uppercase tracking-wide py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    Log In
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;