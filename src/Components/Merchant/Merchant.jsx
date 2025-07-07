import React from 'react';

const Merchant = () => {
    return (
        <section  data-aos="zoom-in" className='py-16 px-4 md:px-12 lg:px-20 bg-[#03373D] rounded-4xl'>
            <div className='flex justify-center -mt-16'>
                <img
                    className='max-w-full h-auto'
                    src="../../../src/assets/be-a-merchant-bg.png"
                    alt="Merchant Banner" />
            </div>
            <div className='flex flex-col-reverse lg:flex-row items-center gap-10'>
                <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                    <h1 className='text-white font-extrabold text-4xl'>Merchant and Customer Satisfaction is Our First Priority</h1>
                    <p className='text-gray-400 text-sm md:text-base'>We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.</p>
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <button className='p-4 rounded-4xl border-[#CAEB66] border text-[#CAEB66] hover:bg-[#CAEB66] mr-5 hover:text-black  transition'>Become a Merchant</button>
                        <button className='p-4 rounded-4xl border-[#CAEB66] border text-[#CAEB66] hover:bg-[#CAEB66] hover:text-black transition'>Earn with Profast Courier</button>
                    </div>
                </div>
                <div>
                <img
                className='w-full h-auto'
                src="../../../src/assets/location-merchant.png"/>

                </div>
            </div>

        </section>
    );
};

export default Merchant;