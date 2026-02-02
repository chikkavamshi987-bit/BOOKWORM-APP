import {createSlice} from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name:"auth",
    initialState:{
        isLogged:false
    },
    reducers:{
        login : (state) => {state.isLogged = true},
        logout: (state) => {state.isLogged = false},
        setauth :(state,action) => {state.isLogged = action.payload},
    }
})

export const {login,logout,setauth} = authSlice.actions
export default authSlice.reducer