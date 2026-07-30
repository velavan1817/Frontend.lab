import React, { useState, useEffect } from 'react';

export const WaitlistForm = ({ resourceId }) => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddToWaitlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          resourceId,
          userId: localStorage.getItem('userId'),
          startDate: dateRange.start,
          endDate: dateRange.end,
          priority: 0
        })
      });

      if (!response.ok) throw new Error('Failed to add to waitlist');

      const data = await response.json();
      setPosition(data.positionInQueue);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Join Waitlist</h2>
      
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Start Date</label>
        <input
          type="date"
          value={dateRange.start || ''}
          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">End Date</label>
        <input
          type="date"
          value={dateRange.end || ''}
          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <button
        onClick={handleAddToWaitlist}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add to Waitlist'}
      </button>

      {position !== null && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800 font-bold">Successfully added! Position: #{position}</p>
        </div>
      )}
    </div>
  );
};
