import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const PaymentHistory = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { isPending, data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`)
            return res.data
        }
    })
    if (isPending) {
        return '...loading'
    }
    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">My Payment History</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Parcel ID</th>
                            <th>Email</th>
                            <th>Amount (৳)</th>
                            <th>Transaction ID</th>
                            <th>Method</th>
                            <th>Payment Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments?.length > 0 ? (
                            payments.map((payment, index) => (
                                <tr key={payment._id} className="hover:bg-base-200 transition-all">
                                    {/* Serial No. */}
                                    <td className="font-semibold text-gray-600">{index + 1}</td>

                                    {/* Parcel ID */}
                                    <td className="text-sm text-blue-600 break-words">{payment.parcelId}</td>

                                    {/* Parcel ID */}
                                    <td className="text-sm break-words">{payment.email}</td>

                                    {/* Amount Paid */}
                                    <td className="font-bold text-green-600">৳{payment.amount}</td>

                                    {/* Transaction ID */}
                                    <td className="text-xs text-gray-700 break-all">{payment.transactionId}</td>


                                    {/* Payment Method */}
                                    <td className="uppercase font-medium text-indigo-500">
                                        {payment.paymentMethod?.[0] || "Stripe"}
                                    </td>

                                    {/* Payment Date */}
                                    <td className="text-sm text-gray-500">
                                        {new Date(payment.payment_date).toLocaleString('en-BD', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-red-500 py-4">
                                    No payment history found.
                                </td>
                            </tr>
                        )}
                        {payments.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-8 text-gray-500">
                                No parcels found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;