import React from 'react';
import { Outlet } from 'react-router';
import authImg from '../../src/assets/authImage.png'
import Logo from '../Pages/shared/Logo/Logo';

const AuthLayout = () => {
    return (
        <div className="p-12 bg-base-200">
            <Logo></Logo>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className='flex-1 bg-[#FAFDF0]'>
                    <img
                        src={authImg}
                        className="max-w-full rounded-lg"
                    />
                </div>
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;