import React, { useState } from 'react';
import { apiRequest } from '../api/api';

interface TaskCreateProps {
  onCreated: (listing: any) => void;
}

const TaskCreate: React.FC<TaskCreateProps> = ({ onCreated }) => {
  const [propertyReference, setPropertyReference] = useState('');
  const [agent, setAgent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/listing', {
        method: 'POST',
        body: { propertyReference, agent },
      });
      onCreated(data.data);
      setPropertyReference('');
      setAgent('');
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={createListing}>
      {['propertyReference', 'agent'].map((field, idx) => (
        <input
          key={field}
          type="text"
          placeholder={field === 'propertyReference' ? 'Property Reference' : 'Agent'}
          value={field === 'propertyReference' ? propertyReference : agent}
          onChange={field === 'propertyReference' ? e => setPropertyReference(e.target.value) : e => setAgent(e.target.value)}
          style={{ animationDelay: `${idx * 0.1}s` }} // staggered animation
        />
      ))}
      <button type="submit" style={{ animationDelay: '0.25s' }}>
        {loading ? 'Creating...' : 'Create Listing'}
      </button>
    </form>
  );
};

export default TaskCreate;
