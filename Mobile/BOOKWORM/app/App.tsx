import LoginStack from "@/Screens/auth/LoginStack";
import HomeTab from '@/Screens/HomeTab';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect,useState} from 'react';
import { useSelector} from 'react-redux';

export default function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLogged);
  
  return (
    <>
      {isLoggedIn ?<HomeTab/>:<LoginStack/>}
    </>
  );
}
