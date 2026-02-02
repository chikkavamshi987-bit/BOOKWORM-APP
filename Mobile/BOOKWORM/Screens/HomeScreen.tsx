import {View, Text, StyleSheet, FlatList, Image, ActivityIndicator, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{useEffect,useState} from 'react';
import axios from 'axios';
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import {format} from 'date-fns';
import LoaderComponent from '@/Components/LoaderComponent';
import {SvgUri} from 'react-native-svg'
import {API_URL} from  '@/Constants/api';
import RenderRatingStarts from '@/Components/RenderRatingStars';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export default function HomeScreen(){
    const [books,setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);


    const fetchbooks = async (pageNum =1, isRefresh=false) =>{
        const token = await AsyncStorage.getItem('token');
        if(isRefresh) setRefreshing(true)
          else if (pageNum === 1) setLoading(true)  
        return axios.get(`${API_URL}/getbooks?page=${pageNum}&limit=5`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then((res)=>{
            if(res.data.status === 'ok'){
                const data = res.data.data.books;
                const uniqueBooks =
                isRefresh || pageNum === 1
                ? data
                : Array.from(new Set([...books, ...data].map((book) => book._id))).map((id) =>
                    [...books, ...data].find((book) => book._id === id)
                    );
                setBooks(uniqueBooks);
                setHasMore(pageNum < res.data.data.totalPages)
                setPage(pageNum)
            }
        })
        .catch((e)=>console.log("Error in fetching books",e))
        .finally(()=>{
                setLoading(false);
                setRefreshing(false);
        })
    }
    const handleRefresh = ()=>{
        setHasMore(true);
        fetchbooks(1,true)
    }
    const handleLoadMore  = async() =>{
       if(!hasMore && loading && refreshing)
       {
        await sleep(1000)
        fetchbooks(page+1)
       }
         
    }
    useEffect(()=>{
     fetchbooks(1);   
    },[])

    if(loading){
       return  <LoaderComponent/>
    }
    return(
        <View style={{paddingTop:insets.top,flex:1,backgroundColor:'#ffffff'}}>
            <StatusBar barStyle='dark-content' backgroundColor='#ffffff'/>
            <FlatList
                data={books}
                keyExtractor={(item)=>item._id}
                renderItem={({item})=>{
                    const formattedDate = format(new Date(item.updatedAt),'MM/dd/yyyy')
                    return(
                        <View style={Styles.bookcontainer}>
                            <View style={Styles.bookheader}>
                                <SvgUri uri={item.user.Profile}
                                    style={{width:50,height:35,borderRadius:15}}
                                />
                                <Text style={Styles.username}>{item.user.name}</Text>
                            </View>
                            <View>
                                <Image source={{uri:item.image}} 
                                    style={{width:'100%',height:150,borderRadius:15,marginBottom:10}}
                                />
                            </View>
                            <View>
                                <Text style={Styles.bookTitle}>{item.title}</Text>
                                <Text style={Styles.caption}>{item.caption}</Text>
                                <RenderRatingStarts rating={item.rating}/>
                                <Text style={{fontSize:14,color:'grey'}}>Shared on {formattedDate}</Text>
                            </View>
                        </View>
                    )
                }
                }
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    !loading &&(
                        <View style={Styles.emptycontainer}>
                        <Text>No recommendation yet</Text>
                        <Text>Be the first to share a book!</Text>
                        </View>
                    )
                }
                ListHeaderComponent={
                    <View style={Styles.headercontext}>
                        <Text style={{color:'#4caf50',fontSize:32,fontFamily: "JetBrainsMono-Medium",marginBottom:8,fontWeight:'bold'}}>BookWorm🐛</Text>
                        <Text style={{fontSize:16,color:'#688f68'}}>Discover great reads from the community</Text>
                    </View>
                }
                ItemSeparatorComponent={()=><View style={{marginBottom:20}}/>}
                ListFooterComponent={
                    hasMore && books.length>0 ?
                    <ActivityIndicator size='small'/> :
                    null
                }
            />
        </View>
    )
}

const Styles = StyleSheet.create({
    emptycontainer:{
        flex:1,
        backgroundColor:'#ffffff',
        justifyContent:'center',
        alignItems:'center'  
    },
    headercontext:{
        alignItems:'center',
        marginBottom:32
    },
    bookcontainer:{
        marginHorizontal:20,
        padding:20,
        borderWidth:1,
        borderColor:'#688f68',
        borderRadius:20
    },
    bookheader:{
        flexDirection:'row',
        marginBottom:10
    },
    username:{
    fontSize: 17,
    fontWeight: "600",
    },
    caption: {
    fontSize: 14,
    color: '#1b361b',
    marginBottom: 8,
    lineHeight: 20,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: '#2e5a2e',
    marginBottom: 6,
  },
})
