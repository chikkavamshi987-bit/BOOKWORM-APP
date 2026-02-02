import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name:"user",
    initialState:{
        user:null,
    },
    reducers:{
        loginSuccess:(state,action)=>{
            state.user = action.payload;
        },
        userlogout:(state) =>{
            state.user = null;
        }
    }
})

export const {loginSuccess,userlogout } = userSlice.actions;
export default userSlice.reducer;