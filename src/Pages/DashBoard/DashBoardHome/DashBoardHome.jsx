import React from 'react';
import useUserRole from '../../../Hooks/useUserRole';
import Loading from '../../../Components/Loading';
import UserDashBoard from './UserDashBoard';
import RiderDashBoard from './RiderDashBoard';
import AdminDashBoard from './AdminDashBoard';
import Forbidden from '../../Forbidden/Forbidden';

const DashBoardHome = () => {
    const { role, isLoading } = useUserRole();

    if (isLoading) return <Loading message="Fetching your parcels..." />;

    if (role === 'user') {
        return <UserDashBoard></UserDashBoard>
    }
    else if (role === 'rider') {
        return <RiderDashBoard></RiderDashBoard>
    }
    else if (role === 'admin') {
        return <AdminDashBoard></AdminDashBoard>
    }
    else {
        return <Forbidden></Forbidden>
    }
};

export default DashBoardHome;