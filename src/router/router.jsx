import {
    createBrowserRouter,
} from "react-router";
import MainLayout from "../Layouts/MainLayout";
import { Children } from "react";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/Send/SendParcel";
import PrivateRoute from "../Routes/PrivateRoute";
import DashBoardLayout from "../Layouts/DashBoardLayout";
import MyParcels from "../Pages/DashBoard/MyParcels";
import Payment from "../Pages/DashBoard/Payment/Payment";
import PaymentHistory from "../Pages/DashBoard/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/DashBoard/TrackParcel/TrackParcel";
import BeARider from "../Pages/BeARider/BeARider";
import PendingRiders from "../Pages/DashBoard/PendingRiders/PendingRiders";
import ActiveRider from "../Pages/DashBoard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../Pages/DashBoard/MakeAdmin/MakeAdmin";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoute from "../Routes/AdminRoute";
import AssignRider from "../Pages/DashBoard/AssignRider/AssignRider";
import RiderRoute from "../Routes/RiderRoute";
import PendingDeliveries from "../Pages/DashBoard/PendingDeliveries/PendingDeliveries";
import CompletedDeliveries from "../Pages/DashBoard/CompletedDeliveries/CompletedDeliveries";
import MyEarnings from "../Pages/DashBoard/MyEarnings/MyEarnings";
import DashBoardHome from "../Pages/DashBoard/DashBoardHome/DashBoardHome";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'forbidden',
                Component: Forbidden,
            },
            {
                path: '/coverage',
                loader: () => fetch('./warehouses.json'),
                Component: Coverage
            },
            {
                path: 'beARider',
                loader: () => fetch('./warehouses.json'),
                element: <PrivateRoute><BeARider></BeARider></PrivateRoute>,
            },
            {
                path: '/sendParcel',
                element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>,
                loader: () => fetch('./warehouses.json'),
            },
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login,
            },
            {
                path: 'register',
                Component: Register,
            },
        ]
    },
    {
        path: 'dashBoard',
        element: <PrivateRoute><DashBoardLayout></DashBoardLayout></PrivateRoute>,
        children: [
            {
                index: true,
                Component: DashBoardHome
            },
            {
                path: 'myParcels',
                Component: MyParcels
            },
            {
                path: 'payment/:parcelId',
                element: <Payment></Payment>

            },
            {
                path: 'paymentHistory',
                element: <PaymentHistory></PaymentHistory>

            },
            {
                path: 'track',
                element: <TrackParcel></TrackParcel>
            },

            //ADMIN ROUTES .........

            {
                path: 'assignRider',
                element: <AdminRoute><AssignRider></AssignRider></AdminRoute>
            },
            {
                path: 'pendingRiders',
                element: <AdminRoute><PendingRiders></PendingRiders></AdminRoute>

            },
            {
                path: 'activeRiders',
                element: <AdminRoute><ActiveRider></ActiveRider></AdminRoute>

            },
            {
                path: 'makeAdmin',
                element: <AdminRoute><MakeAdmin></MakeAdmin></AdminRoute>

            },


            //RIDER ROUTES ......
            {
                path: 'pendingDeliveries',
                element: <RiderRoute><PendingDeliveries></PendingDeliveries></RiderRoute>
            },
            {
                path: 'completedDeliveries',
                element: <RiderRoute><CompletedDeliveries></CompletedDeliveries></RiderRoute>
            },
            {
                path: 'myEarnings',
                element: <RiderRoute><MyEarnings></MyEarnings></RiderRoute>
            },


        ]
    }
]);