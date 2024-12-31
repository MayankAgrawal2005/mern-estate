import React from 'react'
import { useRef } from 'react';
import { useSelector } from 'react-redux'
export default function Profile() {
  const {currentUser} = useSelector((state)=>state.user);
  const fileref = useRef(null);
    return (



    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-4'>
      <input type='file' ref={fileref} hidden accept='image/*'/>

    <img onClick={()=>fileref.current.click()} src={currentUser.avatar} alt="profile"
       className='rounded-full h-24 w-24 object-cover
       mt-2 self-center cursor-pointer'
    />

    <input type='text' placeholder='username' id='username' className='
     border p-3 rounded-lg '/>
    <input type='email' placeholder='email' id='email' className='
     border p-3 rounded-lg '/>
    <input type='password' placeholder='password' id='password' className='
     border p-3 rounded-lg '/>
    
    <button className='bg-slate-700 p-3 uppercase text-white hover:opacity-95 disabled:opacity-80'>update</button>



      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign-out</span>

      </div>
    </div>



    
  )
}
