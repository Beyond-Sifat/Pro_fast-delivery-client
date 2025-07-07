import React from 'react';
import useAuth from '../Hooks/useAuth';
import useUserRole from '../Hooks/useUserRole';
import { Navigate } from 'react-router';

const RiderRoute = ({ children }) => {
    const { user, loading } = useAuth()
    const { role, isLoading } = useUserRole()

    if (loading || isLoading) {
        return <span className="loading loading-spinner loading-xl"></span>
    }
    if (!user || role !== 'rider') {
        return <Navigate to='/forbidden'></Navigate>
    }
    return children
};

export default RiderRoute;