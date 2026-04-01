
import { useState, useEffect } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export const UpdateListing = () => {
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
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`/api/listing/get/${params.listingId}`);
      const data = await res.json();
      setFormData(data);
    };
    fetchListing();
  }, []);

  const storeImage = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append('file', file);
    formDataImg.append('upload_preset', 'mayank');
    formDataImg.append('cloud_name', 'diqum6tfd');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/diqum6tfd/image/upload',
      { method: 'POST', body: formDataImg }
    );

    const data = await res.json();
    if (!data.secure_url) throw new Error('Upload failed');
    return data.secure_url;
  };

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);

      try {
        const urls = await Promise.all(
          [...files].map((file) => storeImage(file))
        );
        setFormData({
          ...formData,
          imageUrls: [...formData.imageUrls, ...urls],
        });
        setUploading(false);
      } catch {
        setImageUploadError('Upload failed');
        setUploading(false);
      }
    } else {
      setImageUploadError('Max 6 images allowed');
    }
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
      return setError('Discount must be lower than price');

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/listing/update/${params.listingId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        }
      );

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
    // <main className="min-h-screen bg-gray-50 py-10 px-4">

    //   <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg">

    //     <h1 className="text-3xl font-bold text-center mb-8">
    //       Update Listing
    //     </h1>

    //     <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

    //       {/* LEFT */}
    //       <div className="flex flex-col gap-4">

    //         <input
    //           type="text"
    //           id="name"
    //           value={formData.name}
    //           onChange={handleChange}
    //           placeholder="Property Name"
    //           className="border p-3 rounded-lg"
    //         />

    //         <textarea
    //           id="description"
    //           value={formData.description}
    //           onChange={handleChange}
    //           placeholder="Description"
    //           className="border p-3 rounded-lg"
    //         />

    //         <input
    //           type="text"
    //           id="address"
    //           value={formData.address}
    //           onChange={handleChange}
    //           placeholder="Address"
    //           className="border p-3 rounded-lg"
    //         />

    //         {/* TYPE */}
    //         <div className="flex gap-4">
    //           {['rent', 'sale'].map((type) => (
    //             <button
    //               key={type}
    //               type="button"
    //               onClick={() => setFormData({ ...formData, type })}
    //               className={`px-4 py-2 rounded-full ${
    //                 formData.type === type
    //                   ? 'bg-blue-600 text-white'
    //                   : 'border'
    //               }`}
    //             >
    //               {type.toUpperCase()}
    //             </button>
    //           ))}
    //         </div>

    //         {/* FEATURES */}
    //         <div className="flex gap-4 flex-wrap">
    //           {['parking', 'furnished', 'offer'].map((item) => (
    //             <label key={item} className="flex gap-2 items-center">
    //               <input
    //                 type="checkbox"
    //                 id={item}
    //                 checked={formData[item]}
    //                 onChange={handleChange}
    //               />
    //               {item}
    //             </label>
    //           ))}
    //         </div>

    //         {/* 🔥 MODERN NUMBER UI */}
    //         <div className="grid grid-cols-2 gap-4">

    //           <div className="bg-gray-100 p-4 rounded-xl text-center">
    //             🛏 Bedrooms
    //             <input type="number" id="bedrooms"
    //               value={formData.bedrooms}
    //               onChange={handleChange}
    //               className="block mx-auto text-lg font-bold bg-transparent outline-none"/>
    //           </div>

    //           <div className="bg-gray-100 p-4 rounded-xl text-center">
    //             🛁 Bathrooms
    //             <input type="number" id="bathrooms"
    //               value={formData.bathrooms}
    //               onChange={handleChange}
    //               className="block mx-auto text-lg font-bold bg-transparent outline-none"/>
    //           </div>

    //           <div className="bg-gray-100 p-4 rounded-xl text-center">
    //             💰 Price
    //             <input type="number" id="regularPrice"
    //               value={formData.regularPrice}
    //               onChange={handleChange}
    //               className="block mx-auto text-lg font-bold bg-transparent outline-none"/>
    //           </div>

    //           {formData.offer && (
    //             <div className="bg-green-100 p-4 rounded-xl text-center">
    //               🔥 Discount
    //               <input type="number" id="discountPrice"
    //                 value={formData.discountPrice}
    //                 onChange={handleChange}
    //                 className="block mx-auto text-lg font-bold bg-transparent outline-none"/>
    //             </div>
    //           )}

    //         </div>
    //       </div>

    //       {/* RIGHT */}
    //       <div className="flex flex-col gap-4">

    //         <input type="file" multiple
    //           onChange={(e) => setFiles(e.target.files)}
    //           className="border p-3 rounded-lg"/>

    //         <button type="button"
    //           onClick={handleImageSubmit}
    //           className="bg-green-600 text-white p-3 rounded-lg">
    //           {uploading ? 'Uploading...' : 'Upload Images'}
    //         </button>

    //         {formData.imageUrls.map((url, index) => (
    //           <div key={index} className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
    //             <img src={url} className="h-16 w-16 rounded object-cover"/>
    //             <button onClick={() => handleRemoveImage(index)}
    //               className="text-red-500">
    //               Delete
    //             </button>
    //           </div>
    //         ))}

    //         <button
    //           disabled={loading || uploading}
    //           className="bg-blue-600 text-white p-3 rounded-lg">
    //           {loading ? 'Updating...' : 'Update Listing'}
    //         </button>

    //         {error && <p className="text-red-500">{error}</p>}
    //       </div>

    //     </form>
    //   </div>
    // </main>

    <main className="min-h-screen bg-gray-50 py-6 sm:py-10 px-3 sm:px-4">

  <div className="max-w-5xl w-full mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-lg">

    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
      Update Listing
    </h1>

    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

      {/* LEFT */}
      <div className="flex flex-col gap-3 sm:gap-4">

        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Property Name"
          className="border p-2.5 sm:p-3 rounded-lg text-sm sm:text-base"
        />

        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2.5 sm:p-3 rounded-lg text-sm sm:text-base"
        />

        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2.5 sm:p-3 rounded-lg text-sm sm:text-base"
        />

        {/* TYPE */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {['rent', 'sale'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm ${
                formData.type === type
                  ? 'bg-blue-600 text-white'
                  : 'border'
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* FEATURES */}
        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
          {['parking', 'furnished', 'offer'].map((item) => (
            <label key={item} className="flex gap-2 items-center">
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

          <div className="bg-gray-100 p-3 sm:p-4 rounded-xl text-center">
            <p className="text-xs sm:text-sm text-gray-500">🛏 Bedrooms</p>
            <input type="number" id="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="block mx-auto text-base sm:text-lg font-bold bg-transparent outline-none"/>
          </div>

          <div className="bg-gray-100 p-3 sm:p-4 rounded-xl text-center">
            <p className="text-xs sm:text-sm text-gray-500">🛁 Bathrooms</p>
            <input type="number" id="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="block mx-auto text-base sm:text-lg font-bold bg-transparent outline-none"/>
          </div>

          <div className="bg-gray-100 p-3 sm:p-4 rounded-xl text-center">
            <p className="text-xs sm:text-sm text-gray-500">💰 Price</p>
            <input type="number" id="regularPrice"
              value={formData.regularPrice}
              onChange={handleChange}
              className="block mx-auto text-base sm:text-lg font-bold bg-transparent outline-none"/>
          </div>

          {formData.offer && (
            <div className="bg-green-100 p-3 sm:p-4 rounded-xl text-center">
              <p className="text-xs sm:text-sm text-green-700">🔥 Discount</p>
              <input type="number" id="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                className="block mx-auto text-base sm:text-lg font-bold bg-transparent outline-none"/>
            </div>
          )}

        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-3 sm:gap-4">

        <input type="file" multiple
          onChange={(e) => setFiles(e.target.files)}
          className="border p-2.5 sm:p-3 rounded-lg text-sm"/>

        <button type="button"
          onClick={handleImageSubmit}
          className="bg-green-600 text-white p-2.5 sm:p-3 rounded-lg text-sm sm:text-base">
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>

        {formData.imageUrls.map((url, index) => (
          <div key={index} className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
            <img src={url} className="h-14 w-14 sm:h-16 sm:w-16 rounded object-cover"/>
            <button onClick={() => handleRemoveImage(index)}
              className="text-red-500 text-sm">
              Delete
            </button>
          </div>
        ))}

        <button
          disabled={loading || uploading}
          className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-lg text-sm sm:text-base">
          {loading ? 'Updating...' : 'Update Listing'}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

    </form>
  </div>
</main>
  );
};