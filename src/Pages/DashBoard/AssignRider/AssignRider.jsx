import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { FaUserPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../../Hooks/useTrackingLogger';

const AssignRider = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const { logTracking } = useTrackingLogger();

    // Load parcels with payment_status=paid & delivery_status=pending
    const { data: parcels = [], isPending, refetch } = useQuery({
        queryKey: ['assignableParcels'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?payment_status=paid&delivery_status=pending`);
            return res.data;
        }
    });


    // Fetch approved riders based on receiver district
    const { data: riders = [], isLoading: isRiderLoading } = useQuery({
        queryKey: ['availableRiders', selectedParcel?.receiverCenter],
        enabled: !!selectedParcel?.receiverCenter,
        queryFn: async () => {
            const res = await axiosSecure.get(`/riders/available?district=${selectedParcel.receiverCenter}`);
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async ({ parcelId, riderId }) => {
            return await axiosSecure.patch(`/parcels/${parcelId}/assign`, { riderId });
        },
        onSuccess: () => {
            Swal.fire('Success', 'Rider assigned successfully', 'success');
            setSelectedParcel(null);
            refetch();

            
            // ✅ Log the tracking status
            logTracking({
                trackingId: selectedParcel.trackingId,
                status: 'Rider Assigned',
                description: `Rider assigned to parcel for delivery in ${selectedParcel.receiverCenter}`
            });


        },
        onError: () => {
            Swal.fire('Error', 'Failed to assign rider', 'error');
        }

    });

    if (isPending) {
        return <p className="text-center py-8">Loading parcels...</p>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Assign Rider to Parcels</h2>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Parcel ID</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Phone</th>
                            <th>Destination</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.map(parcel => (
                            <tr key={parcel._id}>
                                <td>{parcel.transaction_id.slice(-6)}</td>
                                <td>{parcel.senderName}</td>
                                <td>{parcel.receiverName}</td>
                                <td>{parcel.receiverContact}</td>
                                <td>{parcel.destination_district}, {parcel.destination_region}</td>
                                <td><span className="badge badge-success">{parcel.payment_status}</span></td>
                                <td><span className="badge badge-warning">{parcel.delivery_status}</span></td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-info flex items-center gap-1"
                                        onClick={() => setSelectedParcel(parcel)}
                                    >
                                        <FaUserPlus /> Assign Rider
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {parcels.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center text-gray-500 py-4">
                                    No parcels available to assign.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal (optional UI placeholder) */}
            {selectedParcel && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg relative">
                        <button
                            className="absolute top-2 right-2 text-red-600 font-bold"
                            onClick={() => setSelectedParcel(null)}
                        >✕</button>

                        <h3 className="text-lg font-bold mb-4">Assign Rider to Parcel</h3>
                        <p><strong>Receiver:</strong> {selectedParcel.receiverName}</p>
                        <p><strong>Destination District:</strong> {selectedParcel.receiverCenter}</p>

                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Available Riders:</h4>
                            {isRiderLoading ? <p>Loading riders...</p> : (
                                riders.length > 0 ? (
                                    <ul className="space-y-2">
                                        {riders.map(rider => (
                                            <li key={rider._id} className="flex justify-between items-center border p-2 rounded-md">
                                                <div>
                                                    <p><strong>{rider.name}</strong> ({rider.district})</p>
                                                    <p className="text-sm text-gray-600">Phone: {rider.phone}</p>
                                                </div>
                                                <button
                                                    className="btn btn-xs btn-success"
                                                    onClick={() => mutation.mutate({ parcelId: selectedParcel._id, riderId: rider._id })}
                                                >Assign</button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-sm text-gray-500">No available riders in this district.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignRider;
