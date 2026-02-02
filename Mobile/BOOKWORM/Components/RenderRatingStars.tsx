import {View,Text,StyleSheet} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function RenderRatingStarts({rating}){
    const stars = [];
    for(let i=1; i<=5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i<=rating? "star" :"star-outline"}
                    size={16}
                    color={i<=rating? "#f4b400" : 'grey'}
                    style={{marginRight:2}}
                />
            )
        }
        return (
            <View style={Styles.starContainer}>
                {stars}
            </View>
        );
}

const Styles = StyleSheet.create({
    starContainer:{
        flexDirection:'row',
        gap:3,
        paddingVertical:5
    }
})