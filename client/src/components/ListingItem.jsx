
import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';

export const ListingItem = ({ listing }) => {
  return (
    <Link to={`/listing/${listing._id}`}>

      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group">

        {/* 🔥 IMAGE */}
        <div className="relative overflow-hidden">

          <img
            src={listing.imageUrls?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'}
            alt="listing"
            className="h-[250px] w-full object-cover group-hover:scale-110 transition duration-500"
          />

          {/* 🔥 OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* 🔥 PRICE BADGE */}
          <div className="absolute bottom-3 left-3 text-white font-semibold text-lg">
            ₹ {listing.offer
              ? listing.discountPrice.toLocaleString()
              : listing.regularPrice.toLocaleString()}
            {listing.type === 'rent' && ' / mo'}
          </div>

          {/* 🔥 OFFER BADGE */}
          {listing.offer && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs rounded-lg shadow">
              OFFER
            </div>
          )}

        </div>

        {/* 🔥 CONTENT */}
        <div className="p-4 flex flex-col gap-2">

          {/* TITLE */}
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {listing.name}
          </h3>

          {/* LOCATION */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MdLocationOn className="text-green-600" />
            <span className="truncate">{listing.address}</span>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>

          {/* FEATURES */}
          <div className="flex justify-between mt-2 text-sm font-medium text-gray-700">

            <div className="flex items-center gap-1">
              <FaBed />
              {listing.bedrooms}
            </div>

            <div className="flex items-center gap-1">
              <FaBath />
              {listing.bathrooms}
            </div>

          </div>

        </div>

      </div>

    </Link>
  );
};