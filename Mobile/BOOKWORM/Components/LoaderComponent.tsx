import {SafeAreaView} from 'react-native-safe-area-context';
import {ActivityIndicator} from 'react-native';
import React from 'react';


export default function LoaderComponent(){
    return(
        <SafeAreaView style={{
            flex:1,
            justifyContent:'center'
        }}>
            <ActivityIndicator size='large'/>
        </SafeAreaView>
    )
}