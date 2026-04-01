
import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    if (searchTerm) {
      urlParams.set('searchTerm', searchTerm);
    }

    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b shadow-sm">
      
      <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto p-3 sm:p-4 gap-3">

        {/* 🔥 LOGO */}
        <Link to="/">
          <h1 className="font-bold text-lg sm:text-xl flex items-center gap-1 whitespace-nowrap">
            <span className="text-blue-600">Mayank</span>
            <span className="text-gray-800">Estate</span>
          </h1>
        </Link>

        {/* 🔥 SEARCH BAR (Responsive) */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-gray-100 rounded-full px-3 py-2 shadow-inner w-full sm:w-[40%]"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent flex-1 focus:outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-gray-600 hover:text-blue-600 transition" />
          </button>
        </form>

        {/* 🔥 RIGHT SIDE */}
        <ul className="flex items-center gap-4 sm:gap-6 text-sm font-medium">

          <Link to="/">
            <li className="hidden sm:inline text-gray-700 hover:text-blue-600 transition">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline text-gray-700 hover:text-blue-600 transition">
              About
            </li>
          </Link>

          {/* 🔥 PROFILE */}
          <Link to="/profile">
            {currentUser ? (
              <img
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border-2 border-blue-500 hover:scale-105 transition"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-blue-700 transition text-xs sm:text-sm">
                Sign In
              </li>
            )}
          </Link>

        </ul>
      </div>
    </header>
  );
}