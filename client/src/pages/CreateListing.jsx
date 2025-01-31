import { useState } from 'react';

import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
export const CreateListing = () => {
    const {currentUser} = useSelector(state=>state.user);
    const [files,setFiles] = useState([]);
    const [uploading,setUploading]=useState(false);
    const [error,setError]=useState(false);
    const [loading,setLoading] = useState(false);
    const [formData,setFormData] = useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false,

    });

    

    const [imageUploadError,setImageUploadError]=useState(false);
    const navigate = useNavigate();
    // console.log(files);
 console.log("formData is ",formData);
    const handleImageSubmit = (e) =>{

 if(files.length > 0 && files.length + formData.imageUrls.length<7){

    setUploading(true);
    setImageUploadError(false);

    const promises = [] ;

     for(let i=0 ; i<files.length ; i++){
         promises.push(storeImage(files[i]));
  }

  Promise.all(promises).then((urls)=>{
    setFormData({
        ...formData,imageUrls:formData.imageUrls.concat(urls),

    });

    console.log("Updated imageUrls:", formData.imageUrls); 

    setImageUploadError(false);
    setUploading(false);
    
  }).catch((err) =>{

    setImageUploadError('Image upload failed');
    setUploading(false);
  })
}

else{
    setImageUploadError('You can only upload  6 images per listing'  );
    setUploading(false);
}   };

    

const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();

        // Add file and upload preset to FormData
        formData.append("file", file);
        formData.append("upload_preset", "mayank"); // Replace with your Cloudinary upload preset
        formData.append("cloud_name","diqum6tfd");

        // Make a POST request to Cloudinary's upload endpoint
        fetch("https://api.cloudinary.com/v1_1/diqum6tfd/image/upload", {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                if (data.secure_url) {
                    resolve(data.secure_url); // Return the URL of the uploaded image
                } else {
                    reject(new Error('Image upload failed'));
                }
            })
            .catch((error) => {
                reject(new Error('Error uploading image: ' + error.message));
            });
    });
};

    
const handleRemoveImage = (index)=>{

     setFormData({
        ...formData,
        imageUrls:formData.imageUrls.filter((_,i)=> i !== index),
     });

}

