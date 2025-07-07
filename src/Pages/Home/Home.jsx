import React from 'react';
import Banner from '../../Components/Bannre/Banner';
import ServiceSection from '../../Components/Service/ServiceSection';
import ClientLogo from '../../Components/ClientLogo/ClientLogo';
import Features from '../../Components/Service/Features';
import Merchant from '../../Components/Merchant/Merchant';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <ServiceSection></ServiceSection>
            <ClientLogo></ClientLogo>
            <Features></Features>
            <Merchant></Merchant>
        </div>
    );
};

export default Home;