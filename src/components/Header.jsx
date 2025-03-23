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

  // Helper function for nav link classes
  const getLinkClasses = (path) => {
    return `px-4 py-2 text-sm font-medium transition-all duration-300 relative ${
      isActive(path) 
        ? 'text-invertase-purple font-semibold' 
        : 'text-dark-text-secondary hover:text-dark-text-primary'
    } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-invertase-gradient after:transition-all after:duration-300 hover:after:w-full`;
  };

  const getMobileLinkClasses = (path) => {
    return `block transition-all duration-300 py-2 px-4 rounded-lg ${
      isActive(path) 
        ? 'bg-dark-lighter text-invertase-purple font-semibold' 
        : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-lighter/50'
    }`;
  };

  const handleLogout = () => {
    setAuth(null);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-dark border-b border-dark-border py-4 px-6 sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center">
          <h1 
            className="text-2xl font-bold cursor-pointer transition-all duration-300 hover:scale-105 text-transparent bg-clip-text bg-invertase-gradient"
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
                <li className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`${getLinkClasses('')} flex items-center gap-1`}
                  >
                    More
                    <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-dark-card rounded-lg shadow-xl border border-dark-border py-2">
                      <Link to="/Student-solutions" className="block px-4 py-2 text-sm hover:bg-dark-lighter">Q-Solved</Link>
                      <Link to="/briefings/archive" className="block px-4 py-2 text-sm hover:bg-dark-lighter">Previous Briefings</Link>
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
                <li className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`${getLinkClasses('')} flex items-center gap-1`}
                  >
                    More
                    <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-dark-card rounded-lg shadow-xl border border-dark-border py-2">
                      <Link to="/doubts" className="block px-4 py-2 text-sm hover:bg-dark-lighter">Doubts</Link>
                      <Link to="/solutions" className="block px-4 py-2 text-sm hover:bg-dark-lighter">Solutions</Link>
                      <Link to="/progress" className="block px-4 py-2 text-sm hover:bg-dark-lighter">Progress</Link>
                      <Link to="/messages" className="block px-4 py-2 text-sm hover:bg-dark-lighter">Messages</Link>
                      <Link to="/briefings/archive" className="block px-4 py-2 text-sm hover:bg-dark-lighter">Briefings</Link>
                      {role === 'admin' && (
                        <Link to="/users" className="block px-4 py-2 text-sm hover:bg-dark-lighter">User Management</Link>
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
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-dark-text-secondary group-hover:text-dark-text-primary transition-colors duration-200">
                  {auth.user.name}
                </span>
                <svg className="w-4 h-4 text-dark-text-secondary group-hover:text-dark-text-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="absolute right-0 top-full mt-1 w-48 py-2 bg-dark-card rounded-lg shadow-xl border border-dark-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 border-b border-dark-border">
                  <p className="text-sm text-dark-text-secondary">Signed in as:</p>
                  <p className="text-sm font-medium text-dark-text-primary">{auth.user.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-dark-lighter transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link 
                to="/login" 
                className="bg-invertase-gradient text-white text-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-dark-lighter hover:bg-dark-lightest text-dark-text-primary text-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-dark-border"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="sm:hidden text-gray-300 hover:text-white"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-dark-card mt-3 rounded-xl shadow-xl overflow-hidden border border-dark-border">
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
                  className="block w-full text-left px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded mt-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-700 flex flex-col gap-2 px-4">
                <Link 
                  to="/login" 
                  className="block w-full text-center py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center py-2 text-sm text-white bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Register
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
