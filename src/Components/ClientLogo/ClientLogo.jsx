import React from 'react';
import Marquee from 'react-fast-marquee';



const clientLogos = [
  '../../../src/assets/brands/amazon.png',
  '../../../src/assets/brands/amazon_vector.png',
  '../../../src/assets/brands/casio.png',
  '../../../src/assets/brands/moonstar.png',
  '../../../src/assets/brands/randstad.png',
  '../../../src/assets/brands/start-people 1.png',
  '../../../src/assets/brands/start.png',
];

const ClientLogo = () => {
    return (
        <section className="py-16">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-10 text-primary">Trusted by Leading Clients</h2>
      <Marquee gradient={false} speed={50} pauseOnHover={true}>
        {clientLogos.map((logo, index) => (
          <div key={index} className="mx-8">
            <img
              src={logo}
              alt={`Client Logo ${index + 1}`}
              className="h-7 w-auto object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
    );
};

export default ClientLogo;