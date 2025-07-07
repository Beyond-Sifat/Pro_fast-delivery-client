import React from 'react';

const features = [
  {
    title: 'Live Parcel Tracking',
    description:
      'Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment\'s journey and get instant status updates for complete peace of mind.',
  },
  {
    title: '100% Safe Delivery',
    description:
      'We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.',
  },
  {
    title: '24/7 Call Center Support',
    description:
      'Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.',
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gray-50 px-4 md:px-12 lg:px-20">
      <div className="flex flex-col lg:flex-row items-end gap-10">
        {/* Image Left Side */}
        <div className="lg:w-1/2">
          <img
            src="../../../src/assets/authImage.png" // 👈 Replace with your own image path
            alt="Feature Highlight"
            className="w-full rounded-2xl shadow-md"
          />
        </div>

        {/* Text & Cards Right Side */}
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Why Choose Us?
          </h2>
          <p className="text-gray-600">
            We provide top-tier services designed to make your delivery experience fast, safe, and supported at every step.
          </p>

          {/* 3 Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border-l-4 border-primary"
              >
                <h3 className="text-xl font-semibold mb-1 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;