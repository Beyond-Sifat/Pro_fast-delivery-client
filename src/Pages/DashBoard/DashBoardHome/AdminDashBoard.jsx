import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { FaTruckLoading, FaClock, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import { TbTruckDelivery } from "react-icons/tb";
import Loading from '../../../Components/Loading';

const statusIcons = {
    pending: <FaClock className="text-yellow-500 text-3xl" />,
    assigned: <FaTruckLoading className="text-blue-500 text-3xl" />,
    'in-transit': <FaTruck className="text-indigo-600 text-3xl" />,
    delivered: <FaCheckCircle className="text-green-600 text-3xl" />,
    'service center delivered': <TbTruckDelivery className="text-green-500 text-3xl" />,
    cancelled: <FaTimesCircle className="text-red-500 text-3xl" />
};

const COLORS = {
    pending: '#FACC15', // yellow
    assigned: '#3B82F6', // blue
    'in-transit': '#6366F1', // indigo
    delivered: '#22C55E' // green
};

const AdminDashBoard = () => {
    const axiosSecure = useAxiosSecure();

    const { data = [], isLoading, error } = useQuery({
        queryKey: ['parcelStatusCounts'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/parcel-status-counts');
            return res.data;
        }
    });

    if (isLoading) return <Loading />;
    if (error) return <p className="text-red-500 text-center">Something went wrong</p>;

    // 🎯 Filter statuses for pie chart
    const pieData = data.filter(d =>
        ['pending', 'assigned', 'in-transit', 'delivered'].includes(d.status)
    );

    return (
        <div className="p-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800">📦 Admin Dashboard</h1>
                <p className="text-gray-500 mt-2">Overview of all parcel statuses</p>
            </div>

            {/* 🎨 Pie Chart Section for Visualizing Status Distribution */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-10 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-center mb-4 text-gray-700">📊 Parcel Status Distribution</h2>

                {/* 🌀 ResponsiveContainer makes chart mobile-friendly */}
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>

                        {/* 🥧 Pie accepts data, keys, radius, and auto label */}
                        <Pie
                            data={pieData}             // filtered data only for relevant statuses
                            dataKey="count"           // value shown by size of slice
                            nameKey="status"         // label shown in tooltip/legend
                            cx="50%" cy="50%"       // center position 
                            outerRadius={100}      // size of the pie
                            label                 // auto label slices


                        >
                            {/* 🎨 Dynamically assign color to each slice */}
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[entry.status] || '#8884d8'}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* 💡 Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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
        </div>
    );
};

export default AdminDashBoard;
