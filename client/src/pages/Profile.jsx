
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileref = useRef(null);

  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(updateUserFailure(null));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'mayank');
    form.append('cloud_name', 'diqum6tfd');

    const res = await fetch('https://api.cloudinary.com/v1_1/diqum6tfd/image/upload', {
      method: 'POST',
      body: form,
    });

    const data = await res.json();
    if (data.secure_url) {
      setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
      setAvatarPreview(data.secure_url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch {
      setShowListingsError(true);
    }
  };

  // const handleListingDelete = async (id) => {
  //   const res = await fetch(`/api/listing/delete/${id}`, {
  //     method: 'DELETE',
  //   });
  //   const data = await res.json();

  //   if (!data.success) return;
    
  //   alert('Listing deleted successfully');
  //   setUserListings((prev) => prev.filter((item) => item._id !== id));
  // };

  const handleListingDelete = async (id) => {
  try {
    setDeletingId(id); // 🔥 start loading

    const res = await fetch(`/api/listing/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data);
      setDeletingId(null);
      return;
    }

    setUserListings((prev) => prev.filter((item) => item._id !== id));

  } catch (err) {
    console.log(err);
  } finally {
    setDeletingId(null); // 🔥 stop loading
  }
};

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-10 px-4 sm:px-4">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6">

        {/* 🔥 PROFILE HEADER */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
          <img
            onClick={() => fileref.current.click()}
            src={avatarPreview}
            alt="profile"
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-blue-500 cursor-pointer hover:scale-105 transition"
          />
          <input type="file" ref={fileref} hidden accept="image/*" onChange={handleImageChange} />
          <h2 className="text-lg sm:text-xl font-semibold text-center">
            {currentUser.username}
          </h2>
        </div>

        {/* 🔥 FORM */}
        <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4">

          <input
            type="text"
            id="username"
            defaultValue={currentUser.username}
            onChange={handleChange}
            className="border p-2.5 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Username"
          />

          <input
            type="email"
            id="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
            className="border p-2.5 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Email"
          />

          <input
            type="password"
            id="password"
            onChange={handleChange}
            className="border p-2.5 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Password"
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>

          <Link
            to="/create-listing"
            className="bg-green-600 text-white p-2.5 sm:p-3 rounded-lg text-center hover:bg-green-700 transition text-sm sm:text-base"
          >
            + Create Listing
          </Link>

        </form>

        {/* 🔥 ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-5 sm:mt-6 text-sm">
          <span onClick={handleDelete} className="text-red-600 cursor-pointer hover:underline">
            Delete Account
          </span>
          <span onClick={handleSignout} className="text-red-600 cursor-pointer hover:underline">
            Sign Out
          </span>
        </div>

        {/* 🔥 MESSAGES */}
        {error && <p className="text-red-500 mt-3 sm:mt-4 text-sm">{error}</p>}
        {updateSuccess && <p className="text-green-500 mt-3 sm:mt-4 text-sm">Updated successfully!</p>}

        {/* 🔥 LISTINGS */}
        <button
          onClick={handleShowListings}
          className="mt-5 sm:mt-6 w-full text-blue-600 font-semibold text-sm sm:text-base"
        >
          Show My Listings
        </button>

        {showListingsError && (
          <p className="text-red-500 mt-2 text-sm">Error loading listings</p>
        )}

        {userListings.length > 0 && (
          <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4">
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border rounded-xl hover:shadow-md transition"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls?.[0]}
                    alt="listing"
                    className="h-20 w-full sm:h-16 sm:w-16 object-cover rounded-lg"
                  />
                </Link>

                <Link
                  to={`/listing/${listing._id}`}
                  className="flex-1 text-center sm:text-left px-2 sm:px-3 font-medium truncate hover:underline"
                >
                  {listing.name}
                </Link>

                <div className="flex flex-row sm:flex-col gap-3 sm:gap-1">
                  {/* <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button> */}
                  <button
  onClick={() => handleListingDelete(listing._id)}
  disabled={deletingId === listing._id}
  className={`text-sm ${
    deletingId === listing._id
      ? 'text-gray-400 cursor-not-allowed'
      : 'text-red-500 hover:underline'
  }`}
>
  {deletingId === listing._id ? 'Deleting...' : 'Delete'}
</button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-600 text-sm">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}