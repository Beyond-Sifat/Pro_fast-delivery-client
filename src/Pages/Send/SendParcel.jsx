import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
// import useAuth from '../../Hooks/useAuth';
import useAuth from '../../Hooks/useAuth';
import { useLoaderData, useNavigate } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../Hooks/useTrackingLogger';

const SendParcel = () => {
    const { user } = useAuth();
    const serviceCenter = useLoaderData();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { logTracking } = useTrackingLogger();

    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState(null);


    const generateTrackingId = () => {
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TRK-${randomPart}`;
    };

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm();

    //watch
    const parcelType = watch("parcelType");
    const selectedSenderRegion = watch("senderRegion");
    const selectedReceiverRegion = watch("receiverRegion");


    //Extract unique region
    const uniqueRegions = [...new Set(serviceCenter.map(center => center.region))]
    // get districts by region
    const getDistrictsByRegion = region =>
        serviceCenter.filter(w => w.region === region).map(w => w.district)
    // const getDistrictsByRegion = region => {
    //     return serviceCenter.filter(w => w.region === region).map(w => w.district)
    // }




    // 💡 Filtered districts based on current region selections
    const senderDistricts = selectedSenderRegion ? getDistrictsByRegion(selectedSenderRegion) : [];
    const receiverDistricts = selectedReceiverRegion ? getDistrictsByRegion(selectedReceiverRegion) : [];

    const onSubmit = (data) => {
        const weight = parseFloat(data.weight || 0);

        // 🟢 Find if the delivery is within the same district or outside
        const isSameDistrict = data.senderCenter === data.receiverCenter;

        let cost = 0;

        // 🟢 Document pricing
        if (data.parcelType === "document") {
            cost = isSameDistrict ? 60 : 80;

            // 🟢 Non-document pricing
        } else {
            if (weight <= 3) {
                cost = isSameDistrict ? 110 : 150;
            } else {
                // Base cost for >3kg is weight * 40
                cost = weight * 40;

                // Add extra 40 if it's outside district
                if (!isSameDistrict) {
                    cost += 40;
                }
            }
        }

        // ✅ Store cost in state
        setFormData({ ...data, cost });
        setShowConfirm(true);
        toast.success(`Estimated Delivery Cost: ৳${cost}`);
    };

    const handleProceedToPayment = () => {
        const trackingId = generateTrackingId();

        const parcelWithDate = {
            ...formData,
            trackingId,
            email: user?.email,
            payment_status: "unpaid",
            delivery_status: "pending",
            creation_date: new Date().toISOString()
        };

        // TODO: Send to database here
        axiosSecure.post('/parcels', parcelWithDate)
            .then(async (res) => {
                console.log(res.data)
                if (res.data.insertedId) {
                    Swal.fire({
                        icon: "success",
                        title: "Redirecting...",
                        text: 'Proceeding to payment gateway',
                        showConfirmButton: false,
                        timer: 1500
                    });



                    // ✅ Track Parcel Submission
                    logTracking({
                        trackingId,
                        status: 'Parcel Submitted',
                        description: `Parcel submitted by ${user.displayName || 'Unknown'}`,
                    });


                    navigate('/dashBoard/myParcels')
                }
            })
        console.log("Saved to DB:", parcelWithDate);

        toast.success(`Parcel Confirmed! Tracking ID: ${trackingId}`);
        reset();
        setShowConfirm(false);
    };


    return (
        <div className="max-w-4xl mx-auto p-8">
            <Toaster />
            <h2 className="text-3xl font-bold mb-2 text-center">Send a Parcel</h2>
            <p className="text-center text-gray-500 mb-8">
                Fill in the details to send your parcel securely
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* === Parcel Info === */}
                <div className="md:col-span-2">
                    <h3 className="font-bold text-xl mb-2">Parcel Info</h3>
                </div>

                <select {...register("parcelType", { required: true })} className="select select-bordered w-full">
                    <option value="">Select Parcel Type</option>
                    <option value="document">Document</option>
                    <option value="non-document">Non-Document</option>
                </select>
                {errors.parcelType && <p className="text-red-500">Type is required</p>}

                <input
                    {...register("title", { required: true })}
                    placeholder="Parcel Title"
                    className="input input-bordered w-full"
                />
                {errors.title && <p className="text-red-500">Title is required</p>}

                {parcelType === "non-document" && (
                    <input
                        {...register("weight")}
                        type="number"
                        placeholder="Weight (kg)"
                        className="input input-bordered w-full"
                    />
                )}

                {/* === Sender Info === */}
                <div className="md:col-span-2 mt-6">
                    <h3 className="font-bold text-xl mb-2">Sender Info</h3>
                </div>

                <input
                    {...register("senderName", { required: true })}
                    placeholder="Sender Name"
                    className="input input-bordered w-full"
                    defaultValue={user.displayName}
                />
                <input
                    {...register("senderContact", { required: true })}
                    placeholder="Sender Contact"
                    className="input input-bordered w-full"
                />
                {/* 🔵 Sender Region Select */}
                <select {...register("senderRegion", { required: true })} className="select select-bordered w-full">
                    <option value="">Select Region</option>
                    {uniqueRegions.map((region, idx) => (
                        <option key={idx} value={region}>{region}</option>
                    ))}
                </select>
                {errors.senderRegion && <p className="text-red-500">Sender Region is required</p>}


                {/* 🔵 Sender Service Center based on selected Region */}
                <select {...register("senderCenter", { required: true })} className="select select-bordered w-full">
                    <option value="">Select Service Center</option>
                    {senderDistricts.map((district, idx) => (
                        <option key={idx} value={district}>{district}</option>
                    ))}
                </select>
                {errors.senderCenter && <p className="text-red-500">Sender Center is required</p>}


                <input
                    {...register("senderAddress", { required: true })}
                    placeholder="Address"
                    className="input input-bordered w-full"
                />
                <input
                    {...register("pickupInstruction", { required: true })}
                    placeholder="Pickup Instruction"
                    className="input input-bordered w-full"
                />

                {/* === Receiver Info === */}
                <div className="md:col-span-2 mt-6">
                    <h3 className="font-bold text-xl mb-2">Receiver Info</h3>
                </div>

                <input
                    {...register("receiverName", { required: true })}
                    placeholder="Receiver Name"
                    className="input input-bordered w-full"
                />
                <input
                    {...register("receiverContact", { required: true })}
                    placeholder="Receiver Contact"
                    className="input input-bordered w-full"
                />
                {/* 🔵 Receiver Region Select */}
                <select {...register("receiverRegion", { required: true })} className="select select-bordered w-full">
                    <option value="">Select Region</option>
                    {uniqueRegions.map((region, idx) => (
                        <option key={idx} value={region}>{region}</option>
                    ))}
                </select>
                {errors.receiverRegion && <p className="text-red-500">Receiver Region is required</p>}

                {/* 🔵 Receiver Service Center based on selected Region */}
                <select {...register("receiverCenter", { required: true })} className="select select-bordered w-full">
                    <option value="">Select Service Center</option>
                    {receiverDistricts.map((district, idx) => (
                        <option key={idx} value={district}>{district}</option>
                    ))}
                </select>
                {errors.receiverCenter && <p className="text-red-500">Receiver Center is required</p>}

                <input
                    {...register("receiverAddress", { required: true })}
                    placeholder="Delivery Address"
                    className="input input-bordered w-full"
                />
                <input
                    {...register("deliveryInstruction", { required: true })}
                    placeholder="Delivery Instruction"
                    className="input input-bordered w-full"
                />

                <button type="submit" className="btn btn-primary mt-4 md:col-span-2">
                    Submit Parcel
                </button>
            </form>

            {/* === Confirmation Modal === */}
            {showConfirm && (
                <div className="fixed inset-0 backdrop-blur-md w-full h-full flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-center">
                            Confirm Parcel Submission
                        </h3>

                        {/* 💸 Payment Breakdown */}
                        <div className="text-gray-700 space-y-2 text-sm mb-4">
                            <p><span className="font-semibold">Parcel Type:</span> {formData?.parcelType}</p>
                            {formData?.weight && <p><span className="font-semibold">Weight:</span> {formData.weight} kg</p>}
                            <p><span className="font-semibold">From:</span> {formData?.senderCenter}</p>
                            <p><span className="font-semibold">To:</span> {formData?.receiverCenter}</p>
                            <p><span className="font-semibold text-base text-primary">Total Cost:</span> ৳{formData?.cost}</p>
                        </div>

                        {/* 👇 Button Group */}
                        <div className="flex justify-center gap-4">
                            <button className="btn btn-success" onClick={handleProceedToPayment}>
                                Proceed to Payment
                            </button>
                            <button className="btn btn-outline" onClick={() => setShowConfirm(false)}>
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SendParcel;