import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../index.css';

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
          <img
            src="https://via.placeholder.com/120x36?text=Logo"
            alt="Logo"
          />
        </Link>
      </div>

      {/* Center Menu */}
      <nav className="navbar-center">
        <Link to="/" className="nav-link">
          Listings Dashboard
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
