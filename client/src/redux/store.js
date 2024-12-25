import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer ,persistStore} from 'redux-persist';
import { version } from 'mongoose';
import storage from 'redux-persist/lib/storage';


const rootReducer = combineReducers({user:userReducer});

const persistConfig = {
    key:'root',
    storage,
    version:1,
};

const persistedReducer = persistReducer(persistConfig,rootReducer);



export const store = configureStore({
    // reducer:{  user:userReducer },
    reducer: persistedReducer,
    // this is to prevent from the any error in the browser
    middleware:(getDefaultMiddleWare)=>getDefaultMiddleWare({
        serializableCheck:false,
    }),

})


export const persistor = persistStore(store);