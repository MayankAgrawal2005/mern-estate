


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OAuth } from '../components/OAuth';

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      navigate('/sign-in');

    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4">

      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl w-full">

        {/* 🔥 LEFT IMAGE */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            alt="signup"
            className="h-full w-full object-cover"
          />
        </div>

        {/* 🔥 RIGHT FORM */}
        <div className="p-5 sm:p-6 md:p-8 w-full md:w-1/2">

          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-5 sm:mb-6">
            Create Account 🚀
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">

            <input
              type="text"
              id="username"
              placeholder="Username"
              onChange={handleChange}
              className="border p-2.5 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
            />

            <input
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              className="border p-2.5 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
            />

            <input
              type="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              className="border p-2.5 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
            />

            <button
              disabled={loading}
              className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            {/* OAuth */}
            <OAuth />

          </form>

          {/* SIGN IN LINK */}
          <div className="flex gap-2 mt-5 sm:mt-6 justify-center text-xs sm:text-sm">
            <p>Already have an account?</p>
            <Link to="/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 mt-3 sm:mt-4 text-center text-sm">
              {error}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}