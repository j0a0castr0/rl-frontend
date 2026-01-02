import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../api/api';
import '../index.css';
import logo from '../assets/logo.png';

interface Slot {
  from: string;
  to: string;
}

const PublicScheduleingPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await apiRequest(`/listing/${listingId}/slots`);
        setSlots(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch slots');
      }
    };

    fetchSlots();
  }, [listingId]);

  const handleScheduleing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return setError('Please select a slot');
    if (!visitorName || !visitorPhone || !visitorEmail) return setError('All fields are required');

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const slot = slots.find(s => s.from === selectedSlot);
      if (!slot) throw new Error('Invalid slot selected');

      await apiRequest('/visit', {
        method: 'POST',
        body: {
          listingId,
          visitorName,
          visitorPhone,
          visitorEmail,
          visitStartTime: slot.from,
          visitEndTime: slot.to
        },
      });

      setSuccess('Visit scheduled successfully!');
    } catch (err: any) {
      setError(err.message || 'Scheduleing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>    
      <div
        className="login-card"
        style={{
          maxWidth: '480px',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          backgroundColor: '#fff',
        }}
      >
          <div>
            <img
            src={logo}   // import your logo at top of file
            alt="Logo"
            style={{ height: '70px', width: 'auto' }}
            />
        </div>
        {/* Slick Hero Image */}
        <div style={{ width: '100%', height: '220px', overflow: 'hidden', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
          <img
            src={`https://picsum.photos/800/440?random=${listingId}`}
            srcSet={`
              https://picsum.photos/400/220?random=${listingId} 400w,
              https://picsum.photos/800/440?random=${listingId} 800w,
              https://picsum.photos/1200/660?random=${listingId} 1200w
            `}
            sizes="(max-width: 480px) 100vw, 480px"
            alt="Property"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '16px',
              transition: 'transform 0.3s ease-out',
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>

        <div style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '12px', fontSize: '1.5rem', fontWeight: 600 }}>Schedule a Visit</h2>

          {error && <p className="error">{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <form onSubmit={handleScheduleing}>
            <input
              type="text"
              placeholder="Your Name"
              value={visitorName}
              onChange={e => setVisitorName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={visitorPhone}
              onChange={e => setVisitorPhone(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={visitorEmail}
              onChange={e => setVisitorEmail(e.target.value)}
              required
            />

            <div style={{ margin: '16px 0' }}>
              <strong>Select a slot:</strong>
              <div className="slot-badges">
                {slots.map(slot => {
                  const display = `${new Date(slot.from).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} - ${new Date(slot.to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                  return (
                    <span
                      key={slot.from}
                      className={`slot-badge ${new Date(slot.from).getHours() < 12 ? 'morning' : new Date(slot.from).getHours() < 18 ? 'afternoon' : 'evening'}`}
                      style={{
                        cursor: 'pointer',
                        border: selectedSlot === slot.from ? '2px solid #6c63ff' : undefined,
                      }}
                      onClick={() => setSelectedSlot(slot.from)}
                    >
                      {display}
                    </span>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#6c63ff',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Scheduling...' : 'Schedule Visit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicScheduleingPage;
