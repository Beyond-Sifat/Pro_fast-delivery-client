// src/Pages/DashBoard/TrackParcel.jsx

import React, { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaBox } from 'react-icons/fa';

const TrackParcel = () => {
  const [trackingId, setTrackingId] = useState('');
  const [submittedId, setSubmittedId] = useState('');
  const axiosSecure = useAxiosSecure();

  const { data: logs = [], refetch, isFetching } = useQuery({
    queryKey: ['tracking', submittedId],
    enabled: !!submittedId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/tracking/${submittedId}`);
      return res.data;
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setSubmittedId(trackingId.trim()); // Trim to remove accidental spaces and ensure clean tracking ID for search
    }
    refetch()
  };
  const stepMap = {
  created: "Parcel Created",
  paid: "Payment Completed",
  assigned: "Rider Assigned",
  'in-transit': "Picked Up",
  delivered: "Delivered"
};

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Track My Parcel</h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Tracking ID (e.g. TRK-XXXXXX)"
          className="input input-bordered w-full"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />
        <button className="btn btn-primary">Track</button>
      </form>

      {isFetching ? (
        <div>Loading...</div>
      ) : logs.length === 0 && submittedId ? (
        <p className="text-red-500">No tracking history found for {submittedId}</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log._id} className="border p-4 rounded bg-gray-50 shadow-sm">
              {/* <p className="text-lg font-semibold">Step {index + 1}: {log.status}</p> */}
              <p className="font-semibold flex items-center"><FaBox className='mr-2'/>{stepMap[log.status] || log.status}</p>
              <p className="text-gray-600">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
