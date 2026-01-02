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
        <div
          key={listing.id}
          className="card listing-item slide-in"
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: '16px',
          }}
        >
          {/* Image at the top */}
          <div
            style={{
              height: '180px',
              width: '100%',
              overflow: 'hidden',
              borderRadius: '16px',
              position: 'relative'
            }}
          >
            <img
              src={`https://picsum.photos/800/360?random=${listing.id}`}
              srcSet={`
                https://picsum.photos/400/180?random=${listing.id} 400w,
                https://picsum.photos/800/360?random=${listing.id} 800w,
                https://picsum.photos/1200/540?random=${listing.id} 1200w
              `}
              sizes="(max-width: 600px) 100vw, 50vw"
              alt="Property"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', transition: 'transform 0.3s' }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.2))',
                pointerEvents: 'none',
              }}
            />
          </div>

          <div style={{ padding: '12px', position: 'relative' }}>
            {/* Share button */}
            <button
              onClick={() => handleShare(listing.id)}
              title={copiedMap[listing.id] ? 'Copied!' : 'Share public link'}
              style={{
                position: 'absolute',
                top: '12px',
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
                zIndex: 2,
              }}
            >
              {FiLink({ size: 16 })}
            </button>

            <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>
              {listing.propertyReference}
            </strong>

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
