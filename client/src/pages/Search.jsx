
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ListingItem } from '../components/ListingItem';

export const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const handleChange = (e) => {
    if (['all', 'rent', 'sale'].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === 'sort_order') {
      const [sort, order] = e.target.value.split('_');
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();

    if (sidebardata.searchTerm) urlParams.set('searchTerm', sidebardata.searchTerm);
    if (sidebardata.type !== 'all') urlParams.set('type', sidebardata.type);
    if (sidebardata.parking) urlParams.set('parking', true);
    if (sidebardata.furnished) urlParams.set('furnished', true);
    if (sidebardata.offer) urlParams.set('offer', true);

    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);

    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const fetchListings = async () => {
      setLoading(true);
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();

      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const onShowMoreClick = async () => {
    const startIndex = listings.length;

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);

    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();

    if (data.length < 9) setShowMore(false);

    setListings((prev) => [...prev, ...data]);
  };

  return (
    
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">

  {/* 🔥 FILTER PANEL */}
  <div className="w-full md:w-80 bg-white p-4 sm:p-6 shadow-lg">

    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">

      {/* SEARCH */}
      <input
        type="text"
        id="searchTerm"
        value={sidebardata.searchTerm}
        onChange={handleChange}
        placeholder="🔍 Search properties..."
        className="border p-2.5 sm:p-3 rounded-lg text-sm sm:text-base"
      />

      {/* TYPE */}
      <div className="flex flex-wrap gap-2">
        {['all', 'rent', 'sale'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSidebardata({ ...sidebardata, type })}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-sm ${
              sidebardata.type === type
                ? 'bg-blue-600 text-white'
                : ''
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* AMENITIES */}
      <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
        {['parking', 'furnished', 'offer'].map((item) => (
          <label key={item} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={item}
              checked={sidebardata[item]}
              onChange={handleChange}
            />
            {item}
          </label>
        ))}
      </div>

      {/* SORT */}
      <select
        id="sort_order"
        onChange={handleChange}
        className="border p-2.5 sm:p-3 rounded-lg text-sm sm:text-base"
      >
        <option value="regularPrice_desc">Price high → low</option>
        <option value="regularPrice_asc">Price low → high</option>
        <option value="createdAt_desc">Latest</option>
        <option value="createdAt_asc">Oldest</option>
      </select>

      <button className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-lg font-semibold text-sm sm:text-base">
        Apply Filters
      </button>

    </form>
  </div>

  {/* 🔥 RESULTS */}
  <div className="flex-1 p-4 sm:p-6">

    <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
      Listing Results
    </h1>

    {loading && <p className="text-center text-sm sm:text-base">Loading...</p>}

    {!loading && listings.length === 0 && (
      <p className="text-center text-gray-500 text-sm sm:text-base">
        No listings found 😔
      </p>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {!loading &&
        listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
    </div>

    {showMore && (
      <div className="flex justify-center mt-6">
        <button
          onClick={onShowMoreClick}
          className="bg-gray-800 text-white px-5 sm:px-6 py-2 rounded-lg text-sm sm:text-base"
        >
          Show More
        </button>
      </div>
    )}
  </div>
</div>
  );
};