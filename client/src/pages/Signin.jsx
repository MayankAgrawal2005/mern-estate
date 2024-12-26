import React, { useState } from 'react';
import {Link }from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// ye bhi redux ka part hai dispatch
import { useDispatch, useSelector } from 'react-redux';
import { signInStart,signInFailure,signInSuccess } from '../redux/user/userSlice';
import { OAuth } from '../components/OAuth';

export default function Signin() {
 
  const [formData,setformData] = useState({});
  //  const [error,setError]= useState(null);
  //  const [loading,setloading]=useState(false);
  const {loading,error} = useSelector((state)=>state.user);
  // isme user vo hai jo name createslice mai name rakha tha
   const navigate = useNavigate();
   // dispatch redux ka part hai'

   const dispatch = useDispatch();

  const handleChange=(e)=>{

     setformData(
      {
        ...formData ,
        [e.target.id]:e.target.value,
      }
     );

     
  };

  const handleSubmit = async (e)=>{
     e.preventDefault();

     try{

      // setloading(true); iski jagah redux use karenge
      dispatch(signInStart());
     const res = await fetch('/api/auth/signin',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
     });

      // loading
     const data = await res.json();
     if(data.success===false){
      // setloading(false);
      // setError(data.message);
      // in this place redux is use
      dispatch(signInFailure(data.message));
      return;
     }

// loading
      // setloading(false);
      // setError(null);
      // yha bhi redux is use
      dispatch(signInSuccess(data));
     console.log(data);
     navigate('/');

     }
     catch(error){
      // setloading(false);
      // setError(error.message);
      // yha bhi redux use
      dispatch(signInFailure(error.message));
     }
     

  };

console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>

 <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

   <form  onSubmit={handleSubmit} className='flex flex-col gap-4 '>
      
      <input type='email' placeholder='email ' 
      className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
      <input type='password' placeholder='password ' 
      className='border p-3 rounded-lg' id='password' onChange={handleChange}/>

      <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg 
       uppercase hover:opacity-95 disabled:opacity-80'>
      {loading ? 'Loading...': 'Sign In'}
       </button>

       <OAuth/>

 </form>
 <div className='flex gap-2 mt-5'>
  <p> Don`t Have an account</p>
  <Link to='/sign-up'>
    <span className='text-blue-700'>Sign up</span>
  </Link>
 </div>


{error && <p className='text-red-500 mt-5' >{error}</p>}
    </div>
  )
}
