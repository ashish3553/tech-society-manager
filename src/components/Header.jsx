// src/components/Header.jsx
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = auth?.user?.role;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setAuth(null);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-blue-600 text-white py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center">
          <h1 
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate('/home')}
          >
            CodeIndia.Fun
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:block">
          <ul className="flex items-center gap-4">
            <li>
              <Link to="/home" className="hover:underline">Home</Link>
            </li>
            {(role === 'student' || role === 'volunteer') && (
              <>
                <li>
                  <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                </li>
                <li>
                  <Link to="/practice" className="hover:underline">Practice</Link>
                </li>
                <li>
                  <Link to="/doubts" className="hover:underline">Doubts</Link>
                </li>

                <li>
                  <Link to="/Student-solutions" className="hover:underline">Q-Solved</Link>
                </li>


                <li>
                  <Link to="/briefings/archive" className="hover:underline">Previous Briefings</Link>
                </li>
              </>
            )}
            {(role === 'mentor' || role === 'admin') && (
              <>
                <li>
                  <Link to="/mentor" className="hover:underline">Dashboard</Link>
                </li>
                <li>
                  <Link to="/resourse" className="hover:underline">Resource</Link>
                </li>
                <li>
                  <Link to="/practice" className="hover:underline">Practice</Link>
                </li>
                <li>
                  <Link to="/doubts" className="hover:underline">Doubts</Link>
                </li>
                
                <li>
                <Link to="/solutions" className="hover:underline">
                  Solutions
                </Link>
              </li>
              <li>
                <Link to="/progress" className="hover:underline">
                  Progress
                </Link>
              </li>
                <li>
                  <Link to="/doubts" className="hover:underline">Messages</Link>
                </li>
                <li>
                  <Link to="/briefings/archive" className="hover:underline">Briefings</Link>
                </li>
                {role === 'admin' && (
                  <li>
                    <Link to="/users" className="hover:underline">User Management</Link>
                  </li>
                )}
              </>
            )}
            { !auth && (
              <li>
                <Link to="/contact" className="hover:underline">Contact</Link>
              </li>
            )}
            {auth ? (
              <li>
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="hover:underline">Login</Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Hamburger Icon */}
        <div className="sm:hidden">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            {/* Hamburger icon */}
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="sm:hidden mt-4">
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/home" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </li>
            {(role === 'student' || role === 'volunteer') && (
              <>
                <li>
                  <Link to="/dashboard" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/doubts" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Doubts</Link>
                </li>
                <li>
                  <Link to="/practice" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Practice</Link>
                </li>
                <li>
                  <Link to="/briefings/archive" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Previous Briefings</Link>
                </li>
              </>
            )}
            {(role === 'mentor' || role === 'admin') && (
              <>
                <li>
                  <Link to="/mentor" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/resourse" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Resource</Link>
                </li>
                <li>
                  <Link to="/practice" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Practice</Link>
                </li>
                <li>
                  <Link to="/doubts" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Doubts</Link>
                </li>
                <li>
                  <Link to="/briefings/archive" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Briefings</Link>
                </li>
                {role === 'admin' && (
                  <li>
                    <Link to="/users" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>User Management</Link>
                  </li>
                )}
              </>
            )}
            {!auth && (
              <li>
                <Link to="/contact" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              </li>
            )}
            {auth ? (
              <li>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block hover:underline">
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="block hover:underline" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
