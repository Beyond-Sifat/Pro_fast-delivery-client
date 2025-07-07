// import { useState } from 'react';
// import useAxiosSecure from './useAxiosSecure';

// const useTrackUpdate = () => {
//     const axiosSecure = useAxiosSecure();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);

//     const submitTrackingUpdate = async ({ trackingId, parcelId, status, location, message, updated_by = '' }) => {
//         setLoading(true);
//         setError(null);
//         setSuccess(false);

//         try {
//             const res = await axiosSecure.post('/tracking', {
//                 trackingId,
//                 parcelId,
//                 status,
//                 location,
//                 message,
//                 updated_by
//             });

//             if (res.data.insertedId) {
//                 setSuccess(true);
//             } else {
//                 setError("Failed to add tracking update.");
//             }
//         } catch (err) {
//             console.error("Tracking update error:", err);
//             setError(err.message || "Something went wrong.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         submitTrackingUpdate,
//         loading,
//         error,
//         success,
//     };
// };

// export default useTrackUpdate;