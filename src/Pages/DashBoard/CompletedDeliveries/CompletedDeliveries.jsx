import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: parcels = [], isLoading, refetch } = useQuery({
    queryKey: ['completedDeliveries', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/completed-parcels?email=${user.email}`);
      return res.data;
    }
  });

  const calculateEarning = (parcel) => {
    const isSameDistrict = parcel.senderCenter === parcel.receiverCenter;
    const percentage = isSameDistrict ? 0.8 : 0.3;
    return Math.round(parcel.cost * percentage);
  };

  const totalEarnings = parcels.reduce((sum, parcel) => sum + (parcel.cashOutStatus === 'cashed-out' ? 0 : calculateEarning(parcel)), 0);

  const mutation = useMutation({
    mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire('Success!', 'Cashout request sent.', 'success');
      refetch();
    },
    onError: () => {
      Swal.fire('Error!', 'Unable to request cashout.', 'error');
    }
  });

  const handleCashOut = async (parcelId) => {
    const confirm = await Swal.fire({
      title: 'Confirm Cashout',
      text: 'You are about to cash out for this delivery.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed'
    });

    if (confirm.isConfirmed) {
      mutation.mutate(parcelId);
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Completed Deliveries</h2>
      <div className="text-right text-lg font-semibold text-green-600 mb-2">
        Total Earnings: ৳{totalEarnings}
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Receiver</th>
              <th>Region</th>
              <th>District</th>
              <th>Status</th>
              <th>Cost</th>
              <th>Earning</th>
              <th>Picked At</th>
              <th>Delivered At</th>
              <th>Cash Out</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.trackingId}</td>
                <td>{parcel.receiverName}</td>
                <td>{parcel.receiverRegion}</td>
                <td>{parcel.receiverCenter}</td>
                <td>{parcel.delivery_status}</td>
                <td>৳{parcel.cost}</td>
                <td className="font-bold text-green-600">৳{calculateEarning(parcel)}</td>
                <td>{parcel['in-transit_At'] ? new Date(parcel['in-transit_At']).toLocaleString() : '—'}</td>
                <td>{parcel['delivered_At'] ? new Date(parcel['delivered_At']).toLocaleString() : '—'}</td>
                <td>
                  {parcel.cashOutStatus === 'cashed-out' ? (
                    <span className="badge badge-success text-xs px-2 py-1 whitespace-nowrap">Cashed Out</span>
                  ) : (
                    <button className="btn btn-sm btn-primary" onClick={() => handleCashOut(parcel._id)}>Cash Out</button>
                  )}
                </td>
              </tr>
            ))}
            {parcels.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-gray-500">
                  No completed deliveries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedDeliveries;
