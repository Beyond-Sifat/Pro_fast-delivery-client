import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {
    FaClock,
    FaCheckCircle,
    FaTruck,
    FaTruckLoading,
    FaTimesCircle,
} from 'react-icons/fa';
import { TbTruckDelivery } from 'react-icons/tb';
import Loading from '../../../Components/Loading';

// Icon mapping for each status
const statusIcons = {
    pending: <FaClock className="text-yellow-500 text-3xl" />,
    assigned: <FaTruckLoading className="text-blue-500 text-3xl" />,
    'in-transit': <FaTruck className="text-indigo-600 text-3xl" />,
    delivered: <FaCheckCircle className="text-green-600 text-3xl" />,
    'service center delivered': <TbTruckDelivery className="text-green-500 text-3xl" />,
    cancelled: <FaTimesCircle className="text-red-500 text-3xl" />
};

// Colors for pie chart
const COLORS = ['#FACC15', '#3B82F6', '#6366F1', '#22C55E'];

const RiderDashboard = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data = [], isLoading, error } = useQuery({
        queryKey: ['riderStatusSummary', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/status-summary?email=${user.email}`);
            return res.data;
        }
    });

    // Filter pie chart data (only key statuses)
    const pieData = data.filter(d =>
        ['assigned', 'in-transit', 'delivered', 'pending'].includes(d.status)
    );

    if (isLoading) return <Loading />;
    if (error) return <p className="text-red-500 text-center">Something went wrong</p>;

    return (
        <div className="p-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800">🚚 Rider Dashboard</h1>
                <p className="text-gray-500 mt-2">Track your parcel delivery status performance</p>
            </div>

            {/* Status cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                {data.map(status => (
                    <div
                        key={status.status}
                        className="bg-white shadow-md p-6 rounded-2xl border hover:shadow-xl transition duration-300 flex items-center gap-4"
                    >
                        <div className="p-3 rounded-full bg-gray-100">
                            {statusIcons[status.status] || <FaClock className="text-gray-500 text-3xl" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold capitalize text-gray-700">{status.status}</h3>
                            <p className="text-2xl font-bold text-blue-700">{status.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold mb-4 text-center text-gray-700">📊 Delivery Status Summary</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;
