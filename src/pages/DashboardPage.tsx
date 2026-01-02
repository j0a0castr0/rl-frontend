import React, { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import TaskCreate from '../components/TaskCreate';
import { apiRequest, registerAuthTokenGetter } from '../api/api';
import { useAuth } from '../auth/AuthContext';
import '../index.css';

const DashboardPage: React.FC = () => {

  const [listings, setListings] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const { accessToken, idToken } = useAuth();

  useEffect(() => {
    registerAuthTokenGetter(() => ({ accessToken, idToken }));
  }, [accessToken, idToken]);

  // Fetch listings once authenticated
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

  return (
    <>
      <div className="container">
        <div className="header">
          Listing Task Dashboard
          <button
            className="plus-button"
            onClick={() => setShowCreate(true)}
          >
            +
          </button>
        </div>
  
        <div className="content">
          <TaskList listings={listings} />
        </div>
      </div>
  
      {/* Slide-over must be OUTSIDE container */}
      <div className={`slide-over ${showCreate ? 'open' : ''}`}>
        <div className="slide-over-header">
          <h2>Create Listing</h2>
          <button
            className="close-button"
            onClick={() => setShowCreate(false)}
          >
            ×
          </button>
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
