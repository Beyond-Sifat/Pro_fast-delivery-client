import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useUserRole = () => {
  const { user } = useAuth(); // Your auth context with user.email
  const axiosSecure = useAxiosSecure();

  const { data, isPending, isError } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role; // returns 'admin' or 'user'
    }
  });

  return {
    role: data || 'user',  // default to 'user' if undefined
    isLoading: isPending,
    isError
  };
};
export default useUserRole;
