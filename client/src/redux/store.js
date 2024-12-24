import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
export const store = configureStore({
    reducer:{  user:userReducer },
    // this is to prevent from the any error in the browser
    middleware:(getDefaultMiddleWare)=>getDefaultMiddleWare({
        serializableCheck:false,
    }),

})