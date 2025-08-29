


import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="fixed w-full top-0 z-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative flex items-center justify-between bg-white/5 border border-white/10 rounded-full px-6 py-3 backdrop-blur-xl">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-500 text-gradient">
            HireWell
          </Link>

          {/* Hamburger Icon */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-200">
            {isAuthenticated ? (
              <>
                <span className="text-gray-400">Welcome, {user?.fullName || user?.email}</span>
                <NavItem to="/jobs" label="Jobs" />
                {user?.role === 'recruiter' && (
                  <>
                    <NavItem to="/interviews" label="Dashboard" /> 
                    <NavItem to="/my-jobs" label="My Jobs" />
                  </>
                )}
                <button onClick={handleLogout} className="hover:text-white transition">Logout</button>
              </>
            ) : (
              <>
                <NavItem to="/jobs" label="Jobs" />
                <NavItem to="/login" label="Log In" />
                <Link to="/signup" className="bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 mx-4 p-4 bg-gray-800/80 border border-white/10 rounded-2xl backdrop-blur-xl flex flex-col gap-4 text-gray-200"
          >
            {isAuthenticated ? (
              <>
                <div className="px-2 py-2 text-sm text-fuchsia-400">
                    Welcome, {user?.fullName || user?.email}
                </div>
                <NavItem to="/jobs" label="Jobs" />
                {user?.role === 'recruiter' && (
                  <>
                    <NavItem to="/interviews" label="Dashboard" />
                    <NavItem to="/my-jobs" label="My Jobs" />
                  </>
                )}
                <button onClick={handleLogout} className="text-left hover:text-white transition">Logout</button>
              </>
            ) : (
              <>
                <NavItem to="/jobs" label="Jobs" />
                <NavItem to="/login" label="Log In" />
                <Link to="/signup" onClick={toggleMenu} className="text-center bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition">Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const NavItem = ({ to, label }) => (
  <Link to={to} className="hover:text-white transition px-2 py-2">{label}</Link>
);