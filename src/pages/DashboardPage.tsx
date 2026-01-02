import React, { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import TaskCreate from '../components/TaskCreate';
import { apiRequest, registerAuthTokenGetter } from '../api/api';
import { useAuth } from '../auth/AuthContext';
import '../index.css';

const DashboardPage: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { accessToken, idToken, logout } = useAuth();

  useEffect(() => {
    registerAuthTokenGetter(() => ({ accessToken, idToken }));
  }, [accessToken, idToken]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchListings = async () => {
      try {
        const data = await apiRequest('/listing');
        setListings(data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      }
    };

    fetchListings();
  }, [accessToken]);

  const handleListingCreated = (newListing: any) => {
    setListings(prev => [newListing, ...prev]);
    setShowCreate(false);
  };

  // Extract initials from email in idToken
  const email = idToken ? JSON.parse(atob(idToken.split('.')[1])).email : '';
  const initials = email
  ? email
      .split('@')[0]
      .split(/[\.\-_]/)
      .map((w: string) => w?.[0]?.toUpperCase() || '')
      .join('')
  : '';

  return (
    <>
      <div className="container">
        <div className="header">
          Listing Task Dashboard

          <div className="profile-container" style={{ position: 'relative' }}>
            <button
              className="profile-button"
              onClick={() => setShowProfileMenu(prev => !prev)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#6c63ff',
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              {initials}
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

          <button
            className="plus-button"
            onClick={() => setShowCreate(true)}
            style={{ marginLeft: '12px' }}
          >
            +
          </button>
        </div>

        <div className="content">
          <TaskList listings={listings} />
        </div>
      </div>

      {/* Slide-over Create Listing */}
      <div className={`slide-over ${showCreate ? 'open' : ''}`}>
        <div className="slide-over-header">
          <h2>Create Listing</h2>
          <button className="close-button" onClick={() => setShowCreate(false)}>×</button>
        </div>

        <div className="slide-over-content">
          <div className="slide-over-inner">
            <TaskCreate onCreated={handleListingCreated} />
          </div>
        </div>
      </div>

      {showCreate && (
        <div
          className="overlay"
          onClick={() => setShowCreate(false)}
        />
      )}
    </>
  );
};

export default DashboardPage;
