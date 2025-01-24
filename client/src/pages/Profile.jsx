import React from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { updateUserFailure,updateUserSuccess,updateUserStart,
   deleteUserFailure,deleteUserStart,deleteUserSuccess,
  signOutUserFailure ,signOutUserStart,signOutUserSuccess} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
export default function Profile() {
  const {currentUser,loading,error} = useSelector((state)=>state.user);
  const fileref = useRef(null);
  const [formData,setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || "");
  const [showListingsError,setShowListingsError]=useState(false);
  const dispatch = useDispatch();
  const [userListings,setUserListings]=useState([]);
  console.log("currentUser is ",currentUser);

const handleChange = (e)=>{

  setFormData ({...formData, [e.target.id]:e.target.value});

}


const handleImageChange = async (e) => {
  const file = e.target.files[0];

  if (file) {
   
    // Set up a FormData object to send to the Cloudinary API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mayank'); 
    formData.append("cloud_name", "diqum6tfd");

    try {
      // Upload the image to Cloudinary
      const res = await fetch("https://api.cloudinary.com/v1_1/diqum6tfd/image/upload", {
        method: 'POST',
        body: formData,
      });

      // Parse the JSON response
      const data = await res.json();

      // Check if the secure_url is available in the response
      if (data.secure_url) {
        const imageUrl = data.secure_url;  // The URL of the uploaded image

        // Update the formData with the image URL
        setFormData((prev) => ({
          ...prev,
          avatar: imageUrl,  // Save the Cloudinary URL
        }));

        // Update the preview with the Cloudinary URL
        setAvatarPreview(imageUrl);
      } else {
        console.error("Cloudinary upload failed, secure_url is missing in the response");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  }
};
const handleSubmit= async(e)=>{

  e.preventDefault();

  

  try{

    dispatch(updateUserStart());

    
    const res = await fetch(`/api/user/update/${currentUser._id}`,{
    method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),

    }) ;

    const data = await res.json();
    if(data.success===false){
      dispatch(updateUserFailure(data.message));
      return;
    }

     dispatch(updateUserSuccess(data));
     setUpdateSuccess(true);

  }catch(error){
   dispatch(updateUserFailure(error.message));

  }

}

 const handleDelete = async()=>{

   try{

    dispatch(deleteUserStart());
    const res =  await fetch(`/api/user/delete/${currentUser._id}`,{

       method:'DELETE',
 });

  const data = await res.json();
  if(data.success===false){
    dispatch(deleteUserFailure(data.message));
    return
  }

   dispatch(deleteUserSuccess(data));



   }catch(error){
    dispatch(deleteUserFailure(error.message));
   }

 }

 const  handleSignout = async() =>{

   try{
    dispatch(signOutUserStart());
     const res = await fetch('/api/auth/signout');

     const data = await res.json();
     if(data.success === false){
      dispatch(signOutUserFailure(data.message));
      return;
     }

     dispatch(signOutUserSuccess(data));

   }catch(error){
 dispatch(signOutUserFailure(data.message));
   }
   
 }

const handleShowListings = async()=>{

  try{

     setShowListingsError(false);
    const res = await fetch(`/api/user/listings/${
      currentUser._id}`);

      const data = await res.json();
      if(data.success===false){
        setShowListingsError(true);
        return;
      }

  
       setUserListings(data);
       console.log("listing is",userListings);

  }catch(error){
  showListingsError(true);
  }

}

// console.log(formData);

const handleListingDelete = async(listingId)=>{

  try{

    const res = await fetch(`/api/listing/delete/${listingId}`,{
      method:'DELETE',

    });

    const data = await res.json();
    if(data.success===false){
      console.log(data.message);
      return;
    }

    setUserListings((prev)=>prev.filter((listing)=>listing._id!=listingId));

  }catch(error){
    console.log(error.message);
  }

}


    return (



    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input type='file' ref={fileref} onChange={handleImageChange} hidden accept='image/*'/>

    <img onClick={()=>fileref.current.click()} src={ avatarPreview} alt="profile"
       className='rounded-full h-24 w-24 object-cover
       mt-2 self-center cursor-pointer'
    />

    <input type='text' placeholder='username' defaultValue={currentUser.username}
    onChange={handleChange} id='username' className=' border p-3 rounded-lg '/>


    <input type='email' placeholder='email' id='email'  defaultValue={currentUser.email}
    onChange={handleChange}className=' border p-3 rounded-lg '/>


    <input type='password' placeholder='password' id='password'
     onChange={handleChange} className=' border p-3 rounded-lg '/>
    
    <button disabled={loading} className='bg-slate-700 p-3 uppercase text-white hover:opacity-95 disabled:opacity-80'>{loading ? 'Updating...':'Update'}</button>

     <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 ' to={"/create-listing"}>
      Create Lising
     </Link>

      </form>



      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign-out</span>
  
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ' ' }</p>
      <p className='text-green-700 mt-5'>{updateSuccess? 'update successfully':''}</p>

      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error Showing listings':''}</p>

  

      {userListings && 
         userListings.length>0 && 

        <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
        { userListings.map((listing)=>(

<div key={listing._id} className='border rounded-lg p-3 flex justify-between gap-4 items-center'>

  <Link to={`/listing/${listing._id}`}>

<img src={listing.imageUrls[0]} alt="listingImage" className='h-16 w-16 object-contain '/>
 </Link>

 <Link className='text-slate-700 font-semibold flex-1
  hover:underline truncate' to={`/listing/${listing._id}`}>
 <p >{listing.name} </p>

 </Link>

 <div className='flex flex-col items-center'>
   <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase '>Delete</button>

   <Link to={`/update-listing/${listing._id}`} >
   <button className='text-green-700 uppercase '>Edit</button>
  </Link>
 </div>
    

  </div>
       ))}
        </div>



           }



    </div>



    
  )
}
