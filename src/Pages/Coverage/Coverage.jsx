import React from 'react';
import BangladeshMap from './BangladeshMap';
import { useLoaderData } from 'react-router';

const Coverage = () => {
    const serviceCenter = useLoaderData();
    return (
        <div className='py-16'>
            <h1 className='text-3xl font-extrabold text-[#03373D]'>We are available in 64 districts</h1>
            <div className="h-[500px] w-full">
                <BangladeshMap serviceCenter={serviceCenter}></BangladeshMap>
            </div>
        </div>
    );
};

export default Coverage;