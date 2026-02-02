import {View, Text,Image,StyleSheet} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {format} from 'date-fns';
import {SvgUri} from 'react-native-svg'

export default function ProfileHeader(){
    const user = useSelector((state)=> state.user.user);
    console.log(user);
    if(!user){
        return null;
    }
    const formattedDate = format(new Date(user.createdAt),'MM/dd/yyyy')
    return(
        <View style={Styles.profileheader}>
            <SvgUri uri={user.profile} style={Styles.profileimage}/>
            <View>
                <Text style={Styles.username}>{user.name}</Text>
                <Text style={Styles.email}>{user.email}</Text>
                <Text>🗓️ Joined {formattedDate}</Text>
            </View>
            
        </View>
    )
}

const Styles = StyleSheet.create({
    profileheader:{
        flexDirection:'row',
        borderWidth:1,
        borderRadius:20,
        borderColor:'#688f68',
        padding:20,
        marginVertical:20
    },
    profileimage:{
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    username:{
        fontSize: 20,
        fontWeight: "700",
        color:'#2e5a2e',
        marginBottom: 4,
    },
    email: {
    fontSize: 12,
    color: '#688f68',
    marginBottom: 4,
    },
})