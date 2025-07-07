import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FaEye, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['my-parcels', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`)
            return res.data
        }
    });
    console.log(parcels)

    const handlePay = (_id) => {
        console.log(_id)
        navigate(`/dashBoard/payment/${_id}`)
    }
    const handleView = () => {

    }
    const handleDelete = (_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(result => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/parcels/${_id}`)
                    .then(res => {
                        if (res.data.deletedCount) {
                            Swal.fire("Deleted!", "Your item has been deleted.", "success");
                        }
                        refetch();
                    })
            }
        })
    }

    return (
        <div className="overflow-x-auto max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">📦 My Parcels</h2>
            <table className="table table-zebra w-full text-sm">
                <thead>
                    <tr className="bg-base-200 text-base">
                        <th>#</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Created At</th>
                        <th>Cost (৳)</th>
                        <th>Payment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {parcels.map((parcel, index) => (
                        <tr key={parcel._id}>
                            <td>{index + 1}</td>
                            <td className="capitalize">{parcel.parcelType}</td>
                            <td className="capitalize">{parcel.title}</td>

                            {/* 📅 Format creation date */}
                            <td>{new Date(parcel.creation_date).toLocaleString()}</td>

                            <td className="font-medium text-right">{parcel.cost}</td>

                            {/* 🔴🟢 Payment status */}
                            <td>
                                <span className={`badge ${parcel.payment_status === 'paid' ? 'badge-success' : 'badge-error'}`}>
                                    {parcel.payment_status}
                                </span>
                            </td>
                            

                            {/* 🔘 Action buttons */}
                            <td className="space-x-2">
                                <button onClick={() => handleView} className="btn btn-primary btn-sm text-white">
                                    <FaEye />
                                </button>
                                <button
                                    onClick={() => handlePay(parcel._id)}
                                    className="btn btn-sm btn-warning text-white"
                                    disabled={parcel.payment_status === 'paid'}>
                                    Pay
                                </button>
                                <button
                                    onClick={() => handleDelete(parcel._id)}
                                    className="btn btn-sm btn-error text-white">

                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}

                    {parcels.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-8 text-gray-500">
                                No parcels found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyParcels;