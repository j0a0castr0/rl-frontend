import React from 'react';

const TaskList = () => {
  const dummyListings = [
    { id: 1, name: 'Listing A' },
    { id: 2, name: 'Listing B' }
  ];

  return (
    <div>
      {dummyListings.map(listing => (
        <div key={listing.id} className="card">
          {listing.name}
        </div>
      ))}
    </div>
  );
}

export default TaskList;
