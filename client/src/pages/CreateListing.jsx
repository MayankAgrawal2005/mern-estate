import { useState } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const navigate = useNavigate();

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      try {
        const urls = await Promise.all(promises);
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setUploading(false);
      } catch (err) {
        setImageUploadError('Image upload failed');
        setUploading(false);
      }
    } else {
      setImageUploadError('Max 6 images allowed');
    }
  };

  const storeImage = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append('file', file);
    formDataImg.append('upload_preset', 'mayank');
    formDataImg.append('cloud_name', 'diqum6tfd');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/diqum6tfd/image/upload',
      {
        method: 'POST',
        body: formDataImg,
      }
    );

    const data = await res.json();
    if (!data.secure_url) throw new Error('Upload failed');
    return data.secure_url;
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (['sale', 'rent'].includes(e.target.id)) {
      setFormData({ ...formData, type: e.target.id });
    }

    if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (['number', 'text', 'textarea'].includes(e.target.type)) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1)
      return setError('Upload at least one image');

    if (+formData.regularPrice < +formData.discountPrice)
      return setError('Discount must be lower than regular price');

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
   
<main className="min-h-screen bg-gray-50 py-6 sm:py-10 px-3 sm:px-4">

  <div className="max-w-5xl w-full mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-lg">

    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
      Create Listing
    </h1>

    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

      {/* LEFT */}
      <div className="flex flex-col gap-3 sm:gap-4">

        <input
          type="text"
          id="name"
          placeholder="Property Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2.5 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        />

        <textarea
          id="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2.5 sm:p-3 rounded-lg text-sm sm:text-base"
        />

        <input
          type="text"
          id="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2.5 sm:p-3 rounded-lg text-sm sm:text-base"
        />

        {/* TYPE */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {['rent', 'sale'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-sm ${
                formData.type === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white'
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* FEATURES */}
        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
          {['parking', 'furnished', 'offer'].map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={item}
                checked={formData[item]}
                onChange={handleChange}
              />
              {item}
            </label>
          ))}
        </div>

        {/* NUMBERS */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">

          <div className="bg-gray-100 p-3 sm:p-4 rounded-xl flex flex-col items-center">
            <span className="text-xs sm:text-sm text-gray-500">🛏 Bedrooms</span>
            <input type="number" id="bedrooms" value={formData.bedrooms}
              onChange={handleChange}
              className="text-base sm:text-lg font-semibold text-center bg-transparent outline-none"/>
          </div>

          <div className="bg-gray-100 p-3 sm:p-4 rounded-xl flex flex-col items-center">
            <span className="text-xs sm:text-sm text-gray-500">🛁 Bathrooms</span>
            <input type="number" id="bathrooms" value={formData.bathrooms}
              onChange={handleChange}
              className="text-base sm:text-lg font-semibold text-center bg-transparent outline-none"/>
          </div>

          <div className="bg-gray-100 p-3 sm:p-4 rounded-xl flex flex-col items-center">
            <span className="text-xs sm:text-sm text-gray-500">💰 Price</span>
            <input type="number" id="regularPrice" value={formData.regularPrice}
              onChange={handleChange}
              className="text-base sm:text-lg font-semibold text-center bg-transparent outline-none"/>
          </div>

          {formData.offer && (
            <div className="bg-green-100 p-3 sm:p-4 rounded-xl flex flex-col items-center">
              <span className="text-xs sm:text-sm text-green-700">🔥 Discount</span>
              <input type="number" id="discountPrice" value={formData.discountPrice}
                onChange={handleChange}
                className="text-base sm:text-lg font-semibold text-center bg-transparent outline-none"/>
            </div>
          )}

        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-3 sm:gap-4">

        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="border p-2.5 sm:p-3 rounded-lg text-sm"
        />

        <button type="button" onClick={handleImageSubmit}
          className="bg-green-600 text-white p-2.5 sm:p-3 rounded-lg text-sm sm:text-base">
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>

        {imageUploadError && (
          <p className="text-red-500 text-sm">{imageUploadError}</p>
        )}

        {formData.imageUrls.map((url, index) => (
          <div key={index} className="flex items-center gap-3 sm:gap-4 bg-gray-100 p-2 rounded-lg">
            <img src={url} className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded" />
            <button onClick={() => handleRemoveImage(index)}
              className="text-red-500 text-sm">
              Delete
            </button>
          </div>
        ))}

        <button disabled={loading || uploading}
          className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-lg font-semibold text-sm sm:text-base">
          {loading ? 'Creating...' : 'Create Listing'}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

    </form>
  </div>
</main>

  );
};