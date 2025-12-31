import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskCreate from './components/TaskCreate';
import { apiRequest } from './api/api';
import './index.css';

interface LoginPageProps {
  onLogin: (accessToken: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email, password },
      });

      if (data.AccessToken) {
        onLogin(data.AccessToken);
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;

    const fetchListings = async () => {
      try {
        const data = await apiRequest('/listing', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setListings(data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      }
    };
    fetchListings();
  }, [loggedIn, accessToken]);

  const handleListingCreated = (newListing: any) => {
    setListings(prev => [newListing, ...prev]);
    setShowCreate(false);
  };

  if (!loggedIn) {
    return <LoginPage onLogin={(token) => { setAccessToken(token); setLoggedIn(true); }} />;
  }

  return (
    <div className="container">
      <div className="header">
        Listing Task Dashboard
        <button className="plus-button" onClick={() => setShowCreate(true)}>+</button>
      </div>

      <div className="content">
        <TaskList listings={listings} />
      </div>

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

      {showCreate && <div className="overlay" onClick={() => setShowCreate(false)} />}
    </div>
  );
};

export default App;