const handleChange = (e)=>{

     if(e.target.id === 'sale' || e.target.id === 'rent'){
        setFormData({
            ...formData,
            type:e.target.id
        })
     }

     if(e.target.id === 'parking' || e.target.id === 'furnished'|| e.target.id==='offer'){
        setFormData({
            ...formData,
            [e.target.id]:e.target.checked,
        })
     }

     if(e.target.type === 'number' || e.target.type==='text'|| e.target.type==='textarea'){
        setFormData({
            ...formData,
            [e.target.id]:e.target.value,
        })
     }


};

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{

        if(formData.imageUrls.length <1) return setError('You must upload at least one image');

        if( +formData.regularPrice< +formData.discountPrice) return setError('Discount price must be lower than regular price');
 
       setLoading(true);
       setError(false); 

       const res = await fetch('/api/listing/create',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',

        },
        body:JSON.stringify({
            ...formData,
            userRef:currentUser._id,
        }),
       });

       const data = await res.json();
       setLoading(false);
       if(data.success == false){
        setError(data.message);
       }

       navigate(`/listing/${data._id}`)


    }catch(error){
       setError(error.message);
       setLoading(false);
    }
  }

  return (

    <main className='p-3 max-w-4xl mx-auto'>
       <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1> 
       <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
 
   {/* left side */}
       <div className='flex flex-col gap-4 flex-1'>
        <input type="text" placeholder='Name' className='border p-3 
        rounded-lg' onChange={handleChange} value={formData.name}
        id='name' maxLength={62} minLength={10} required />

        <textarea type="text" placeholder='Descripion' className='border p-3 
        rounded-lg' id='description' onChange={handleChange} value={formData.description} required />

        <input type="text" placeholder='Address' className='border p-3 
        rounded-lg' id='address' onChange={handleChange} value={formData.address} required  />

{/*  for check boxes div hai  */}
       <div className='flex gap-6 flex-wrap'>

        <div className='flex gap-2'>
            <input type='checkbox' id='sale' className='w-5' onChange={handleChange}
             checked={formData.type==='sale'}/>
            <span> Sell</span>
        </div>

        <div className='flex gap-2'>
            <input type='checkbox' id='rent' className='w-5'
                onChange={handleChange} checked={formData.type==='rent'}
            />
            <span> Rent</span>
        </div>

        <div className='flex gap-2'>
            <input type='checkbox' id='parking' className='w-5'
                 onChange={handleChange} checked={formData.parking}
            />
            <span> Pariking spot</span>
        </div>


        <div className='flex gap-2'>
            <input type='checkbox' id='furnished' className='w-5'
                onChange={handleChange} checked={formData.furnished}
            />
            <span> furnished</span>
        </div>

        <div className='flex gap-2'>
            <input type='checkbox' id='offer' className='w-5'
                 onChange={handleChange} checked={formData.offer}
            />
            <span> Offer</span>
        </div>


       </div> 
       {/* yha pe checkbox div exit hota hai */}


   <div className='flex flex-wrap gap-6 '>
    <div className='flex items-center gap-2'>
        <input type='number' id='bedrooms' min='1' max='10' required
            className='p-3 border border-grey-300 rounded-lg'
            onChange={handleChange} value={formData.bedrooms}
        />
        <span>Beds</span>
  </div>

    <div className='flex items-center gap-2'>
        <input type='number' id='bathrooms' min='1' max='10' required
            className='p-3 border border-grey-300 rounded-lg'
            onChange={handleChange} value={formData.bathrooms}
        />
        <span>Baths</span>
  </div>

    <div className='flex items-center gap-2'>
        <input type='number' id='regularPrice' min='50' max='1000000' required
            className='p-3 border border-grey-300 rounded-lg'
            onChange={handleChange}
            value={formData.regularPrice}
        />
        <div className='flex flex-col items-center'>
        <p>Regular price</p>
        <span className='text-xs'>{` $/month`}</span>
        </div>
        
  </div>
   {formData.offer && (
  <div className='flex items-center gap-2'>
        <input type='number' id='discountPrice' min='0' max='1000000' required
            className='p-3 border border-grey-300 rounded-lg'
            onChange={handleChange}
            value={formData.discountPrice}
        />
        <div className='flex flex-col items-center'>
        <p>Discounted price</p> 
        <span className='text-xs'>{` $/month`}</span>

        </div>
        
  </div>
)}

   </div>


       </div>

  {/* right side */}

       <div className='flex flex-col flex-1 gap-4 '>

        <p className='font-semibold'>Images:
        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover {`max 6`}</span>
        </p>

         <div className='flex gap-4'>
            <input onChange={(e)=>setFiles(e.target.files)} 
             className='p-3 border border-gray-300 rounded w-full'
              type='file' id='images' accept='images/*' multiple />

            <button type='button' disabled={uploading}
             onClick={handleImageSubmit}  className='p-3 text-green-700 border border-green-700 
            rounded uppercase hover:shadow-lg disabled:opacity-80'>
            {uploading ? 'Uploading...' : 'Upload'}
            </button>

         </div>
         <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
         {
  formData.imageUrls.length > 0 &&
    formData.imageUrls.map((url, index) => (
        <div className='flex justify-between p-3 border items-center'>
        <img key={index} src={url} alt={`listing image ${index}`} className="w-40 h-40 object-contain rounded-lg"/>
        <button  type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase
         hover:opacity-75'>Delete</button>
        </div>
     
    ))
}


         <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg 
 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Creating...' : 'Create Listing'}</button>


 {error && <p className='text-red-700 text-sm'>{error}</p>}


       </div>


   

        </form>
    </main>


  )
}
