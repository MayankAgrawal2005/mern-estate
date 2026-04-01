


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SwiperSlide, Swiper } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import { ListingItem } from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div className="bg-gray-50">

      {/* 🔥 HERO SECTION */}
      <div className="relative h-[70vh] sm:h-[80vh] md:h-[90vh] w-full">

        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt="hero"
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">

          <h1 className="text-white text-2xl sm:text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
            Find Your Dream Home
          </h1>

          <p className="text-gray-200 mt-3 sm:mt-4 text-sm sm:text-lg md:text-xl max-w-xl">
            Discover the best properties for rent & sale in your city
          </p>

          <Link
            to="/search"
            className="mt-5 sm:mt-6 bg-blue-600 hover:bg-blue-700 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-semibold shadow-lg transition text-sm sm:text-base"
          >
            Explore Now 🚀
          </Link>

        </div>
      </div>

      {/* 🔥 SWIPER */}
      {offerListings && offerListings.length > 0 && (
        <div className="max-w-6xl mx-auto mt-8 sm:mt-10 px-3 sm:px-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            🔥 Featured Offers
          </h2>

          <Swiper navigation>
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <img
                  src={listing.imageUrls?.[0]}
                  alt="listing"
                  className="h-[220px] sm:h-[300px] md:h-[400px] w-full object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* 🔥 LISTINGS */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 flex flex-col gap-8 sm:gap-10 my-8 sm:my-10">

        {/* OFFERS */}
        {offerListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
                Recent Offers
              </h2>
              <Link
                to="/search?offer=true"
                className="text-blue-600 hover:underline text-sm sm:text-base"
              >
                Show more →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* RENT */}
        {rentListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
                Places for Rent
              </h2>
              <Link
                to="/search?type=rent"
                className="text-blue-600 hover:underline text-sm sm:text-base"
              >
                Show more →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* SALE */}
        {saleListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
                Places for Sale
              </h2>
              <Link
                to="/search?type=sale"
                className="text-blue-600 hover:underline text-sm sm:text-base"
              >
                Show more →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}