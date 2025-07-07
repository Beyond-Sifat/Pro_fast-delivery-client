import React from 'react';
import { useLoaderData } from 'react-router';
import useAuth from '../../Hooks/useAuth';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const BeARider = () => {
    const { user } = useAuth();
    const serviceCenters = useLoaderData(); // preloaded via route loader

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm();
    const axiosSecure = useAxiosSecure()

    // Extract unique regions from service center data
    const uniqueRegions = [...new Set(serviceCenters.map(center => center.region))];

    // Watch selected region to filter district options
    const selectedRegion = watch('region');
    const filteredDistricts = serviceCenters
        .filter(center => center.region === selectedRegion)
        .map(center => center.district);

    const onSubmit = async (data) => {
        const riderData = {
            ...data,
            name: user.displayName || '',
            email: user.email,
            status: 'pending', // default application status
            createdAt: new Date().toISOString()
        };
        console.log(riderData)



        //send to the backend
        axiosSecure.post(`/riders`, riderData)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        icon: "success",
                        title: "Application Submitted!",
                        text: "Your application is pending approval"
                    })
                }
            })
        reset()
    }
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow my-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Be A Rider</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">

                {/* Name */}
                <div>
                    <label className="font-medium">Full Name</label>
                    <input
                        type="text"
                        value={user?.displayName || ''}
                        readOnly
                        className="input input-bordered w-full bg-gray-100"
                        {...register('name')}
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="font-medium">Email</label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="input input-bordered w-full bg-gray-100"
                        {...register('email')}
                    />
                </div>

                {/* Age */}
                <div>
                    <label className="font-medium">Age</label>
                    <input
                        type="number"
                        placeholder="Enter your age"
                        className="input input-bordered w-full"
                        {...register('age', { required: true })}
                    />
                    {errors.age && <p className="text-red-500 text-sm">Age is required</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="font-medium">Phone Number</label>
                    <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        className="input input-bordered w-full"
                        {...register('phone', { required: true })}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">Phone number is required</p>}
                </div>

                {/* NID */}
                <div>
                    <label className="font-medium">NID Number</label>
                    <input
                        type="text"
                        placeholder="Enter your NID number"
                        className="input input-bordered w-full"
                        {...register('nid', { required: true })}
                    />
                    {errors.nid && <p className="text-red-500 text-sm">NID number is required</p>}
                </div>

                {/* Region */}
                <div>
                    <label className="font-medium">Region</label>
                    <select
                        className="select select-bordered w-full"
                        {...register('region', { required: true })}
                    >
                        <option value="">-- Select Region --</option>
                        {uniqueRegions.map((region, i) => (
                            <option key={i} value={region}>{region}</option>
                        ))}
                    </select>
                    {errors.region && <p className="text-red-500 text-sm">Region is required</p>}
                </div>

                {/* District */}
                <div>
                    <label className="font-medium">District</label>
                    <select
                        className="select select-bordered w-full"
                        {...register('district', { required: true })}
                    >
                        <option value="">-- Select District --</option>
                        {filteredDistricts.map((district, i) => (
                            <option key={i} value={district}>{district}</option>
                        ))}
                    </select>
                    {errors.district && <p className="text-red-500 text-sm">District is required</p>}
                </div>

                {/* Bike Brand */}
                <div>
                    <label className="font-medium">Bike Brand</label>
                    <input
                        type="text"
                        placeholder="e.g., Yamaha, Honda"
                        className="input input-bordered w-full"
                        {...register('bikeBrand', { required: true })}
                    />
                    {errors.bikeBrand && <p className="text-red-500 text-sm">Bike brand is required</p>}
                </div>

                {/* Bike Reg Number */}
                <div>
                    <label className="font-medium">Bike Registration Number</label>
                    <input
                        type="text"
                        placeholder="e.g., DHA-12345"
                        className="input input-bordered w-full"
                        {...register('bikeRegNumber', { required: true })}
                    />
                    {errors.bikeRegNumber && <p className="text-red-500 text-sm">Bike registration number is required</p>}
                </div>

                {/* Submit Button */}
                <button className="btn btn-primary w-full mt-4">Submit Application</button>
            </form>
        </div>
    );
};

export default BeARider;