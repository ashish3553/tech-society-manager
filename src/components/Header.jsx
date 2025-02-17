// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = auth?.user?.role;

  const handleLogout = () => {
    setAuth(null);
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        {/* Logo/Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold">
            <Link to="/home" className="hover:underline">
              CodeIndia.Fun
            </Link>
          </h1>
        </div>
        {/* Navigation */}
        <nav>
          <ul className="flex flex-col sm:flex-row items-center gap-4">
            {/* Always visible */}
            <li>
              <Link to="/home" className="hover:underline">
                Home
              </Link>
            </li>

            {/* Student and Volunteer UI */}
            {(role === 'student' || role === 'volunteer') && (
              <>
                <li>
                  <Link to="/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/doubts" className="hover:underline">
                    Doubts
                  </Link>
                </li>
                <li>
                  <Link to="/practice" className="hover:underline">
                    Practice
                  </Link>
                </li>
                <li>
                  <Link to="/briefings/archive" className="hover:underline">
                    Previous Briefings
                  </Link>
                </li>
              </>
            )}

            {/* Mentor/Admin UI */}
            {(role === 'mentor' || role === 'admin') && (
              <>
                {role === 'mentor' && (
                  <li>
                    <Link to="/mentor" className="hover:underline">
                      Mentor Dashboard
                    </Link>
                  </li>
                )}
                {role === 'admin' && (
                  <li>
                    <Link to="/mentor" className="hover:underline">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/resourse" className="hover:underline">
                    Resourse
                  </Link>
                </li>
                <li>
                  <Link to="/doubts" className="hover:underline">
                    Doubts
                  </Link>
                </li>
                <li>
                  <Link to="/practice" className="hover:underline">
                    Practice
                  </Link>
                </li>
                <li>
                  <Link to="/briefings/archive" className="hover:underline">
                    Briefings
                  </Link>
                </li>
                {role === 'admin' && (
                  <li>
                    <Link to="/users" className="hover:underline">
                      User Management
                    </Link>
                  </li>
                )}
              </>
            )}

            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>

            {/* Logout / Login button */}
            {auth ? (
              <li>
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
