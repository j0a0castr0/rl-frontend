import React, { useState } from 'react';
import { apiRequest } from '../api/api';

interface TaskCreateProps {
  onCreated: (listing: { id: string; propertyReference: string }) => void;
}

const TaskCreate: React.FC<TaskCreateProps> = ({ onCreated }) => {
  const [propertyReference, setPropertyReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // API only returns ID
      const data = await apiRequest('/listing', {
        method: 'POST',
        body: { propertyReference },
      });

      // Optimistic update: we know the propertyReference
      onCreated({ id: data.data.id, propertyReference });

      setPropertyReference('');
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={createListing}>
      <input
        type="text"
        placeholder="Property Reference"
        value={propertyReference}
        onChange={e => setPropertyReference(e.target.value)}
      />
      <button type="submit">{loading ? 'Creating...' : 'Create Listing'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default TaskCreate;
