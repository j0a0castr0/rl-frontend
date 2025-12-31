import React, { useState, useEffect } from 'react';
import ListingSlots from './ListingSlots';
import { apiRequest } from '../api/api';

interface TaskListProps {
  listings: any[];
}

const TaskList: React.FC<TaskListProps> = ({ listings }) => {
  const [slotsMap, setSlotsMap] = useState<Record<string, any[]>>({});

  // Fetch slots for each listing when listings change
  useEffect(() => {
    listings.forEach(async (listing) => {
      try {
        const data = await apiRequest(`/listing/${listing.id}/slots`);
        setSlotsMap(prev => ({ ...prev, [listing.id]: data }));
      } catch (err) {
        console.error(err);
      }
    });
  }, [listings]);

  const handleSlotAdded = (listingId: string, slot: any) => {
    // Add new slot to the correct listing only
    setSlotsMap(prev => ({
      ...prev,
      [listingId]: [...(prev[listingId] || []), slot],
    }));
  };

  return (
    <div className="listing-list">
      {listings.length === 0 && <p>No listings yet.</p>}
      {listings.map(listing => (
        <div key={listing.id} className="card listing-item slide-in">
          <div>
            <strong>{listing.propertyReference || 'Unnamed'}</strong>
            <div className="slot">Agent: {listing.agent || '-'}</div>

            {/* ListingSlots now receives only its own slots */}
            <ListingSlots
              listingId={listing.id}
              slots={slotsMap[listing.id] || []}
              onSlotAdded={(slot) => handleSlotAdded(listing.id, slot)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
