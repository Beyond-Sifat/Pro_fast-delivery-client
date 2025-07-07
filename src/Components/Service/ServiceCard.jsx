// src/components/ServiceCard.jsx
import React from 'react';

const ServiceCard = ({ icon: Icon, title, description }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl hover:bg-[#CAEB66] transition duration-300">
            <div className="text-4xl text-primary mb-4 flex justify-center">
                <Icon>{Icon}</Icon>
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
};

export default ServiceCard;
