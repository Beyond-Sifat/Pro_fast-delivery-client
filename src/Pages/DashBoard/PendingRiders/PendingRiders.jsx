import { useState } from 'react';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const PendingRiders = () => {
    const [selectedRider, setSelectedRider] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const axiosSecure = useAxiosSecure();

    const { isPending, data: riders = [], refetch } = useQuery({
        queryKey: ['/pendingRiders'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/riders/pending`)
            return res.data
        }
    })
    if (isPending) {
        return '...loading'
    }

    // Approve or Cancel handler
    const handleUpdateStatus = async (rider, isApprove, email) => {
        const action = isApprove ? "approve" : "cancel";
        const confirm = await Swal.fire({
            title: `${isApprove ? "Approve" : "Cancel"} Application`,
            // text: `Are you sure you want to ${action} ${rider.name}'s application?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: isApprove ? "Yes, Approve" : "Yes, Cancel",
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/riders/${rider._id}/status`, {
                    status: isApprove ? "approved" : "cancelled",
                    email
                });
                refetch()

                if (res.data.modifiedCount > 0) {
                    Swal.fire(`${action === "approve" ? "Approved" : "Cancelled"}!`, `Rider ${rider} has been ${action}d.`, "success");
                }
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Something went wrong!", "error");
            }
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            {/* <th>#</th>
              <th>Photo</th> */}
                            <th>Name</th>
                            <th>Email</th>
                            <th>Region</th>
                            <th>District</th>
                            <th>Applied</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riders.map((rider) => (
                            <tr key={rider._id}>
                                {/* <td>{index + 1}</td>
                <td>
                  <img src={rider.photoURL} alt="rider" className="w-12 h-12 rounded-full object-cover" />
                </td> */}
                                <td>{rider.name}</td>
                                <td>{rider.email}</td>
                                <td>{rider.region}</td>
                                <td>{rider.district}</td>
                                <td>{new Date(rider.createdAt).toLocaleDateString()}</td>
                                <td className="flex items-center gap-2">
                                    <button
                                        className="btn btn-sm btn-info"
                                        onClick={() => { setSelectedRider(rider); setOpenModal(true); }}
                                        title="View"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleUpdateStatus(rider, true, rider.email)}
                                        title="Approve"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-error"
                                        onClick={() => handleUpdateStatus(rider, false, rider.email)}
                                        title="Cancel"
                                    >
                                        <FaTimes />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {openModal && selectedRider && (

                <div className="fixed inset-0 backdrop-blur-md  bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
                        <button className="absolute top-2 right-2 text-red-500 font-bold" onClick={() => setOpenModal(false)}>✕</button>
                        <h3 className="text-xl font-bold mb-4">Rider Info</h3>
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {selectedRider.name}</p>
                            <p><strong>Email:</strong> {selectedRider.email}</p>
                            <p><strong>Phone:</strong> {selectedRider.phone}</p>
                            <p><strong>NID:</strong> {selectedRider.nid}</p>
                            <p><strong>Region:</strong> {selectedRider.region}</p>
                            <p><strong>District:</strong> {selectedRider.district}</p>
                            <p><strong>Bike Brand:</strong> {selectedRider.bikeBrand}</p>
                            <p><strong>Bike Reg. No:</strong> {selectedRider.bikeRegNumber}</p>
                            <p><strong>Status:</strong> {selectedRider.status}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingRiders;
