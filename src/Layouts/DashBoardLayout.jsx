import React from 'react';
import { NavLink, Outlet } from 'react-router';
import Logo from '../Pages/shared/Logo/Logo';
import { FaBox, FaCheckCircle, FaHistory, FaHome, FaMotorcycle, FaTasks, FaUserCheck, FaUserClock, FaUserEdit, FaUserShield, FaWallet } from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import useUserRole from '../Hooks/useUserRole';

const DashBoardLayout = () => {

    const { role, isLoading } = useUserRole();
    console.log(role)
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">

                {/* Navbar */}
                <div className="navbar bg-base-300 w-full lg:hidden">
                    <div className="flex-none ">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                </div>
                {/* Page content here */}
                <Outlet></Outlet>
                {/* Page content here */}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <Logo></Logo>
                    {/* <li><a>Sidebar Item 1</a></li> */}
                    <li>
                        <NavLink to='/dashBoard' className="flex items-center gap-2">
                            <FaHome /> Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/dashBoard/myParcels' className="flex items-center gap-2">
                            <FaBox /> My Parcels
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to='/dashBoard/paymentHistory' className="flex items-center gap-2">
                            <FaHistory /> Payment History
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to='/dashBoard/track' className="flex items-center gap-2">
                            <HiOutlineLocationMarker /> Track My Parcel
                        </NavLink>
                    </li>

                    {/* Riders Link */}
                    {!isLoading && role === 'rider' &&
                        <>
                            <li>
                                <NavLink to='/dashBoard/pendingDeliveries' className="flex items-center gap-2">
                                    <FaTasks /> Pending Deliveries
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to='/dashBoard/completedDeliveries' className="flex items-center gap-2">
                                    <FaCheckCircle /> Completed Deliveries
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/dashBoard/myEarnings' className="flex items-center gap-2">
                                    <FaWallet /> My Earnings
                                </NavLink>
                            </li>
                        </>
                    }

                    {
                        !isLoading && role === 'admin' &&
                        <>
                            <li>
                                <NavLink to='/dashBoard/activeRiders' className="flex items-center gap-2">
                                    <FaUserCheck /> Active Riders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/dashBoard/assignRider' className="flex items-center gap-2">
                                    <FaMotorcycle /> Assign Riders
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to='/dashBoard/pendingRiders' className="flex items-center gap-2">
                                    <FaUserClock /> Pending Riders
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to='/dashBoard/makeAdmin' className="flex items-center gap-2">
                                    <FaUserShield /> Make Admin
                                </NavLink>
                            </li></>
                    }

                    <li>
                        <NavLink to='/dashBoard/updateProfile' className="flex items-center gap-2">
                            <FaUserEdit /> Update Your Profile
                        </NavLink>
                    </li>

                </ul>
            </div>
        </div>
    );
};
export default DashBoardLayout;