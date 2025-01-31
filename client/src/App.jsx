import React from "react";
import { Search } from "./pages/Search";
import {Routes,Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import About from "./pages/About";
import { Listing } from "./pages/Listing";
import Header from "./components/Header";
import { PrivateRoute } from "./components/PrivateRoute";
import { CreateListing } from "./pages/CreateListing";
import { UpdateListing } from "./pages/UpdateListing";
export default function App(){
  return(

      <div>
        
         <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/listing/:listingId" element={<Listing/>}/>
         
          <Route path="/search" element={<Search/>}/>
          <Route path="/sign-in" element={<Signin/>}/>
          <Route path="/sign-up" element={<Signup/>}/>

          
          <Route element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/create-listing" element={<CreateListing/>}/>
          <Route path="/update-listing/:listingId" element={<UpdateListing/>}/>
          </Route>
          
        </Routes>

      </div>
   
  )

}