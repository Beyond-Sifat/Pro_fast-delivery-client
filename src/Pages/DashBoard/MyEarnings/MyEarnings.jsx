import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { isSameDay, isSameWeek, isSameMonth, isSameYear } from 'date-fns';

const MyEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ['riderCompletedDeliveries', user?.email],
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

  const today = new Date();

  const earnings = {
    total: 0,
    cashedOut: 0,
    pending: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0
  };

  parcels.forEach((parcel) => {
    const earning = calculateEarning(parcel);
    const deliveredAt = new Date(parcel.delivered_At);

    earnings.total += earning;

    if (parcel.cashOutStatus === 'cashed-out') {
      earnings.cashedOut += earning;
    } else {
      earnings.pending += earning;
    }

    if (isSameDay(deliveredAt, today)) earnings.today += earning;
    if (isSameWeek(deliveredAt, today)) earnings.thisWeek += earning;
    if (isSameMonth(deliveredAt, today)) earnings.thisMonth += earning;
    if (isSameYear(deliveredAt, today)) earnings.thisYear += earning;
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Earnings Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-semibold">Total Earnings</h3>
          <p className="text-2xl text-green-600">৳{earnings.total}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-semibold">Cashed Out</h3>
          <p className="text-2xl text-blue-600">৳{earnings.cashedOut}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-semibold">Pending</h3>
          <p className="text-2xl text-orange-500">৳{earnings.pending}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8">Earnings Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <h4 className="text-md font-semibold">Today</h4>
          <p className="text-lg text-green-600">৳{earnings.today}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h4 className="text-md font-semibold">This Week</h4>
          <p className="text-lg text-green-600">৳{earnings.thisWeek}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h4 className="text-md font-semibold">This Month</h4>
          <p className="text-lg text-green-600">৳{earnings.thisMonth}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h4 className="text-md font-semibold">This Year</h4>
          <p className="text-lg text-green-600">৳{earnings.thisYear}</p>
        </div>
      </div>
    </div>
  );
};

export default MyEarnings;
