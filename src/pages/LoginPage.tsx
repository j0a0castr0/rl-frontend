import React, { useState } from 'react';
import { apiRequest } from '../api/api';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import logo from '../assets/logo.png';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

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
        body: { email, password },
      });

      if (data.AccessToken && data.IdToken) {
        login(data.AccessToken, data.IdToken);
        navigate('/'); // ✅ redirect to dashboard
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
      <div>
            <img
            src={logo}   // import your logo at top of file
            alt="Logo"
            style={{ height: '120px', margin : '-20px', width: 'auto' }}
            />
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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

export default LoginPage;
