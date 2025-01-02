import { createSlice } from "@reduxjs/toolkit";

// first create the intial state

const initialState = {
    currentUser:null,
    error:null,
    loading:false,

};

const userSlice =createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
            // action we get from database
        },signInSuccess:(state,action)=>{
            console.log('Reducer received payload:', action.payload);
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },

        updateUserStart:(state)=>{
            state.loading=true;
        },

        updateUserSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },

        updateUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        }




    }
});

// uske bad ye reducers ke function ko export karenge

export const {signInStart,signInSuccess,signInFailure,updateUserStart,updateUserFailure,updateUserSuccess} = userSlice.actions;

export default userSlice.reducer;