import React, { useState } from "react";

const TaskCreate: React.FC = () => {
  const [listing, setListing] = useState('');

  const createListing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Creating listing: ${listing}`);
    setListing('');
  };

  return (
    <form onSubmit={createListing}>
      <input
        type="text"
        value={listing}
        onChange={(e) => setListing(e.target.value)}
      />
      <button type="submit">Create Listing</button>
    </form>
  );
};

export default TaskCreate;
