import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const ActiveRider = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');

  // Load approved riders
  const { data: riders = [], refetch, isPending } = useQuery({
    queryKey: ['activeRiders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/riders/approved');
      return res.data;
    }
  });

  if (isPending) return <p className="text-center py-8">Loading...</p>;

  // Filter riders by search input
  const filteredRiders = riders.filter(rider =>
  rider.name?.toLowerCase().includes(searchTerm.toLowerCase())
);

  // Deactivate rider
  const handleDeactivate = async (rider, riderName) => {
    const confirm = await Swal.fire({
      title: 'Deactivate Rider?',
      text: `Are you sure you want to deactivate ${riderName.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Deactivate',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/riders/${rider._id}/status`, {
          status: 'inactive'
        });

        if (res.data.modifiedCount > 0) {
          Swal.fire('Deactivated!', `${riderName} has been deactivated.`, 'success');
          refetch();
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to deactivate rider.', 'error');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

      {/* Search Input */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FaSearch className="text-xl" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>District</th>
              <th>Phone</th>
              <th>Bike</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map(rider => (
              <tr key={rider._id}>
                <td>{rider.name}</td>
                <td>{rider.email.slice(0,10)}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>{rider.phone}</td>
                <td>{rider.bikeBrand} / {rider.bikeRegNumber}</td>
                <td>
                  <span className="badge badge-success text-white">{rider.status}</span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeactivate(rider._id, rider.name)}
                  >
                    <FaTimes /> Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {filteredRiders.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">No matching riders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRider;
