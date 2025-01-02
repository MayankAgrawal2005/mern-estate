import React from 'react'
import { useState } from 'react';
import { useRef } from 'react';
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
  const dispatch = useDispatch();

  console.log(formData)

const handleChange = (e)=>{

  setFormData ({...formData, [e.target.id]:e.target.value});

}

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

    return (



    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input type='file' ref={fileref} hidden accept='image/*'/>

    <img onClick={()=>fileref.current.click()} src={ formData?.avatara || currentUser.avatar} alt="profile"
       className='rounded-full h-24 w-24 object-cover
       mt-2 self-center cursor-pointer'
    />

    <input type='text' placeholder='username' defaultValue={currentUser.username}
    onChange={handleChange} id='username' className=' border p-3 rounded-lg '/>


    <input type='email' placeholder='email' id='email'  defaultValue={currentUser.email}
    onChange={handleChange}className=' border p-3 rounded-lg '/>


    <input type='password' placeholder='password' id='password'
     onChange={handleChange} className=' border p-3 rounded-lg '/>
    
    <button disabled={loading} className='bg-slate-700 p-3 uppercase text-white hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...':'Update'}</button>



      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign-out</span>
  
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ' ' }</p>
      <p className='text-green-700 mt-5'>{updateSuccess? 'update successfully':''}</p>
    </div>



    
  )
}
