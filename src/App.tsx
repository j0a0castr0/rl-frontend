import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskCreate from './components/TaskCreate';
import { apiRequest } from './api/api'; // make sure this exists
import './index.css';

const App: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  // Fetch listings from backend on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await apiRequest('/listing'); // GET /listing
        setListings(data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      }
    };
    fetchListings();
  }, []);

  // Called when a new listing is created
  const handleListingCreated = (newListing: any) => {
    setListings(prev => [newListing, ...prev]); // add to top
    setShowCreate(false); // close slide-over
  };

  return (
    <div className="container">
      <div className="header">
        Listing Task Dashboard
        <button className="plus-button" onClick={() => setShowCreate(true)}>
          +
        </button>
      </div>

      <div className="content">
        <TaskList listings={listings} />
      </div>

      <div className={`slide-over ${showCreate ? 'open' : ''}`}>
        <div className="slide-over-header">
          <h2>Create Listing</h2>
          <button className="close-button" onClick={() => setShowCreate(false)}>
            ×
          </button>
        </div>
        <div className="slide-over-content">
          <div className="slide-over-inner">
            <TaskCreate onCreated={handleListingCreated} />
          </div>
        </div>
      </div>

      {showCreate && <div className="overlay" onClick={() => setShowCreate(false)} />}
    </div>
  );
};

export default App;
