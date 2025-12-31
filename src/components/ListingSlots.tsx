import React, { useState } from 'react';
import { apiRequest } from '../api/api';

interface ListingSlotsProps {
  listingId: string;
  slots: { from: string; to: string }[];
  onSlotAdded: (slot: { from: string; to: string }) => void;
}

const ListingSlots: React.FC<ListingSlotsProps> = ({ listingId, slots, onSlotAdded }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [fromTime, setFromTime] = useState('09:00'); // default start
  const [toTime, setToTime] = useState('10:00'); // default 1-hour slot
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Group slots by day
  const groupedSlots = slots.reduce<Record<string, { from: string; to: string }[]>>(
    (acc, slot) => {
      const day = new Date(slot.from).toLocaleDateString([], { dateStyle: 'medium' });
      if (!acc[day]) acc[day] = [];
      acc[day].push(slot);
      return acc;
    },
    {}
  );

  // Prevent selecting past dates
  const today = new Date().toISOString().split('T')[0];

  const addSlot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate) return setError('Please select a date');
    if (fromTime >= toTime) return setError('End time must be after start time');

    setLoading(true);
    setError('');

    try {
      const from = new Date(`${selectedDate}T${fromTime}:00`).toISOString();
      const to = new Date(`${selectedDate}T${toTime}:00`).toISOString();

      const newSlot = { from, to };
      await apiRequest(`/listing/${listingId}/availability`, {
        method: 'POST',
        body: newSlot,
      });

      onSlotAdded(newSlot);

      // Reset times but keep selected date
      setFromTime('09:00');
      setToTime('10:00');
    } catch (err: any) {
      setError(err.message || 'Failed to add slot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <h4>Availability Slots</h4>
      {slots.length === 0 && <p>No slots yet.</p>}

      {/* Display grouped slots */}
      <div className="slot-groups">
        {Object.entries(groupedSlots).map(([day, daySlots]) => (
          <div key={day} style={{ marginBottom: '6px' }}>
            <strong>{day}</strong>
            <div className="slot-badges">
            {daySlots.map((slot, idx) => {
                const hour = new Date(slot.from).getHours();
                let timeClass = '';
                if (hour < 12) timeClass = 'morning';
                else if (hour < 18) timeClass = 'afternoon';
                else timeClass = 'evening';

                return (
                <span
                    key={slot.from + slot.to} // unique key per slot
                    className={`slot-badge ${timeClass} slot-new`}
                >
                    {new Date(slot.from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {new Date(slot.to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                );
            })}
            </div>
          </div>
        ))}
      </div>

      {/* Add slot form */}
      <form onSubmit={addSlot} className="slot-form">
        {/* Day selector */}
        <input
          type="date"
          value={selectedDate}
          min={today} // prevent past dates
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />

        {/* From and To times */}
        <input
          type="time"
          value={fromTime}
          onChange={(e) => {
            setFromTime(e.target.value);

            // Auto-adjust toTime to keep 1-hour default if possible
            const [h, m] = e.target.value.split(':').map(Number);
            let newEndHour = h + 1;
            let newEndMinute = m;
            if (newEndHour > 23) newEndHour = 23;
            setToTime(`${String(newEndHour).padStart(2, '0')}:${String(newEndMinute).padStart(2, '0')}`);
          }}
          required
        />
        <input
          type="time"
          value={toTime}
          onChange={(e) => setToTime(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Slot'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '6px' }}>{error}</p>}
    </div>
  );
};

export default ListingSlots;
