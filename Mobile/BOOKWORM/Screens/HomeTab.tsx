import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Create from '@/Screens/CreateScreen';
import Profile from '@/Screens/ProfileScreen';
import Home from '@/Screens/HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function HomeTab(){
   const insets = useSafeAreaInsets(); 
    const Tab = createBottomTabNavigator();
    return(
        <Tab.Navigator 
            screenOptions={{
                headerShown:false,
                headerTitleStyle:{
                    color:'#4CAF50',
                    fontWeight:'600'
                },
                headerShadowVisible:false,
                tabBarActiveTintColor:'#4CAF50',
                tabBarInactiveTintColor:'#',
                tabBarStyle:{
                    backgroundColor:'#ffffff',
                    borderWidth:1,
                    borderTopColor:'#c8e6c9',
                    paddingTop:5,
                    height:60+insets.bottom,
                }
            }}
        >
            <Tab.Screen name="Home" component={Home}
                options={{
                   tabBarIcon:({focused,color,size})=>(<Ionicons name="home-outline" size={size} color={color}/>)
                }}
            />
            <Tab.Screen name="Create" component={Create}
                options={{
                   tabBarIcon:({focused,color,size})=>(<Ionicons name="add-circle-outline" size={size} color={color}/>)
                }}
            />
            <Tab.Screen name="Profile" component={Profile}
                options={{
                   tabBarIcon:({focused,color,size})=>(<Ionicons name="person-outline" size={size} color={color}/>)
                }}
            />
        </Tab.Navigator>
    )
}