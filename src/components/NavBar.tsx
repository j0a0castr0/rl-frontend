import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../index.css';
import logo from '../assets/logo.png';

const NavBar: React.FC = () => {
  const { idToken, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Extract initials from email
  const email = idToken ? JSON.parse(atob(idToken.split('.')[1])).email : '';
  const initials = email
  ? email
      .split('@')[0]
      .split(/[\.\-_]/)
      .map((w: string) => w?.[0]?.toUpperCase() || '')
      .join('')
  : '';

  return (
    <header className="navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <Link to="/" className="logo">
            <img src={logo} alt="Logo" />
        </Link>
      </div>

      {/* Center Menu */}
      <nav className="navbar-center">
  <Link to="/" className="nav-link listings-link">
    {/* Home / property icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.75z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 22V12h6v10"
      />
    </svg>
    Listings
  </Link>
</nav>


      {/* Right: Profile */}
      <div className="navbar-right" style={{ position: 'relative' }}>
        <button
          className="profile-button"
          onClick={() => setShowProfileMenu(prev => !prev)}
        >
          {initials || 'U'}
        </button>

        {showProfileMenu && (
          <div
            className="profile-menu"
            style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              background: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              overflow: 'hidden',
              zIndex: 2000,
            }}
          >
            <button
              onClick={logout}
              style={{
                display: 'block',
                padding: '10px 16px',
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
