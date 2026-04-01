import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-50">

      {/* 🔥 HERO SECTION */}
      <div className="relative h-[50vh] flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt="about"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <h1 className="relative text-white text-4xl md:text-5xl font-bold">
          About Us
        </h1>
      </div>

      {/* 🔥 CONTENT */}
      <div className="py-16 px-4 max-w-6xl mx-auto">

        {/* INTRO */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Mayank Estate
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in finding the perfect home. We help you buy,
            sell, and rent properties with ease and confidence.
          </p>
        </div>

        {/* 🔥 GRID SECTION */}
        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              🏡 Our Mission
            </h3>
            <p className="text-gray-600">
              We aim to simplify real estate by providing expert guidance and
              seamless experiences for buyers and sellers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              📍 Our Expertise
            </h3>
            <p className="text-gray-600">
              With deep knowledge of the market, we help clients find the best
              locations and properties that suit their needs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              🤝 Our Promise
            </h3>
            <p className="text-gray-600">
              We are committed to delivering exceptional service and making your
              real estate journey smooth and rewarding.
            </p>
          </div>

        </div>

        {/* 🔥 EXTRA SECTION */}
        <div className="mt-16 grid md:grid-cols-2 gap-10 items-center">

          {/* Image */}
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
            alt="team"
            className="rounded-xl shadow-lg"
          />

          {/* Text */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 mb-4">
              Our experienced team ensures that every client gets personalized
              attention and the best possible deals in the market.
            </p>
            <p className="text-gray-600">
              Whether you're searching for your dream home or selling your
              property, we are here to guide you every step of the way.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}