import {View,Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import React,{useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector,useDispatch} from 'react-redux';
import axios from 'axios';
import LoaderComponent from '@/Components/LoaderComponent'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {hideLoader,showLoader} from '@/redux/loaderSlice';
import ProfileHeader from '@/Components/ProfileHeader';
import LogoutButton from '@/Components/LogoutButton';
import {useNavigation} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {format} from 'date-fns';
import {API_URL} from '@/Constants/api'
import RenderRatingStarts from '@/Components/RenderRatingStars';

export default function ProfileScreen(){
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const [books, setBooks] = useState([]);
    const navigation = useNavigation();
    const loading = useSelector((state)=>state.loader.loader);

    const fetchbooks = async() =>{
        const token = await AsyncStorage.getItem('token');
        dispatch(showLoader())
        axios.get(`${API_URL}/user`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        }).then((res)=>{
            if(res.data.status === 'ok'){
                setBooks(res.data.data);
                dispatch(hideLoader())
            }
        }).catch((e)=>{
            console.log(e)
        })
    }
    useEffect(()=>{
        fetchbooks();
    },[])

    {loading && <LoaderComponent/>}

    return(
        <View style={{
            paddingTop:insets.top,
            flex:1,
            backgroundColor:'white'
        }}>
            <View style={{marginHorizontal:20}}>  
                <ProfileHeader/>
                <LogoutButton/>
                <View style={Styles.bookdetails}>
                    <Text>Your Recommendations 📚</Text>
                    <Text>{books.length} books</Text>
                </View>
            <FlatList
                data={books}
                keyExtractor={(item)=> item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) =>{
                    const formattedDate = format(new Date(item.createdAt),'MM/dd/yyyy')
                    return(
                        <View style={Styles.bookcontainer}>
                            <Image source={{uri:item.image}} style={Styles.image}/>
                            <View style={Styles.bookInfo}>
                                <Text style={Styles.booktitle}>{item.title}</Text>
                                <RenderRatingStarts rating={item.rating}/>
                                <Text numberOfLines={2}>{item.caption}</Text>
                                <Text style={Styles.createdAt}>{formattedDate}</Text>
                            </View>
                            <View>
                                <TouchableOpacity
                                style={Styles.deletbutton}
                                >
                                <Ionicons
                                    name="trash-bin-outline"
                                    size={20}
                                    color={'grey'}
                                />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}
                ListEmptyComponent={
                    <View style={Styles.emptycontainer}>
                        <Text style={Styles.emptytext}>No recommendation yet</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Create')}>
                            <Text style={Styles.emptytext}>Add Your First Book</Text>
                        </TouchableOpacity>
                    </View>
                }

            />
            </View>
        </View>
    )
}
const Styles = StyleSheet.create({
    bookdetails:{
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:15
    },
    emptycontainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    image:{
        width:80,
        height:150,
        resizeMode:'stretch',
        borderRadius:20
    },
    bookcontainer:{
        flexDirection:'row',
        padding:10,
        borderWidth:1,
        borderRadius:20,
        marginBottom:10,
        gap:10
    },
    deletbutton:{
        justifyContent:'center',
        flexShrink:1,
        flex:1
    },
    bookInfo:{
        width:200,
        gap:5,
        flexShrink:1
    },
    emptytext:{
        fontSize:16,
        marginBottom:10,
        color:'grey',
        fontWeight:'500'
    },
    booktitle:{
        fontSize:16,
        fontWeight:'500'
    },
    createdAt:{
        fontSize:12,
        fontWeight:'400',
        color:'grey'
    }
})