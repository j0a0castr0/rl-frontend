import React, { useState, useEffect } from 'react';
import ListingSlots from './ListingSlots';
import { apiRequest } from '../api/api';
import { FiLink } from 'react-icons/fi';

interface TaskListProps {
  listings: { id: string; propertyReference: string }[];
}

const TaskList: React.FC<TaskListProps> = ({ listings }) => {
  const [slotsMap, setSlotsMap] = useState<Record<string, any[]>>({});
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  // Fetch slots for all listings
  useEffect(() => {
    listings.forEach(async listing => {
      if (!slotsMap[listing.id]) {
        try {
          const data = await apiRequest(`/listing/${listing.id}/slots`);
          setSlotsMap(prev => ({ ...prev, [listing.id]: data }));
        } catch (err) {
          console.error(err);
        }
      }
    });
  }, [listings]);

  const handleSlotAdded = (listingId: string, slot: any) => {
    setSlotsMap(prev => ({
      ...prev,
      [listingId]: [...(prev[listingId] || []), slot],
    }));
  };

  const handleShare = (listingId: string) => {
    const publicUrl = `${window.location.origin}/public/${listingId}`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopiedMap(prev => ({ ...prev, [listingId]: true }));
      setTimeout(() => {
        setCopiedMap(prev => ({ ...prev, [listingId]: false }));
      }, 2000);
    });
  };

  return (
    <div className="listing-list">
      {listings.length === 0 && <p>No listings yet.</p>}
      {listings.map(listing => (
        <div key={listing.id} className="card listing-item slide-in">
          <div>
            <button
              onClick={() => handleShare(listing.id)}
              title={copiedMap[listing.id] ? 'Copied!' : 'Share public link'}
              style={{
                position: 'absolute',
                right: '12px',
                background: copiedMap[listing.id] ? '#34D399' : 'rgba(108, 99, 255, 0.1)',
                color: copiedMap[listing.id] ? '#fff' : '#6c63ff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {FiLink({ size: 16 })}
            </button>

            <strong>{listing.propertyReference}</strong>

            <ListingSlots
              listingId={listing.id}
              slots={slotsMap[listing.id] || []}
              onSlotAdded={slot => handleSlotAdded(listing.id, slot)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
