import React from 'react';
import {createStackNavigator} from '@react-navigation/stack'
import Login from '@/Screens/auth/Login';
import Register from '@/Screens/auth/Register';
import HomeTab from '@/Screens/HomeTab';

export default function LoginStack(){
    const Stack = createStackNavigator();
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="HomeTab" component={HomeTab}/>
        </Stack.Navigator>
    )
}