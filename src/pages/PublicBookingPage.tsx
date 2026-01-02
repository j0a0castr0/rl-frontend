import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../api/api';
import '../index.css';

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
          visitTime: slot.from,
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
    <div className="login-container" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="login-card" style={{ maxWidth: '480px' }}>
        <h2>Schedule a Visit</h2>

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

          <div style={{ margin: '12px 0' }}>
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

          <button type="submit" disabled={loading}>
            {loading ? 'Scheduleing...' : 'Schedule Visit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicScheduleingPage;
