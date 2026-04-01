

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';
import { OAuth } from '../components/OAuth';

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message || 'Sign in failed'));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  useEffect(() => {
    dispatch(signInFailure(null)); // clear error on load
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl w-full">

        {/* 🔥 LEFT IMAGE */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
            alt="signin"
            className="h-full w-full object-cover"
          />
        </div>

        {/* 🔥 RIGHT FORM */}
        <div className="p-8 w-full md:w-1/2">

          <h1 className="text-3xl font-bold text-center mb-6">
            Welcome Back 👋
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              disabled={loading}
              className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <OAuth />

          </form>

          {/* SIGNUP LINK */}
          <div className="flex gap-2 mt-6 justify-center text-sm">
            <p>Don’t have an account?</p>
            <Link to="/sign-up" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 mt-4 text-center">
              {error}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}