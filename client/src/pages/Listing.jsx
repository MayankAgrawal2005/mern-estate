

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import { Contact } from '../components/Contact';
import 'swiper/css/bundle';

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';

export const Listing = () => {
  SwiperCore.use([Navigation]);

  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main className="bg-gray-50 min-h-screen">

      {loading && <p className="text-center mt-10 text-lg sm:text-xl">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-10 text-sm sm:text-base">Something went wrong</p>}

      {listing && !loading && !error && (
        <div>

          {/* 🔥 IMAGE SLIDER */}
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <img
                  src={url}
                  className="h-[40vh] sm:h-[60vh] md:h-[70vh] w-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 🔥 SHARE BUTTON */}
          <div className="fixed bottom-6 right-4 sm:top-24 sm:right-6 z-10">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="bg-white p-2.5 sm:p-3 rounded-full shadow hover:scale-110 transition"
            >
              <FaShare />
            </button>

            {copied && (
              <p className="mt-2 bg-black text-white px-2 py-1 rounded text-xs text-center">
                Link copied!
              </p>
            )}
          </div>

          {/* 🔥 CONTENT */}
          <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-6">

            {/* TITLE */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
              {listing.name}
            </h1>

            {/* PRICE */}
            <p className="text-lg sm:text-xl md:text-2xl text-blue-600 font-semibold mb-4">
              ₹ {listing.offer
                ? listing.discountPrice.toLocaleString()
                : listing.regularPrice.toLocaleString()}
              {listing.type === 'rent' && ' / month'}
            </p>

            {/* LOCATION */}
            <p className="flex items-center gap-2 text-gray-600 mb-4 text-sm sm:text-base">
              <FaMapMarkerAlt className="text-green-600" />
              {listing.address}
            </p>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs sm:text-sm">
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>

              {listing.offer && (
                <span className="bg-green-600 text-white px-2.5 py-1 rounded-full text-xs sm:text-sm">
                  ₹ {listing.regularPrice - listing.discountPrice} OFF
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow mb-6">
              <h2 className="font-semibold mb-2 text-sm sm:text-base">Description</h2>
              <p className="text-gray-700 text-sm sm:text-base">{listing.description}</p>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">

              <div className="bg-white p-3 sm:p-4 rounded-xl shadow text-center text-sm">
                <FaBed className="mx-auto mb-2 text-blue-600" />
                {listing.bedrooms} Beds
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-xl shadow text-center text-sm">
                <FaBath className="mx-auto mb-2 text-blue-600" />
                {listing.bathrooms} Baths
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-xl shadow text-center text-sm">
                <FaParking className="mx-auto mb-2 text-blue-600" />
                {listing.parking ? 'Parking' : 'No Parking'}
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-xl shadow text-center text-sm">
                <FaChair className="mx-auto mb-2 text-blue-600" />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </div>

            </div>

            {/* CONTACT */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="w-full sm:w-auto bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Contact Owner
              </button>
            )}

            {contact && <Contact listing={listing} />}

          </div>
        </div>
      )}
    </main>
  );
};