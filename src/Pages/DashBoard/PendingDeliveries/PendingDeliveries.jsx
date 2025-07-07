import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FaCheckCircle, FaTruck } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../../Hooks/useTrackingLogger';

const PendingDeliveries = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const {logTracking} = useTrackingLogger();

    const { data: parcels = [], isLoading, refetch } = useQuery({
        queryKey: ['riderParcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`);
            return res.data;
        }
    });
 
   const mutation = useMutation({
    mutationFn: async ({ parcelId, newStatus }) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/status`, {
        status: newStatus,
        riderEmail: user.email
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire('Updated!', 'Parcel status updated.', 'success');
      refetch();
    },
    onError: () => {
      Swal.fire('Error', 'Something went wrong!', 'error');
    }
  });

 const handleUpdate = (parcel, newStatus) => {
  const confirmText =
    newStatus === 'in-transit'
      ? 'Mark this parcel as Picked Up?'
      : 'Mark this parcel as Delivered?';

  Swal.fire({
    title: 'Are you sure?',
    text: confirmText,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, confirm'
  }).then(result => {
    if (result.isConfirmed) {
      mutation.mutate(
        { parcelId: parcel._id, newStatus },
        {
          onSuccess: () => {
            refetch();

            // ✅ Add tracking
            logTracking({
              trackingId: parcel.trackingId,
              status: newStatus === 'in-transit' ? 'Picked Up' : 'Delivered',
              description: `Parcel ${newStatus === 'in-transit' ? 'picked up' : 'delivered'} by ${user?.displayName || 'rider'}`
            });

            
          }
        }
      );
    }
  });
};

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Pending Deliveries</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Tracking ID</th>
                            <th>Title</th>
                            <th>Receiver</th>
                            <th>Region</th>
                            <th>District</th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th>Assigned Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.map(parcel => (
                            <tr key={parcel._id}>
                                <td>{parcel.trackingId}</td>
                                <td>{parcel.title}</td>
                                <td>{parcel.receiverName}</td>
                                <td>{parcel.receiverRegion}</td>
                                <td>{parcel.receiverCenter}</td>
                                <td>{parcel.cost}</td>
                                <td>
                                    <span className="badge badge-warning w-20">{parcel.delivery_status}</span>
                                </td>
                                <td>{new Date(parcel.assignedAt).toLocaleDateString()}</td>
                                <td>
                                    {parcel.delivery_status === 'assigned' && (
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => handleUpdate(parcel, 'in-transit')}
                                        >
                                            <FaTruck className="mr-1" /> Picked Up
                                        </button>
                                    )}
                                    {parcel.delivery_status === 'in-transit' && (
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => handleUpdate(parcel, 'delivered')}
                                        >
                                            <FaCheckCircle className="mr-1" /> Delivered
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {parcels.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-500">
                                    No tasks available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingDeliveries;