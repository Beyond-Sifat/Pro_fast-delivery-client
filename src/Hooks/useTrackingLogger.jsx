// ✅ useTrackingLogger.js - Custom Hook to log parcel tracking
import useAxiosSecure from './useAxiosSecure';

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();

  const logTracking = async ({ trackingId, status, description }) => {
    if (!trackingId || !status) {
      console.warn('Missing trackingId or status for tracking log.');
      return;
    }

    try {
      await axiosSecure.post('/tracking', {
        trackingId,
        status,
        description: description || '',
      });
    } catch (error) {
      console.error('Tracking log failed:', error);
    }
  };

  return {logTracking};
};

export default useTrackingLogger;
