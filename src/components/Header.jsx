// src/components/Header.jsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const role = auth?.user?.role;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Utility function to check if link is active
  const isActive = (path) => location.pathname === path;

  // Helper function for nav link classes with improved hover animation
  const getLinkClasses = (path) => {
    return `px-4 py-2 text-sm font-medium transition-all duration-300 relative ${
      isActive(path) 
        ? 'text-invertase-purple font-semibold' 
        : 'text-dark-text-secondary hover:text-dark-text-primary'
    } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-invertase-gradient after:transition-all after:duration-300 hover:after:w-full hover:translate-y-[-2px]`;
  };

  const getMobileLinkClasses = (path) => {
    return `block transition-all duration-300 py-2 px-4 rounded-lg ${
      isActive(path) 
        ? 'bg-dark-lighter text-invertase-purple font-semibold' 
        : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-lighter/50 hover:translate-x-1'
    }`;
  };

  const handleLogout = () => {
    setAuth(null);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // We no longer need to close dropdown on click outside since it's hover-based
  // But we'll keep the ref for potential future use
  useEffect(() => {
    // No event listeners needed for hover-based dropdown
    return () => {};
  }, []);

  return (
    <header className="bg-dark border-b border-dark-border py-4 px-6 sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/Title with pulse animation */}
        <div className="flex items-center">
          <h1 
            className="text-2xl font-bold cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text hover:animate-pulse hover:from-purple-500 hover:to-blue-600"
            onClick={() => navigate('/home')}
          >
            CodeIndia.Fun
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:block">
          <ul className="flex items-center gap-2">
            <li>
              <Link to="/home" className={getLinkClasses('/home')}>Home</Link>
              <Link to="/contact" className={getLinkClasses('/contact')}>Contact</Link>
            </li>
            {(role === 'student' || role === 'volunteer') && (
              <>
                <li>
                  <Link to="/dashboard" className={getLinkClasses('/dashboard')}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/practice" className={getLinkClasses('/practice')}>Practice</Link>
                </li>
                <li>
                  <Link to="/doubts" className={getLinkClasses('/doubts')}>Doubts</Link>
                </li>
                <li className="relative group" ref={dropdownRef}>
                  <button 
                    className={`${getLinkClasses('')} flex items-center gap-1 group`}
                  >
                    More
                    <svg className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {(
                    <div className="absolute top-full right-0 mt-1 w-48 bg-dark-card rounded-lg shadow-xl border border-dark-border py-2 animate-fadeIn opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <Link to="/Student-solutions" className="block px-4 py-2 text-sm hover:bg-dark-lighter hover:translate-x-1 transition-all duration-200">Q-Solved</Link>
                      <Link to="/briefings/archive" className="block px-4 py-2 text-sm hover:bg-dark-lighter hover:translate-x-1 transition-all duration-200">Previous Briefings</Link>
                    </div>
                  )}
                </li>
              </>
            )}
            {(role === 'mentor' || role === 'admin') && (
              <>
                <li>
                  <Link to="/mentor" className={getLinkClasses('/mentor')}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/resourse" className={getLinkClasses('/resourse')}>Resource</Link>
                </li>
                <li>
                  <Link to="/practice" className={getLinkClasses('/practice')}>Practice</Link>
                </li>
                <li className="relative group" ref={dropdownRef}>
                  <button 
                    className={`${getLinkClasses('')} flex items-center gap-1 group`}
                  >
                    More
                    <svg className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {(
                    <div className="absolute top-full right-0 mt-1 w-48 bg-dark-card rounded-lg shadow-xl border border-dark-border py-2 animate-fadeIn opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <Link to="/doubts" className="block px-4 py-2 text-sm hover:bg-dark-lighter hover:translate-x-1 transition-all duration-200">Doubts</Link>
                      <Link to="/solutions" className="block px-4 py-2 text-sm hover:bg-dark-lighter hover:translate-x-1 transition-all duration-200">Solutions</Link>
                      <Link to="/progress" className="block px-4 py-2 text-sm hover:bg-dark-lighter hover:translate-x-1 transition-all duration-200">Progress</Link>
                      <Link to="/messages" className="block px-4 py-2 text-sm hover:bg-dark-lighter hover:translate-x-1 transition-all duration-200">Messages</Link>
                      <Link to="/briefings/archive" className="block px-4 py-2 text-sm hover:bg-dark-lighter hover:translate-x-1 transition-all duration-200">Briefings</Link>
                      {role === 'admin' && (
                        <Link to="/users" className="block px-4 py-2 text-sm hover:bg-dark-lighter hover:translate-x-1 transition-all duration-200">User Management</Link>
                      )}
                    </div>
                  )}
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* User Actions */}
        <div className="hidden sm:flex items-center gap-4">
          {auth ? (
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:bg-dark-lighter/30 px-3 py-1.5 rounded-lg">
                <span className="text-sm text-dark-text-secondary group-hover:text-dark-text-primary transition-colors duration-200">
                  {auth.user.name}
                </span>
                <svg className="w-4 h-4 text-dark-text-secondary group-hover:text-dark-text-primary transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="absolute right-0 top-full mt-1 w-48 py-2 bg-dark-card rounded-lg shadow-xl border border-dark-border opacity-0 invisible transform translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
                <div className="px-4 py-2 border-b border-dark-border">
                  <p className="text-sm text-dark-text-secondary">Signed in as:</p>
                  <p className="text-sm font-medium text-dark-text-primary">{auth.user.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-dark-lighter hover:text-red-400 transition-all duration-200 hover:translate-x-1"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link 
                to="/login" 
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/login')
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-md shadow-purple-500/20'
                    : 'bg-gradient-to-r from-violet-600/90 to-purple-600/90 hover:shadow-md hover:shadow-purple-500/30 hover:scale-105 hover:from-violet-500 hover:to-purple-500'
                } group overflow-hidden`}
              >
                <span className="relative z-10 flex items-center gap-1.5 text-sm text-white font-medium">
                  <svg className="w-3.5 h-3.5 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></span>
              </Link>
              <Link 
                to="/register" 
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
                  isActive('/register')
                    ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                    : 'border-purple-500/20 hover:border-purple-500/80 hover:bg-purple-600/10 hover:scale-105'
                } group`}
              >
                <span className="flex items-center gap-1.5 text-sm text-purple-200">
                  <svg className="w-3.5 h-3.5 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button with animation */}
        <button 
          className="sm:hidden text-gray-300 hover:text-white transition-transform duration-300 hover:scale-110 hover:rotate-3"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu with animation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-dark-card mt-3 rounded-xl shadow-xl overflow-hidden border border-dark-border animate-slideDown">
          <nav className="px-3 pt-3 pb-4 space-y-2">
            <Link to="/home" className={getMobileLinkClasses('/home')}>Home</Link>
            
            {(role === 'student' || role === 'volunteer') && (
              <>
                <Link to="/dashboard" className={getMobileLinkClasses('/dashboard')}>Dashboard</Link>
                <Link to="/practice" className={getMobileLinkClasses('/practice')}>Practice</Link>
                <Link to="/doubts" className={getMobileLinkClasses('/doubts')}>Doubts</Link>
                <Link to="/Student-solutions" className={getMobileLinkClasses('/Student-solutions')}>Q-Solved</Link>
                <Link to="/briefings/archive" className={getMobileLinkClasses('/briefings/archive')}>Previous Briefings</Link>
              </>
            )}
            
            {(role === 'mentor' || role === 'admin') && (
              <>
                <Link to="/mentor" className={getMobileLinkClasses('/mentor')}>Dashboard</Link>
                <Link to="/resourse" className={getMobileLinkClasses('/resourse')}>Resource</Link>
                <Link to="/practice" className={getMobileLinkClasses('/practice')}>Practice</Link>
                <Link to="/doubts" className={getMobileLinkClasses('/doubts')}>Doubts</Link>
                <Link to="/solutions" className={getMobileLinkClasses('/solutions')}>Solutions</Link>
                <Link to="/progress" className={getMobileLinkClasses('/progress')}>Progress</Link>
                <Link to="/messages" className={getMobileLinkClasses('/messages')}>Messages</Link>
                <Link to="/briefings/archive" className={getMobileLinkClasses('/briefings/archive')}>Briefings</Link>
                {role === 'admin' && (
                  <Link to="/users" className={getMobileLinkClasses('/users')}>User Management</Link>
                )}
              </>
            )}
            
            {auth ? (
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="px-4 py-2">
                  <p className="text-sm text-gray-300">Signed in as:</p>
                  <p className="text-sm font-medium text-white">{auth.user.name}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded mt-1 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-600/30"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-700 flex flex-col gap-2 px-4">
                <Link 
                  to="/login" 
                  className={`w-full flex justify-center px-8 py-3 rounded-xl font-medium transition-all duration-500 ${
                    isActive('/login')
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-purple-500/30'
                      : 'bg-gradient-to-r from-violet-600/90 to-purple-600/90 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] hover:from-violet-500 hover:to-purple-500'
                  } group relative overflow-hidden`}
                >
                  <span className="flex items-center gap-2 text-white font-semibold relative z-10">
                    <svg className="w-4 h-4 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></span>
                </Link>
                <Link 
                  to="/register" 
                  className={`w-full flex justify-center px-8 py-3 rounded-xl font-medium transition-all duration-500 backdrop-blur-sm border-2 ${
                    isActive('/register')
                      ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                      : 'border-purple-500/30 hover:border-purple-500/80 hover:bg-purple-600/20 hover:scale-[1.02]'
                  } group`}
                >
                  <span className="flex items-center gap-2 text-purple-200 font-semibold">
                    <svg className="w-4 h-4 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Register
                  </span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;